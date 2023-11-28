"use client";
import { Inbox, Search, Send } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import MenuButton from "./MenuButton";
import SearchModal from "./SearchModal";

import { useRouter } from "next/navigation";

export default function SideMenu() {
  const router = useRouter();
  return (
    <div
      className={
        "w-[100px] flex flex-col justify-between items-center  border-stone-800 dark:border-opacity-400 dark:border-opacity-10 py-5 pl-2 pr-1 mr-1 overflow-hidden"
      }
    >
      <p className="font-thin text-center text-5xl">W</p>

      <div className="flex flex-col items-center space-y-3">
        <SearchModal />
        <Button
          variant="outline"
          className="border-0 rounded-[15px] w-[60px] h-[60px] "
          onClick={() => router.push("/dashboard/messages")}
        >
          <Send />
        </Button>
        <Button
          variant="outline"
          className="border-0 rounded-[15px] w-[60px] h-[60px] "
          onClick={() => router.push("/dashboard/notifications")}
        >
          <Inbox />
        </Button>
      </div>
      <MenuButton />
    </div>
  );
}
