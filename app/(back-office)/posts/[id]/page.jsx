import Collection from "@/components/common/Collection";
import PostForm from "@/components/common/PostForm";
import RepostModal from "@/components/common/RepostModal";
import TopSection from "@/components/common/TopSection";
import { Button } from "@/components/ui/button";
import {
  getPostById,
  getRelatedPostsByCategory,
} from "@/lib/actions/post.actions";
import { auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { FaEdit } from "react-icons/fa";
import { FaRetweet } from "react-icons/fa6";

const PostDetails = async ({ params: { id }, searchParams }) => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId;
  const post = await getPostById(id);
  if (!post) {
    // Handle the case where the post is not found, e.g., redirect to an error page
    // or display a message to the user.
    return <div>Post not found</div>;
  }
  const relatedPosts = await getRelatedPostsByCategory({
    categoryId: post?.category._id,
    postId: post?._id,
    page: searchParams.page,
  });

  return (
    <>
      <TopSection title={post?.title} />
      <section className="flex justify-center bg-primary-50 bg-dotted-pattern bg-contain">
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:max-w-7xl">
          <Image
            src={
              post?.attachments && post?.attachments.length
                ? post?.attachments[0]
                : "/images/NOIMAGE.jpg"
            }
            alt="hero image"
            width={500}
            height={500}
            className="h-full min-h-[300px] object-cover object-center rounded-2xl"
          />

          <div className="flex w-full flex-col gap-8 p-5 md:p-10">
            <div className="flex flex-col gap-6">
              <h2 className="h2-bold">{post?.title}</h2>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex gap-3">
                  <p className="p-bold-20 rounded-full bg-green-500/10 px-5 py-2 text-green-700">
                    {post.is_published ? "Published" : "Draft"}
                  </p>
                  <p className="p-medium-16 rounded-full bg-grey-500/10 px-4 py-2.5 text-grey-500">
                    {post?.category.name}
                  </p>
                </div>

                <p className="p-medium-18 ml-2 mt-2 sm:mt-0">
                  by{" "}
                  <span className="text-primary-500">
                    {post.creator.firstName} {post.creator.lastName}
                  </span>
                </p>
                <Link href={`/posts/${post._id}/update`}>
                  <FaEdit width={20} height={20} className="text-green-500" />
                </Link>
              </div>
            </div>
            <div className="text-justify">{post.content}</div>
            <RepostModal userId={userId} post={post} />
          </div>
        </div>
      </section>

      {/* POSTS with the same category */}
      <section className="wrapper my-8 flex flex-col gap-8 md:gap-12">
        <h2 className="h2-bold">Related Posts</h2>

        <Collection
          data={relatedPosts?.data}
          emptyTitle="No Posts Found"
          emptyStateSubtext="Come back later"
          collectionType="All_Posts"
          limit={3}
          page={searchParams.page}
          totalPages={relatedPosts?.totalPages}
        />
      </section>
    </>
  );
};

export default PostDetails;
