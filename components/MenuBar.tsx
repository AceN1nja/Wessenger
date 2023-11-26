"use client";
import React from 'react';
import { usePathname } from 'next/navigation'
import { User2 } from 'lucide-react';
import DarkModeToggle from './DarkModeToggle';

export default function SideMenu() {
  //get current url
  const pathname = usePathname()
  const pathList = pathname.split("/")
  

  return (
    <div className={"h-[70px] flex flex-row items-center justify-between border-b border-l rounded-bl-[20px] dark:border-stone-400 border-stone-900 dark:border-opacity-10 pr-5 p-2 mb-1"}>
      <div className={"flex items-center justify-between flex-row gap-2 px-3"}>
        {pathList[2] === "profile" && <User2 size={35}/>}
        <p className="text-center text-3xl capitalize">
          {pathList[2]}
        </p>
      </div>

      <div  className="flex  flex-row justify-between items-center gap-5">
        <DarkModeToggle />
      </div>
      
    </div>
  );
};

