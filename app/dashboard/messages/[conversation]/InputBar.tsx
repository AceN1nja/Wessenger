"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { SmilePlus } from "lucide-react";

import { use, useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../UserProvider";

import { createClient } from "@/lib/supabase/client";
const supabase = createClient();

export default function InputBar({ conversation }: { conversation: string }) {
  const [input, setInput] = useState<String>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { getUsername } = useContext(UserContext);

  if (!getUsername()) return null;

  const sendMessage = async () => {
    console.log(input);
    const { data, error } = await supabase.from("chats").insert({
      message: input,
      conversation_id: conversation,
      user_id: getUsername(),
    });

    if (error) {
      console.log("error", error);
    } else {
      inputRef.current!.value = "";
    }
  };
  return (
    <div className="w-full h-[5%] flex flex-row justify-start items-center p-1 rounded-full dark:bg-transparent px-5 border border-stone-800 ">
      <Popover>
        <PopoverTrigger>
          <SmilePlus />
        </PopoverTrigger>
        <PopoverContent className="w-[375px] h-[475px] p-3">
          <EmojiPicker
            theme={Theme.DARK}
            onEmojiClick={(e) => {
              setInput(input + e.emoji);
              inputRef.current!.value += e.emoji;
            }}
          />
        </PopoverContent>
      </Popover>

      <Input
        ref={inputRef}
        className="w-full h-full dark:bg-transparent dark:border-transparent"
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") sendMessage();
        }}
      />
    </div>
  );
}
