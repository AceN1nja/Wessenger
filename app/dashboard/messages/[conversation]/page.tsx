import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

import InputBar from "./InputBar";
import Messages from "./ChatHistory";

export const revalidate = 1;

export default async function Conversation({
  params,
}: {
  params: { conversation: string };
}) {
  const supabase = createClient(cookies());

  const { data: user, error: userError } = await supabase.auth.getUser();

  const { data: conversationData, error: conversationError } = await supabase
    .from("chats")
    .select()
    .eq("conversation_id", params.conversation)
    .order("created_at", { ascending: true })
    .limit(100);

  if (conversationError) {
    console.log("conversationError", conversationError);
  }

  

  return (
    <main className="w-full h-full flex flex-col items-center justify-start ">
      <div className="w-full h-[95%] ">
        <Messages conversation={params.conversation} data={conversationData ? conversationData : []}/>
      </div>
      <InputBar conversation={params.conversation} />
    </main>
  );
}
