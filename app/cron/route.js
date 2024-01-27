import { postToSocials } from "@/lib/actions/socialPost.actions";
import {
  getSocialTokenById,
  getSocialTokensByUser,
} from "@/lib/actions/socialToken.actions";
import { connectToDatabase } from "@/lib/database";
import ScheduledPost from "@/lib/database/models/scheduledPost.model";
import getRecurrenceRule from "@/lib/scheduler-recurrence-rule";
import { handleError } from "@/lib/utils";
import { NextResponse } from "next/server";
import schedule from "node-schedule";

export async function GET(req) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Get all scheduled posts that are due
    const now = new Date();
    const dueScheduledPosts = await ScheduledPost.find({
      startDateTime: { $lte: now },
      status: { $in: ["new", "failed", "paused"] },
    })
      .populate({
        path: "socialTokens",
        model: "SocialToken",
      })
      .populate("post");
    // Process and post each due scheduled post
    for (const scheduledPost of dueScheduledPosts) {
      try {
        // Get the social tokens object first
        const socialTokens = await Promise.all(
          scheduledPost.socialTokens.map(async (id) => {
            const socialToken = await getSocialTokenById(id);
            return socialToken;
          })
        );

        // // Your logic for posting the scheduled post goes here
        await postToSocials(scheduledPost.post, socialTokens);

        // // Update the scheduled post status accordingly, for example, set it to "completed"
        if (
          scheduledPost.recurrence === "once" ||
          (!scheduledPost.recurrence === "once" &&
            scheduledPost.endDateTime <= now)
        ) {
          scheduledPost.status = "completed";
          await scheduledPost.save();
        } else {
          // Handle recurrence by updating startDateTime
          if (scheduledPost.recurrence) {
            const recurrenceRule = getRecurrenceRule(
              scheduledPost.recurrence,
              scheduledPost.startDateTime
            );

            // Update startDateTime for recurrence
            scheduledPost.startDateTime = recurrenceRule.nextInvocation();
          }
        }
        await scheduledPost.save();
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
