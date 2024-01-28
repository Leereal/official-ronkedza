import { formatDateTime } from "@/lib/utils";
import { auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaEdit } from "react-icons/fa";
import { DeleteConfirmation } from "./DeleteConfirmation";
import RepostModal from "./RepostModal";

const Card = ({ post }) => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId;

  const isPostCreator = userId === post.creator._id.toString();

  return (
    <div className="group relative flex min-h-[380px] w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg md:min-h-[438px]">
      <Link
        href={`/posts/${post._id}`}
        style={{
          backgroundImage: `url(${
            post?.attachments && post.attachments.length
              ? post?.attachments[0]
              : "/images/NOIMAGE.jpg"
          })`,
        }}
        className="flex-center flex-grow bg-gray-50 bg-cover bg-center text-grey-500"
      />
      {/* IS EVENT CREATOR ... */}

      {isPostCreator && (
        <div className="absolute right-2 top-2 flex flex-col gap-4 rounded-xl bg-white p-3 shadow-sm transition-all">
          <Link href={`/posts/${post._id}/update`}>
            <FaEdit width={20} height={20} className="text-green-500" />
          </Link>

          <DeleteConfirmation postId={post._id} />
        </div>
      )}

      <div className="flex min-h-[230px] flex-col gap-3 p-5 md:gap-4">
        <div className="flex gap-2">
          <p className="p-semibold-14 w-min rounded-full bg-grey-500/10 px-4 py-1 text-grey-500 line-clamp-1">
            {post.category.name}
          </p>
        </div>

        <p className="p-medium-16 p-medium-18 text-grey-500">
          {formatDateTime(post.createdAt).dateTime}
        </p>

        <Link href={`/posts/${post._id}`}>
          <p className="p-medium-16 md:p-medium-20 line-clamp-2 flex-1 text-black">
            {post.title}
          </p>
        </Link>

        <div className="flex-between w-full">
          <p className="p-medium-14 md:p-medium-16 text-grey-600">
            {post.creator.firstName} {post.creator.lastName}
          </p>
        </div>
        <RepostModal userId={userId} post={post} />
      </div>
    </div>
  );
};

export default Card;
