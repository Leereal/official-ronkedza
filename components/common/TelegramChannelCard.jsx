"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "../ui/switch";
import { useEffect, useState } from "react";
import moment from "moment";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import {
  deleteSocialAuth,
  updateSocialAuth,
} from "@/lib/actions/socialToken.actions";
import { toast } from "sonner";

const TelegramChannelCard = ({ channel, userId }) => {
  const [active, setActive] = useState(false);
  const handleSwitch = async () => {
    try {
      const updatedChannel = await updateSocialAuth({
        userId,
        data: {
          _id: channel._id,
          active: !active,
        },
      });
      if (updatedChannel) {
        toast.success("Page updated successfully");
        setActive(!active);
      } else {
        toast.error("Failed to update page");
      }
    } catch (error) {
      toast.error("Failed to update page");
      console.log("updateSocialAuth error : ", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteSocialAuth(channel._id, "/profile");
      toast.success("Channel deleted successfully");
    } catch (error) {
      toast.error("Failed to delete channel");
      console.log("handleDelete error : ", error);
    }
  };
  useEffect(() => {
    setActive(channel.active);
  }, []);

  return (
    <Card className="m-4">
      <CardContent className="space-y-2">
        <div>
          <h3 className="text-sm font-bold py-2 sm:text-lg">{channel.name}</h3>
          <p className="text-[10px] text-gray-600 font-light text-justify sm:text-[12px]">
            {channel.about || "Nothing about channel"}
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
                Channel ID
              </h3>
              <p className="mx-auto text-center text-sm sm:text-lg sm:mx-0">
                {channel.socialId}
              </p>
            </div>
            <div className="sm:flex justify-between">
              <h3 className="mx-auto text-center text-[12px] sm:text-sm sm:mx-0">
                Members
              </h3>
              <p className="text-center text-sm sm:text-lg sm:mx-0">
                {channel.followers_count}
              </p>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default TelegramChannelCard;
