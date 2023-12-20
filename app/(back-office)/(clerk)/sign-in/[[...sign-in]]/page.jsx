"use client";
import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import LoginForm from "./_components/LoginForm";
import Link from "next/link";

export default function SignIn() {
  return (
    <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
      <LoginForm />
    </div>
  );
}
