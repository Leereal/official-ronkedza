import PostForm from "@/components/common/PostForm";
import TopSection from "@/components/common/TopSection";
import { auth } from "@clerk/nextjs";

const CreatePost = () => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId;
  return (
    <>
      <TopSection title="Create Post" />
      <div className="wrapper my-8">
        <PostForm userId={userId} type="Create" />
      </div>
    </>
  );
};

export default CreatePost;
