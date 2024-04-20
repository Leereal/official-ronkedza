"use client";
import AdminSettings from "@/components/common/AdminSettings";
import SocialPlatformForm from "@/components/common/SocialPlatformForm";
import TopSection from "@/components/common/TopSection";
import { Button } from "@/components/ui/button";

const AdminSettingsPage = () => {
  const sendEmail = () => {
    fetch("/api/emails", {
      method: "POST",
      body: JSON.stringify({
        email: "<EMAIL>",
        subject: "Test",
        body: "Test",
        firstName: "Test",
        lastName: "Test",
      }),
    });
  };
  return (
    <>
      <TopSection title="Admin Settings" />
      <div className="wrapper my-8 space-y-4">
        <SocialPlatformForm type="Create" />
        <AdminSettings />
      </div>
      <div className="flex justify-center">
        <Button className="w-3/12" onClick={sendEmail}>
          Send Email
        </Button>
      </div>
    </>
  );
};

export default AdminSettingsPage;
