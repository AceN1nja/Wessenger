import { Separator } from "@/components/ui/separator";
import Inbox from "./Inbox";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 0;

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient(cookies());

  const { data: user, error: userError } = await supabase.auth.getUser();

  const { data: userData, error: userDataError } = await supabase
    .from("users")
    .select("username")
    .eq("email", user.user?.email)
    .single();

  let inboxes: {
    id: String;
    conversation: Number;
    full_name: String;
  }[] = new Array();

  const { data, error } = await supabase
    .from("user_conversations")
    .select("conversation_id")
    .eq("user_id", userData?.username)
    .order("last_updated", { ascending: false });

  const initializeData = async (rawData: Number[]) => {
    const inboxes: any[] = new Array();
    for (let i = 0; i < rawData.length; i++) {
      const conversation_id = rawData[i];

      const { data, error: conversationError } = await supabase
        .from("user_conversations")
        .select("user_id, users!username (full_name)")
        .eq("conversation_id", conversation_id)
        .neq("user_id", userData?.username)
        .single();

      if (conversationError) {
        console.log("conversationError", conversationError);
      } else {
        inboxes.push({
          id: data?.user_id,
          conversation: conversation_id,
          // @ts-ignore
          full_name: data?.users?.full_name,
        });
      }


    }
    return inboxes;
  };

  if (error) {
    console.log("error", error);
  } else {
    const flattened_data = data.map((inbox) => inbox.conversation_id);

    //now for each conversation_id, get the receiver's username
    inboxes = await initializeData(flattened_data);
  }

  return (
    <main
      className={
        "w-full h-full flex flex-row items-center justify-between border-t border-l rounded-tl-[20px]  dark:border-stone-400 border-stone-800 dark:border-opacity-10 p-4 space-x-4 "
      }
    >
      <div className={"flex flex-col w-[20%] h-full justify-start items-start"}>
        <div className="flex flex-row justify-start items-center space-y-3 text-3xl font-extralight">
          Messages
        </div>
        <Inbox data={inboxes} />
      </div>
      <Separator orientation="vertical" className="bg-opacity-50" />
      <div className={"flex flex-col w-[80%] h-full justify-start items-start"}>
        {children}
      </div>
    </main>
  );
}
