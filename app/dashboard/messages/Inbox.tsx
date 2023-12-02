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

export default function Inbox() {
  const [inboxes, setInboxes] = useState<
    {
      id: String;
      conversation: Number;
      full_name: String;
    }[]
  >([]);
  const { getUsername, hasMounted } = useContext(UserContext);

  const [selected, setSelected] = useState<Number>(0);

  useEffect(() => {
    const getInboxes = async () => {
      const { data, error } = await supabase
        .from("user_conversations")
        .select("conversation_id")
        .eq("user_id", getUsername())
        .order("last_updated", { ascending: false });

      if (error) {
        console.log("error", error);
      } else {
        const flattened_data = data.map((inbox) => inbox.conversation_id);
        console.log("inboxes", flattened_data);

        //now for each conversation_id, get the receiver's username
        flattened_data.forEach(async (conversation_id) => {
          console.log("conversation_id", conversation_id);
          const { data: inbox, error } = await supabase
            .from("user_conversations")
            .select("user_id, conversation_id, users (full_name)")
            .eq("conversation_id", conversation_id)
            .neq("user_id", getUsername())
            .single();

          if (error) {
            console.log("error", error);
          } else {
            //flattens the array into a single array of one-dimensional objects of type Inbox
            console.log("usernames", inbox);
            // @ts-ignore
            setInboxes((inboxes) => [
              ...inboxes,
              {
                id: inbox.user_id,
                conversation: inbox.conversation_id,
                // @ts-ignore
                full_name: inbox.users.full_name,
              },
            ]);
          }
        });
      }
    };


    if (hasMounted && inboxes.length === 0)
        getInboxes();

    console.log("inboxes", inboxes);
  }, [hasMounted, inboxes]);

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
