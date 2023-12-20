import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";

import { cn } from "@/lib/utils";
const headingFont = localFont({ src: "../public/fonts/font.woff2" });

export const Logo = () => {
  return (
    <Link href="/">
      <div className="hover:opacity-75 transition items-center gap-x-2 hidden md:flex">
        <Image
          src="/images/logo.png"
          alt="logo"
          sizes=""
          height={30}
          width={30}
        />
        <span
          className={cn(
            "text-lg md:text-3xl text-[#38B6FF] pb-1",
            headingFont.className
          )}
        >
          R<span className="text-[#00BF63]">onkedz</span>a
        </span>
      </div>
    </Link>
  );
};
