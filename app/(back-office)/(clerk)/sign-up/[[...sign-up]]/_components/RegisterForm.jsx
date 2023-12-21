"use client";

import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/common/Spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa6";
import Image from "next/image";
import { Logo } from "@/components/Logo";

export default function RegisterForm() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    setIsLoading(true);
    if (!isLoaded) return;
    if (
      password &&
      password === confirmPassword &&
      firstName &&
      lastName &&
      email
    ) {
      try {
        await signUp.create({
          first_name: firstName,
          last_name: lastName,
          email_address: email,
          password,
        });

        //send email verification
        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        }); // you can use email link

        //change ui
        setPendingVerification(true);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const onPressVerify = async (e) => {
    e.preventDefault();
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (completeSignUp.status !== "complete") {
        console.log(JSON.stringify(completeSignUp, null, 2));
      }
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/");
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const signUpWith = (strategy) => {
    try {
      return signUp.authenticateWithRedirect({
        strategy,
        redirectUrl: "/",
        redirectUrlComplete: "/dashboard",
      });
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <Card className="md:w-[500px]">
      {!pendingVerification && (
        <>
          <div className="text-center p-6 bg-slate-900 rounded-t">
            <Logo />
          </div>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Create an account</CardTitle>
            <CardDescription>
              Enter your email below to create your account
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 ">
            <div className="grid grid-cols-2 gap-6">
              <Button
                variant="outline"
                onClick={() => signUpWith("oauth_facebook")}
              >
                <FaFacebook className="mr-3 text-blue-600" />
                Facebook
              </Button>
              <Button
                variant="outline"
                onClick={() => signUpWith("oauth_google")}
              >
                <FcGoogle className="mr-3" />
                Google
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">First Name</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="Enter First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Enter Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                placeholder="Re-enter Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleSubmit}>
              {isLoading ? <Spinner sm /> : `Register`}
            </Button>
          </CardFooter>
          <p className="mb-5 text-sm font-medium text-center text-slate-500">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-medium text-blue-600 hover:underline"
            >
              Sign In
            </Link>
          </p>
        </>
      )}
      {pendingVerification && (
        <>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Verification Code</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 ">
            <div className="grid gap-2">
              <Input
                id="code"
                type="text"
                placeholder="Enter Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={onPressVerify}>
              {isLoading ? <Spinner sm /> : `Submit`}
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
