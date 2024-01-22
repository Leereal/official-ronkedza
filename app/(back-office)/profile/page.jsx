import FacebookSettings from "@/components/common/FacebookSettings";
import SettingsForm from "@/components/common/SettingsForm";
import TopSection from "@/components/common/TopSection";
import { getPlatform } from "@/lib/actions/socialPlatform.actions";
import { auth } from "@clerk/nextjs";

const Profile = async () => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId;
  const facebookApp = await getPlatform("facebook-page");

  return (
    <>
      <TopSection title="Profile" />
      <div className="wrapper my-8">
        {/* <SettingsForm facebookAppId={facebookApp?.appId} /> */}
        {console.log("Profile :", facebookApp)}
        <FacebookSettings userId={userId} />
      </div>
    </>
  );
};

export default Profile;
