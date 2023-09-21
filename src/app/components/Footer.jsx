import Link from "next/link";
import React from "react";
import { AiOutlineCopyright } from "react-icons/ai";
import { BsGithub } from "react-icons/bs";

const Footer = () => {
  return (
    <div className="bg-white p-2 w-full">
      <div className="text-black flex flex-row items-center justify-center">
        <span>
          <AiOutlineCopyright />
        </span>
        <Link href={"https://github.com/yogesh6260"}>
          https://github.com/yogesh6260{" "}
        </Link>
        <BsGithub />
      </div>
    </div>
  );
};

export default Footer;
