"use client";
import { use, useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../UserProvider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const supabase = createClient();

export default function Messages({
  conversation,
  data,
}: {
  conversation: string;
  data: any[];
}) {
  const dummyRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const [conversationData, setConversationData] = useState<any[]>(data);

  useEffect(() => {
    dummyRef.current?.scrollIntoView({ behavior: "smooth" });

    const channelName = `conversation:${conversation}_realtime`;

    const realtime = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chats",
          filter: "conversation_id=eq." + conversation,
        },
        (payload) => {
          console.log("NEW MESAGES"),
            setConversationData((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();
  }, [dummyRef, scrollAreaRef, conversationData]);

  return (
    <ScrollArea
      ref={scrollAreaRef}
      className={"w-full h-full flex flex-col p-3 justify-start items-start"}
    >
      <div
        style={{ marginTop: 750, marginBottom: 30 }}
        className={"flex flex-row justify-evenly items-center w-full "}
      >
        <div className={"flex flex-col justify-center items-center w-2/5"}>
          <Separator orientation="horizontal" className="bg-opacity-50" />
        </div>
        <p className={"text-sm"}>Start of Conversation </p>
        <div className={"flex flex-col justify-center items-center w-2/5"}>
          <Separator orientation="horizontal" className="bg-opacity-50" />
        </div>
      </div>
      {conversationData.map((messageData) => {
        const { message, user_id, created_at, id } = messageData;
        return (
          <Chat
            key={id}
            message={message}
            user_id={user_id}
            created_at={created_at}
          />
        );
      })}

      <div ref={dummyRef} />
    </ScrollArea>
  );
}

//chat compoenent
function Chat({
  message,
  user_id,
  created_at,
}: {
  message: string;
  user_id: string;
  created_at: Date;
}) {
  const { getUsername } = useContext(UserContext);
  const isSender = user_id === getUsername();

  return (
    <main
      className={cn(
        "flex flex-col justify-start mb-2 ",
        isSender ? "items-end mr-2" : "items-start ml-2"
      )}
    >
      <div
        className={cn(
          "max-w-[40%] rounded-[17px] justify-center items-center px-3 py-2 border border-stone-800",
          isSender ? " rounded-br-[0px]" : " rounded-bl-[0px]"
        )}
      >
        <p>{message}</p>
      </div>
      <p className={"text-[12px] px-2 pt-1"}>
        {new Date(created_at).toLocaleTimeString()}
      </p>
    </main>
  );
}
