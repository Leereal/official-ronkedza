import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

import { getAllSocialPlatforms } from "@/lib/actions/socialPlatform.actions";

const PlatformDropdown = ({ value, setSocialPlatform }) => {
  const [socialPlatforms, setSocialPlatforms] = useState([]);

  const handleChange = (e) => {
    setSocialPlatform(socialPlatforms.find((platform) => platform._id === e));
  };

  useEffect(() => {
    const getPlatforms = async () => {
      const socialPlatformList = await getAllSocialPlatforms({
        query: "",
        page: 1,
      });
      socialPlatformList && setSocialPlatforms(socialPlatformList.data);
    };

    getPlatforms();
  }, []);

  return (
    <Select onValueChange={handleChange}>
      <SelectTrigger className="select-field">
        <SelectValue placeholder="Social Platform" />
      </SelectTrigger>
      <SelectContent>
        {socialPlatforms.length > 0 &&
          socialPlatforms.map((platform) => (
            <SelectItem
              key={platform._id}
              value={platform._id}
              className="select-item p-regular-14"
            >
              {platform.name}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
};

export default PlatformDropdown;
