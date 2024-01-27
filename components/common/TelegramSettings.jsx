import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSocialTokensByUser } from "@/lib/actions/socialToken.actions";
import FacebookPageCard from "./FacebookPageCard";
import FacebookModal from "./FacebookModal";
import TelegramChannelCard from "./TelegramChannelCard";
import TelegramModal from "./TelegramModal";

const TelegramSettings = async ({ userId }) => {
  const settings = await getSocialTokensByUser({ userId, page: 1 });
  const channels = settings?.data?.filter(
    (token) => token.socialPlatform.slug === "telegram-channel"
  );
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-center font-bold text-gray-600 sm:text-start">
          Telegram Channels Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!!channels.length &&
          channels.map((item) => (
            <TelegramChannelCard
              channel={item}
              userId={userId}
              key={item._id}
            />
          ))}
        <div className="border-2 border-dashed h-40 rounded-lg mx-4 flex justify-center items-center cursor-pointer">
          <TelegramModal userId={userId} />
        </div>
      </CardContent>
    </Card>
  );
};

export default TelegramSettings;
