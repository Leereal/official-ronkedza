import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSocialTokensByUser } from "@/lib/actions/socialToken.actions";
import FacebookPageCard from "./FacebookPageCard";
import FacebookModal from "./FacebookModal";

const FacebookSettings = async ({ userId }) => {
  const settings = await getSocialTokensByUser({ userId, page: 1 });
  const pages = settings?.data?.filter(
    (token) => token.socialPlatform.slug === "facebook-page"
  );
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
