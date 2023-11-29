"use client";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

import { createClient } from "@/lib/supabase/client";
import { UserContext } from "../UserProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
const supabase = createClient();

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
        <FriendRequests />
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

function FriendRequests() {
  const [friendRequests, setFriendRequests] = useState<
    {
      user1: String;
      users: {
        full_name: String;
      };
    }[]
  >([]);
  const { getUsername, hasMounted } = useContext(UserContext);

  useEffect(() => {
    const getFriendRequests = async () => {
      const { data, error } = await supabase
        .from("friends")
        .select("user1, users!friends_user1_fkey ( full_name )")
        .eq("user2", getUsername())
        .eq("status", "pending");

      if (error) {
        console.log("error", error);
      } else {
        console.log(data);
        // @ts-ignore
        setFriendRequests(data);
      }
    };

    supabase
      .channel("friendRequestsAdds_Page")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "friends" },
        (payload) => {
          if (payload.new.user2 === getUsername()) {
            getFriendRequests();
          }
        }
      )
      .subscribe();

    supabase
      .channel("friendRequestsUpdates_Page")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "friends" },
        (payload) => {
          if (payload.new.user2 === getUsername()) {
            getFriendRequests();
          }
        }
      )
      .subscribe();

    if (hasMounted) {
      getFriendRequests();
    }
  }, [hasMounted]);

  const handleAccept = async (user1: String) => {
    const { data, error } = await supabase
      .from("friends")
      .update({ status: "accepted" })
      .eq("user1", user1)
      .eq("user2", getUsername());

    if (error) {
      console.log(error);
    } else {
      console.log("accepted");
    }
  };

  const handleReject = async (user1: String) => {
    const { data, error } = await supabase
      .from("friends")
      .delete()
      .eq("user1", user1)
      .eq("user2", getUsername());

    if (error) {
      console.log(error);
    } else {
      console.log("rejected");
    }
  };

  return (
    <ScrollArea className="w-full h-full space-y-4 mt-3">
      {friendRequests.map((friendRequest) => {
        const {
          user1,
          users: { full_name },
        } = friendRequest;
        return (
          <Card
            key={user1 as React.Key}
            className={" mb-2 rounded-md dark:border-transparent py-3"}
          >
            <CardContent className="flex flex-row justify-between items-center py-2 px-4">
              <div className={"flex flex-row gap-4 "}>
                <Avatar className={"h-[55px] w-[55px]"}>
                  <AvatarImage
                    src={`${process.env.NEXT_PUBLIC_AVATAR_URL}${user1}`}
                  />
                  <AvatarFallback>{full_name[0]}</AvatarFallback>
                </Avatar>
                <div className={"flex flex-col justify-center items-start"}>
                  <div className={"text-lg font-semibold"}>{full_name}</div>
                  <div className={"text-md font-thin text-stone-500"}>
                    @{user1}
                  </div>
                </div>
              </div>
              <div className={"flex flex-row "}>
                <Button
                  variant={"ghost"}
                  className={
                    "text-stone-500 text-md font-semibold hover:text-stone-200 dark:hover:bg-transparent px-2"
                  }
                  onClick={() => handleAccept(user1)}
                >
                  Accept
                </Button>
                <Button
                  variant={"ghost"}
                  className={
                    "text-stone-500 text-md font-semibold hover:text-stone-200 dark:hover:bg-transparent px-2"
                  }
                  onClick={() => handleReject(user1)}
                >
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </ScrollArea>
  );
}
