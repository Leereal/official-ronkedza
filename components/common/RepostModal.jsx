"use client";
import { useState } from "react";
import PostForm from "./PostForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { FaRetweet } from "react-icons/fa6";
import { Button } from "../ui/button";

const RepostModal = ({ userId, post }) => {
  const [open, setOpen] = useState(false);
  const handleModal = (value) => {
    setOpen(value);
  };
  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger asChild>
        <Button className="rounded-full bg-primary gap-2 px-6 w-fit mx-auto">
          <FaRetweet size={20} className="" onClick={() => handleModal(true)} />{" "}
          Post To My Socials
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white md:max-w-[70vw] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>You can post this as yours</DialogTitle>
          <DialogDescription>
            You are allowed to share this on your socials as long you tag the
            creator
          </DialogDescription>
        </DialogHeader>
        <PostForm
          userId={userId}
          type="Repost"
          post={post}
          postId={post._id}
          closeModal={() => handleModal(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default RepostModal;
