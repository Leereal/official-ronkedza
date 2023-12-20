import PostForm from "@/components/common/PostForm";
import { auth } from "@clerk/nextjs";

const CreatePost = () => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId;
  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">
          Create Post
        </h3>
      </section>

      <div className="wrapper my-8">
        <PostForm userId={userId} type="Create" />
      </div>
    </>
  );
};

export default CreatePost;
