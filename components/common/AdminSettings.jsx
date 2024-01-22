import { getAllSocialPlatforms } from "@/lib/actions/socialPlatform.actions";
import SocialPlatformCard from "./SocialPlatformCard";

const AdminSettings = async () => {
  const socialPlatforms = await getAllSocialPlatforms({ query: "", page: 1 });
  return (
    <div>
      {!!socialPlatforms.length &&
        socialPlatforms.map((platform) => (
          <SocialPlatformCard socialPlatform={platform} key={platform.name} />
        ))}
    </div>
  );
};

export default AdminSettings;
