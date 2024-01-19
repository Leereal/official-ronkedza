import PostForm from "@/components/common/PostForm";
import { getPostById } from "@/lib/actions/post.actions";
import { auth } from "@clerk/nextjs";

const UpdatePost = async ({ params: { id } }) => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId;
  const post = await getPostById(id);
  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">
          Update Post {userId}
        </h3>
      </section>

      <div className="wrapper my-8">
        <PostForm userId={userId} type="Update" post={post} postId={post._id} />
      </div>
    </>
  );
};

export default UpdatePost;
