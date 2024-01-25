import { getAllSocialPlatforms } from "@/lib/actions/socialPlatform.actions";
import SocialPlatformCard from "./SocialPlatformCard";

const AdminSettings = async () => {
  let socialPlatforms = await getAllSocialPlatforms({ query: "", page: 1 });
  socialPlatforms = socialPlatforms?.data;

  return (
    <div>
      {!!socialPlatforms?.length &&
        socialPlatforms.map((platform) => (
          <SocialPlatformCard socialPlatform={platform} key={platform.name} />
        ))}
    </div>
  );
};

export default AdminSettings;
