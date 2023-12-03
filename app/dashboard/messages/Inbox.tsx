"use client";
import { Card, CardContent } from "@/components/ui/card";
import { usePathname } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();
import { UserContext } from "../UserProvider";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function Inbox({data}: {data: any}) {
  const [inboxes, setInboxes] = useState<
    {
      id: String;
      conversation: Number;
      full_name: String;
    }[]
  >(data);
  const { getUsername, hasMounted } = useContext(UserContext);

  const [selected, setSelected] = useState<Number>(0);

  const router = useRouter();

  return (
    <ScrollArea className="w-full h-full space-y-4 mt-3">
      {inboxes.map((inbox) => {
        const { id, full_name, conversation } = inbox;
        return (
          <Card
            key={conversation as React.Key}
            className={cn(
              " mb-2 rounded-md dark:border-transparent hover:dark:bg-stone-900 cursor-pointer",
              conversation === selected
                ? "dark:bg-stone-900"
                : "dark:bg-stone-950"
            )}
            onClick={() => {
              setSelected(conversation);
              router.push(`/dashboard/messages/${conversation}`);
            }}
          >
            <CardContent className="flex flex-row justify-between items-center  p-2">
              <div className={"flex flex-row gap-4 "}>
                <Avatar className={"h-[45px] w-[45px]"}>
                  <AvatarImage
                    src={`${process.env.NEXT_PUBLIC_AVATAR_URL}${id}`}
                  />
                  <AvatarFallback>{full_name[0]}</AvatarFallback>
                </Avatar>
                <div className={"flex flex-col justify-center items-start"}>
                  <div className={"text-lg font-semibold"}>{id}</div>
                  <div className={"text-md font-thin text-stone-500"}>
                    "insert last message here"
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </ScrollArea>
  );
}
