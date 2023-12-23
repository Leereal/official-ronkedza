import Collection from "@/components/common/Collection";
import {
  getPostById,
  getRelatedPostsByCategory,
} from "@/lib/actions/post.actions";
import Image from "next/image";

const PostDetails = async ({ params: { id }, searchParams }) => {
  const post = await getPostById(id);

  const relatedPosts = await getRelatedPostsByCategory({
    categoryId: post.category._id,
    postId: post._id,
    page: searchParams.page,
  });

  return (
    <>
      <section className="flex justify-center bg-primary-50 bg-dotted-pattern bg-contain">
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:max-w-7xl">
          <Image
            src={post.featured_image}
            alt="hero image"
            width={1000}
            height={1000}
            className="h-full min-h-[300px] object-cover object-center"
          />

          <div className="flex w-full flex-col gap-8 p-5 md:p-10">
            <div className="flex flex-col gap-6">
              <h2 className="h2-bold">{post.title}</h2>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex gap-3">
                  <p className="p-bold-20 rounded-full bg-green-500/10 px-5 py-2 text-green-700">
                    {post.is_published}
                  </p>
                  <p className="p-medium-16 rounded-full bg-grey-500/10 px-4 py-2.5 text-grey-500">
                    {post.category.name}
                  </p>
                </div>

                <p className="p-medium-18 ml-2 mt-2 sm:mt-0">
                  by{" "}
                  <span className="text-primary-500">
                    {post.creator.firstName} {post.creator.lastName}
                  </span>
                </p>
              </div>
            </div>
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
