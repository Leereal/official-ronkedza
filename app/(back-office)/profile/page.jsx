import SettingsForm from "@/components/common/SettingsForm";
import TopSection from "@/components/common/TopSection";
import { auth } from "@clerk/nextjs";

const Profile = () => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId;
  return (
    <>
      <TopSection title="Profile" />
      <div className="wrapper my-8">
        <SettingsForm userId={userId} type="Create" />
      </div>
    </>
  );
};

export default Profile;
