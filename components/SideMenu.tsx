"use client";
import { Inbox, Search, Send } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { Badge } from "./ui/badge";

import { Button } from "@/components/ui/button";
import MenuButton from "./MenuButton";
import SearchModal from "./SearchModal";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { UserContext } from "@/app/dashboard/UserProvider";
import { useToast } from "./ui/use-toast";
const supabase = createClient();

export default function SideMenu() {
  const { getUsername, getInitials, hasMounted } = useContext(UserContext);
  const router = useRouter();
  const [notifications, setNotifications] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const getNotifications = async () => {
      const { count, error } = await supabase
        .from("friends")
        .select("user1", { count: "exact", head: true })
        .eq("user2", getUsername())
        .eq("status", "pending");

      if (error) {
        console.log("error", error);
      } else {
        setNotifications(count ? count : 0);
      }
    };

    supabase
      .channel("friendRequestsAdds")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "friends" },
        (payload) => {
          if (payload.new.user2 === getUsername()) {
            setNotifications(notifications + 1);

            toast({
              title: "Friend Request",
              description: `@${payload.new.user1} has sent you a friend request!`,
            });
          }
        }
      )
      .subscribe();

    supabase
      .channel("friendRequestsUpdates")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "friends" },
        (payload) => {
          if (payload.new.user2 === getUsername()) {
            setNotifications(notifications - 1);
          }
        }
      )
      .subscribe();

    if (hasMounted && loading) {
      getNotifications();
      setLoading(false);
    }
  }, [hasMounted, notifications]);

  return (
    <div
      className={
        "w-[100px] flex flex-col justify-between items-center  border-stone-800 dark:border-opacity-400 dark:border-opacity-10 py-5 pl-2 pr-1 mr-1 overflow-hidden"
      }
    >
      <p className="font-thin text-center text-5xl">W</p>

      <div className="w-full flex flex-col items-center space-y-3">
        <SearchModal />
        <Button
          variant="outline"
          className="relative border-0 rounded-[15px] w-[60px] h-[60px] overflow-visible"
          onClick={() => router.push("/dashboard/messages")}
        >
          <Send />
          <Badge className="absolute top-[-8px] right-[-8px]"></Badge>
        </Button>
        <Button
          variant="outline"
          className="relative border-0 rounded-[15px] w-[60px] h-[60px] overflow-visible"
          onClick={() => router.push("/dashboard/notifications")}
        >
          <Inbox />
          {notifications > 0 && (
            <Badge className="absolute top-[-8px] right-[-8px]">
              {notifications}
            </Badge>
          )}
        </Button>
      </div>
      <MenuButton />
    </div>
  );
}
