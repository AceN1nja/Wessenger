"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import EmojiPicker, {Theme} from "emoji-picker-react";
import { SmilePlus } from "lucide-react";
import { useRef, useState } from "react";
const supabase = createClient();

export default function Conversation({
  params,
}: {
  params: { conversation: string };
}) {
  const [input, setInput] = useState<String>("");
    const inputRef = useRef<HTMLInputElement>(null);
  return (
    <main className="w-full h-full flex flex-col items-center justify-start ">
      <div className="w-full h-[95%] "></div>
      <div className="w-full h-[5%] flex flex-row justify-start items-center p-1 rounded-full dark:bg-transparent px-5 border border-stone-800 ">
        <Popover>
          <PopoverTrigger>
            <SmilePlus />
          </PopoverTrigger>
          <PopoverContent className="w-[375px] h-[475px] p-3">
            <EmojiPicker theme={Theme.DARK} onEmojiClick={(e) => {inputRef.current!.value+=e.emoji}}/>
          </PopoverContent>
        </Popover>

        <Input ref={inputRef} className="w-full h-full dark:bg-transparent dark:border-transparent" onChange={(e) => setInput(e.target.value)}/>
      </div>
    </main>
  );
}
