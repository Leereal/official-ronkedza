import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFacebookSettingsByUser } from "@/lib/actions/facebookToken.actions";
import { Switch } from "@/components/ui/switch";
import FacebookPageCard from "./FacebookPageCard";
import { FaPlus } from "react-icons/fa6";
import FacebookModal from "./FacebookModal";

const FacebookSettings = async ({ userId }) => {
  const settings = await getFacebookSettingsByUser({ userId, page: 1 });
  console.log("Settings :", settings);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-center font-bold text-gray-600 sm:text-start">
          Facebook Pages Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        {settings.length &&
          settings.map((item) => <FacebookPageCard page={item} />)}
        <FacebookModal userId={userId} />
      </CardContent>
    </Card>
  );
};

export default FacebookSettings;
