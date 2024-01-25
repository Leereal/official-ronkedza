import PostForm from "@/components/common/PostForm";
import PostList from "@/components/common/PostList";
import TopSection from "@/components/common/TopSection";
import { auth } from "@clerk/nextjs";

const CreatePost = () => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId;
  return (
    <>
      <TopSection title="Create Post" />
      <div className="wrapper my-8 space-y-6">
        <PostForm userId={userId} type="Create" />
        {/* <PostList /> */}
      </div>
    </>
  );
};

export default CreatePost;
