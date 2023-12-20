import Link from "next/link";

export default function Home() {
  return (
    <div className="relative isolate px-6 pt-14 lg:px-8">
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Ronkedza Social Connect
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Ronkedza Social Connect is a powerful platform that enables seamless
            integration with various social media networks. With features for
            managing social accounts, scheduling and publishing posts, and team
            collaboration, the ultimate tool for boosting your social media
            presence and engagement.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/sign-in"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Log into your account
            </Link>
            <Link
              href="/sign-up"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Or create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
