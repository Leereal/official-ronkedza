"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "../ui/switch";
import { useState } from "react";
import moment from "moment";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";

const FacebookPageCard = ({ page }) => {
  const [active, setActive] = useState(false);
  const today = new Date();
  return (
    <Card className="m-4">
      <CardContent className="space-y-2">
        <div>
          <h3 className="text-sm font-bold py-2 sm:text-lg">
            Cook with Monkey
          </h3>
          <p className="text-[10px] text-gray-600 font-light text-justify sm:text-[12px]">
            Please click here on how to get tokens and page ID
          </p>
        </div>
        <Card>
          <CardContent className="space-y-2">
            <div className="flex justify-evenly mt-2">
              <Switch
                checked={active}
                onCheckedChange={() => setActive(!active)}
              />
              <FaEdit size={20} className="text-secondary cursor-pointer" />
              <FaTrash size={20} className="text-destructive cursor-pointer" />
            </div>
            <div className="sm:flex justify-between">
              <h3 className="mx-auto text-center text-[12px] sm:text-sm sm:mx-0">
                Page ID
              </h3>
              <p className="mx-auto text-center text-sm sm:text-lg sm:mx-0">
                104545454540
              </p>
            </div>
            <div className="sm:flex justify-between">
              <h3 className="mx-auto text-center text-[12px] sm:text-sm sm:mx-0">
                Followers
              </h3>
              <p className="text-center text-sm sm:text-lg sm:mx-0">100</p>
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
