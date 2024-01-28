import { Logo } from "@/components/Logo";
import CategoryFilter from "@/components/common/CategoryFilter";
import Collection from "@/components/common/Collection";
import Search from "@/components/common/Search";
import { getAllPosts } from "@/lib/actions/post.actions";

const Dashboard = async (searchParams) => {
  const page = Number(searchParams?.page) || 1;
  const searchText = searchParams?.query || "";
  const category = searchParams?.category || "";

  const posts = await getAllPosts({
    query: searchText,
    category,
    page,
    limit: 6,
  });

  return (
    <section id="events" className="wrapper my-8 flex flex-col gap-8 md:gap-12">
      <h2 className="h2-bold">
        Trust by <br /> Thousands of Influencers
      </h2>

      <div className="flex w-full flex-col gap-5 md:flex-row">
        <Search />
        <CategoryFilter />
      </div>

      <Collection
        data={posts?.data}
        emptyTitle="No Posts Found"
        emptyStateSubtext="Come back later"
        collectionType="All_Events"
        limit={6}
        page={page}
        totalPages={posts?.totalPages}
      />
    </section>
  );
};

export default Dashboard;
