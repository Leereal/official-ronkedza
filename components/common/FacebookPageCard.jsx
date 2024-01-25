"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "../ui/switch";
import { useEffect, useState } from "react";
import moment from "moment";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import {
  deleteFacebookAuth,
  updateFacebookAuth,
} from "@/lib/actions/facebookToken.actions";
import { toast } from "sonner";

const FacebookPageCard = ({ page, userId }) => {
  const [active, setActive] = useState(false);
  const handleSwitch = async () => {
    //Activate or deactivate facebook page
    try {
      const updatedPage = await updateFacebookAuth({
        userId,
        data: {
          _id: page._id,
          active: !active,
        },
      });
      if (updatedPage) {
        toast.success("Page updated successfully");
        setActive(!active);
      } else {
        toast.error("Failed to update page");
      }
    } catch (error) {
      toast.error("Failed to update page");
      console.log("updateFacebookAuth error : ", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteFacebookAuth(page._id, "/profile");
      toast.success("Page deleted successfully");
    } catch (error) {
      toast.error("Failed to delete page");
      console.log("handleDelete error : ", error);
    }
  };
  useEffect(() => {
    setActive(page.active);
  }, []);

  return (
    <Card className="m-4">
      <CardContent className="space-y-2">
        <div>
          <h3 className="text-sm font-bold py-2 sm:text-lg">{page.name}</h3>
          <p className="text-[10px] text-gray-600 font-light text-justify sm:text-[12px]">
            {page.about || "Nothing about page"}
          </p>
        </div>
        <Card>
          <CardContent className="space-y-2">
            <div className="flex justify-evenly mt-2">
              <Switch checked={active} onCheckedChange={handleSwitch} />
              {/* <FaEdit size={20} className="text-secondary cursor-pointer" /> */}
              <FaTrash
                size={20}
                className="text-destructive cursor-pointer"
                onClick={handleDelete}
              />
            </div>
            <div className="sm:flex justify-between">
              <h3 className="mx-auto text-center text-[12px] sm:text-sm sm:mx-0">
                Page ID
              </h3>
              <p className="mx-auto text-center text-sm sm:text-lg sm:mx-0">
                {page.pageId}
              </p>
            </div>
            <div className="sm:flex justify-between">
              <h3 className="mx-auto text-center text-[12px] sm:text-sm sm:mx-0">
                Followers
              </h3>
              <p className="text-center text-sm sm:text-lg sm:mx-0">
                {page.followers_count}
              </p>
            </div>
            <div className="sm:flex justify-between">
              <h3 className="mx-auto text-center text-[12px] sm:text-sm sm:mx-0">
                Token Expiration
              </h3>
              <p className="text-center text-sm sm:text-lg sm:mx-0">Today</p>
              {/* <p className="text-center text-sm sm:text-lg"> */}
              {/* {moment(today).format("MMMM Do YYYY, h:mm:ss a")} */}
              {/* </p> */}
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default FacebookPageCard;
