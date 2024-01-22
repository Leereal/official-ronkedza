"use client";
import { FaTrash } from "react-icons/fa6";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { deleteSocialPlatform } from "@/lib/actions/socialPlatform.actions";

const SocialPlatformCard = ({ socialPlatform }) => {
  const handleDelete = (id) => {
    deleteSocialPlatform(id);
  };
  return (
    <div className="mb-3">
      <Card>
        <CardHeader className="py-2">
          <CardTitle className="text-md text-primary">
            {socialPlatform.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="py-2">
          <div className="flex justify-between">
            <div className="flex flex-col items-center">
              <span className="font-bold">Slug</span>
              <span className="text-slate-700 text-sm">
                {socialPlatform.slug}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold">App ID</span>
              <span className="text-slate-700 text-sm">
                {socialPlatform.appId}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold">App Secret</span>
              <span className="text-slate-700 text-sm">
                {socialPlatform.appSecret}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold">Endpoint / URL</span>
              <span className="text-slate-700 text-sm">
                {socialPlatform.endpoint}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold">Delete</span>
              <span className="text-red-500 text-sm cursor-pointer">
                <Button
                  size="icon"
                  className="rounded-full"
                  variant="destructive"
                  onClick={() => handleDelete(socialPlatform._id)}
                >
                  <FaTrash />
                </Button>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialPlatformCard;
