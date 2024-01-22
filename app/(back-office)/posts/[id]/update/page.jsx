import PostForm from "@/components/common/PostForm";
import TopSection from "@/components/common/TopSection";
import { getPostById } from "@/lib/actions/post.actions";
import { auth } from "@clerk/nextjs";

const UpdatePost = async ({ params: { id } }) => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId;
  const post = await getPostById(id);
  return (
    <>
      <TopSection title={`Update Post: ${post.title}`} />

      <div className="wrapper my-8">
        <PostForm userId={userId} type="Update" post={post} postId={post._id} />
      </div>
    </>
  );
};

export default UpdatePost;
