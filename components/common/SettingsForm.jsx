"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FaCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { postFormSchema, settingFormSchema } from "@/lib/validator";
import { Button } from "@/components/ui/button";
import { postDefaultValues, settingDefaultValues } from "@/constants";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUploadThing } from "@/lib/uploadthing";
import { useEffect } from "react";
import {
  autoSocialAuth,
  deleteSocialAuth,
} from "@/lib/actions/socialToken.actions";

const SettingsForm = ({ userId, type, setting, settingId, facebookAppId }) => {
  const [facebookStatus, setFacebookStatus] = useState("");

  const loginFacebook = () => {
    FB.login(
      function (response) {
        if (response.status === "connected") {
          //We are getting the date as Unix timestamp so convert to actual date
          const expiration = new Date(
            response.authResponse.data_access_expiration_time * 1000
          ).toISOString();

          autoFacebookAuth(
            {
              userId,
              accessToken: response.authResponse.accessToken,
              expiration: expiration,
              expiresIn: response.authResponse.expiresIn,
              facebookUserId: response.authResponse.userID,
            },
            () => {
              setFacebookStatus("connected");
            }
          );
        } else if (response.status === "unknown") {
          setFacebookStatus("unknown");
        }
      }
      // TODO { scope: "email,user_likes" } // Ask for email and user likes permissions. You can add more if you like. This doesn't on local we can test on live
    );
  };
  const logoutFacebook = () => {
    FB.logout(function (response) {
      deleteFacebookAuth({ userId });
      setFacebookStatus("unknown");
    });
  };

  useEffect(() => {
    const loadFacebookSDK = () => {
      window.fbAsyncInit = function () {
        FB.init({
          appId: facebookAppId,
          cookie: true,
          xfbml: true,
          version: "v18.0",
        });
        FB.getLoginStatus(function (response) {
          setFacebookStatus(response.status);
        });

        FB.AppEvents.logPageView();
      };

      (function (d, s, id) {
        var js,
          fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
          return;
        }
        js = d.createElement(s);
        js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      })(document, "script", "facebook-jssdk");
    };

    loadFacebookSDK();

    return () => {
      const facebookScript = document.getElementById("facebook-jssdk");
      if (facebookScript) {
        facebookScript.parentNode.removeChild(facebookScript);
      }
    };
  }, []);
  return (
    <div>
      {facebookStatus && facebookStatus === "unknown" && (
        <Button onClick={loginFacebook}>Connect Facebook</Button>
      )}
      {facebookStatus && facebookStatus === "connected" && (
        <div>
          <div className="text-green-600">You are connected to Facebook</div>
          <Button onClick={logoutFacebook}>Logout Facebook</Button>
        </div>
      )}
    </div>
  );
};

export default SettingsForm;
