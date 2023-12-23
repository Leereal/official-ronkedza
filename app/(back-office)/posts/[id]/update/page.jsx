import PostForm from "@/components/common/PostForm";
import { auth } from "@clerk/nextjs";

const UpdatePost = () => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId;
  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">
          Update Post {userId}
        </h3>
      </section>

      <div className="wrapper my-8">
        <PostForm userId={userId} type="Update" />
      </div>
    </>
  );
};

export default UpdatePost;
