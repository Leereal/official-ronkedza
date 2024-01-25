import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFacebookSettingsByUser } from "@/lib/actions/facebookToken.actions";
import { Switch } from "@/components/ui/switch";
import FacebookPageCard from "./FacebookPageCard";
import { FaPlus } from "react-icons/fa6";
import FacebookModal from "./FacebookModal";

const FacebookSettings = async ({ userId }) => {
  const settings = await getFacebookSettingsByUser({ userId, page: 1 });
  const pages = settings.data;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-center font-bold text-gray-600 sm:text-start">
          Facebook Pages Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!!pages.length &&
          pages.map((item) => (
            <FacebookPageCard page={item} userId={userId} key={item._id} />
          ))}
        <div className="border-2 border-dashed h-40 rounded-lg mx-4 flex justify-center items-center cursor-pointer">
          <FacebookModal userId={userId} />
        </div>
      </CardContent>
    </Card>
  );
};

export default FacebookSettings;
