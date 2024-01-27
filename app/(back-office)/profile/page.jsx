import FacebookSettings from "@/components/common/FacebookSettings";
import SettingsForm from "@/components/common/SettingsForm";
import TopSection from "@/components/common/TopSection";
import { getPlatform } from "@/lib/actions/socialPlatform.actions";
import { auth } from "@clerk/nextjs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Profile = async () => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId;
  const facebookApp = await getPlatform("facebook-page");

  return (
    <>
      <TopSection title="Profile" />
      <div className="wrapper my-8">
        <Tabs defaultValue="settings" className="">
          <TabsList className="gap-8">
            <TabsTrigger value="settings">Social Settings</TabsTrigger>
            <TabsTrigger value="results">Posts Results</TabsTrigger>
          </TabsList>
          <TabsContent value="settings">
            {/* <SettingsForm facebookAppId={facebookApp?.appId} /> */}
            <FacebookSettings userId={userId} />
          </TabsContent>
          <TabsContent value="results">{/* <PostResults /> */}</TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Profile;
