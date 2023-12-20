"use client";

import { Spinner } from "@/components/common/Spinner";
import { useState } from "react";
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
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa6";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { isLoaded, signIn, setActive } = useSignIn();

  const handleSubmit = async (e) => {
    setIsLoading(true);
    if (isLoaded) return;
    if (password && email) {
      try {
        const result = await signIn.create({
          identifier: emailAddress,
          password,
        });

        if (result.status === "complete") {
          await setActive({ session: result.createdSessionId });
          router.push("/dashboard");
        } else {
          console.log(result);
        }
      } catch (err) {
        console.error("error", err.errors[0].longMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const signInWith = (strategy) => {
    return signIn.authenticateWithRedirect({
      strategy,
      redirectUrl: "/",
      redirectUrlComplete: "/dashboard",
    });
  };

  return (
    <Card className="md:w-[500px]">
      <div className="text-center p-6 bg-slate-900 rounded-t">
        <Link href="/">
          <img
            src="/images/logo.png"
            alt=""
            className="w-14 h-14 mx-auto mb-2"
          />
        </Link>
      </div>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Login to your account</CardTitle>
        <CardDescription>Enter your email below to login</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 ">
        <div className="grid grid-cols-2 gap-6">
          <Button
            variant="outline"
            onClick={() => signInWith("oauth_facebook")}
          >
            <FaFacebook className="mr-3 text-blue-600" />
            Facebook
          </Button>
          <Button variant="outline" onClick={() => signInWith("oauth_google")}>
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
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleSubmit}>
          {" "}
          {isLoading ? <Spinner sm /> : `Login`}
        </Button>
      </CardFooter>
      <p className="mb-5 text-sm font-medium text-center text-slate-500">
        {" "}
        Don't have an account?{" "}
        <Link
          href="/sign-up"
          className="font-medium text-blue-600 hover:underline"
        >
          Sign up
        </Link>
      </p>
    </Card>
  );
}
