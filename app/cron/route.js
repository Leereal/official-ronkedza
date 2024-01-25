import { postToSocials } from "@/lib/actions/socialPost.actions";
import { connectToDatabase } from "@/lib/database";
import ScheduledPost from "@/lib/database/models/scheduledPost.model";
import getRecurrenceRule from "@/lib/scheduler-recurrence-rule";
import { handleError } from "@/lib/utils";
import { NextResponse } from "next/server";
import schedule from "node-schedule";

export async function GET(req) {
  console.log("Log Get");
  try {
    // Connect to the database
    await connectToDatabase();

    // Get all scheduled posts that are due
    const now = new Date();
    const dueScheduledPosts = await ScheduledPost.find({
      scheduled_time: { $lte: now },
      status: { $in: ["new", "failed", "paused"] },
    })
      .populate({
        path: "socialPlatforms",
        model: "SocialPlatform",
        select: "name slug", // Specify the fields you want to populate
      })
      .populate("post");

    // Process and post each due scheduled post
    for (const scheduledPost of dueScheduledPosts) {
      try {
        // Your logic for posting the scheduled post goes here
        await postToSocials(scheduledPost.post, scheduledPost.socialPlatforms);

        // Update the scheduled post status accordingly, for example, set it to "completed"
        scheduledPost.status = "completed";
        await scheduledPost.save();

        // Handle recurrence
        if (scheduledPost.recurrence) {
          const recurrenceRule = getRecurrenceRule(
            scheduledPost.recurrence,
            scheduledPost.scheduled_time
          );
          schedule.scheduleJob(recurrenceRule, async () => {
            const newScheduledPost = new ScheduledPost({
              post: scheduledPost.post,
              user: scheduledPost.user,
              scheduled_time: recurrenceRule.nextInvocation(),
              recurrence: scheduledPost.recurrence,
              socialPlatforms: scheduledPost.socialPlatforms,
              timezone: scheduledPost.timezone,
            });

            await newScheduledPost.save();
          });
        }
      } catch (error) {
        // Handle any errors during the posting process
        console.error(
          `Error posting scheduled post ${scheduledPost._id}:`,
          error
        );
        scheduledPost.status = "failed";
        await scheduledPost.save();
      }
    }

    console.log("Scheduled posts processed successfully");
    return NextResponse.json({ message: "success" });
  } catch (error) {
    handleError(error);
  }
}
