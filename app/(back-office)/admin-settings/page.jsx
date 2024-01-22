import AdminSettings from "@/components/common/AdminSettings";
import SocialPlatformForm from "@/components/common/SocialPlatformForm";
import TopSection from "@/components/common/TopSection";

const AdminSettingsPage = () => {
  return (
    <>
      <TopSection title="Admin Settings" />
      <div className="wrapper my-8 space-y-4">
        <SocialPlatformForm type="Create" />
        <AdminSettings />
      </div>
    </>
  );
};

export default AdminSettingsPage;
