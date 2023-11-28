import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import * as React from "react";

export default function Page() {
  return (
    <main
      className={
        "w-full h-full flex flex-row items-center justify-between border-t border-l rounded-tl-[20px]  dark:border-stone-400 border-stone-800 dark:border-opacity-10 p-4 space-x-4 "
      }
    >
      <div className={"flex flex-col w-[30%] h-full justify-start items-start"}>
        <div className="flex flex-row justify-start items-center space-y-3 text-3xl font-extralight">
          Friend Requests
        </div>
      </div>
      <Separator orientation="vertical" />
      <div className={"flex flex-col w-[70%] h-full justify-start items-start"}>
        <div className="flex flex-row justify-start items-center space-y-3 text-3xl font-extralight">
          Notifications
        </div>
      </div>
    </main>
  );
}
