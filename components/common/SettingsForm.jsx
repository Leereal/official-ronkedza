"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FaCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { postFormSchema } from "@/lib/validator";
import { Button } from "@/components/ui/button";
import { postDefaultValues } from "@/constants";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUploadThing } from "@/lib/uploadthing";
import {
  createFacebookAuth,
  postToSocials,
} from "@/lib/actions/socialPost.actions";
import { useEffect } from "react";

const SettingsForm = ({ userId, type, post, postId }) => {
  const [facebookStatus, setFacebookStatus] = useState("");
  const facebookAppId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;

  const initialValues =
    post && type === "Update"
      ? {
          ...post,
          scheduled_time: new Date(post.scheduled_time),
          categoryId: post.category._id,
        }
      : postDefaultValues;

  const form = useForm({
    resolver: zodResolver(postFormSchema),
    defaultValues: initialValues,
  });

  async function onSubmit(values) {
    if (type === "Create") {
      try {
      } catch (error) {
        console.log(error);
      }
    }

    if (type === "Update") {
      try {
      } catch (error) {
        console.log(error);
      }
    }
  }

  const loginFacebook = () => {
    FB.login(function (response) {
      if (response.status === "connected") {
        createFacebookAuth({ userId });
        setFacebookStatus("connected");
        //Logged In successfully
      }
    });
  };
  const logoutFacebook = () => {
    FB.logout(function (response) {
      console.log("Logout Response : ", response);
      deleteFacebookAuth({ userId });
      setFacebookStatus("");
    });
  };

  useEffect(() => {
    const loadFacebookSDK = () => {
      window.fbAsyncInit = function () {
        FB.init({
          appId: facebookAppId,
          cookie: true,
          xfbml: true,
          version: "v12.0",
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

  useEffect(() => {
    // Use FB.getLoginStatus when the Facebook SDK is loaded
    if (typeof FB !== "undefined") {
      FB.getLoginStatus(function (response) {
        console.log("Response from Facebook : ", response);
        setFacebookStatus(response.status);
      });
    }
  }, [typeof FB]); // Run this effect only if type of FB

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
