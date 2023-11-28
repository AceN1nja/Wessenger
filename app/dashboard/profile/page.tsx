"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import React, { useContext } from "react";
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();
import { UserContext } from "@/app/dashboard/UserProvider";
import { ToolTip } from "@/components/ToolTip";
import { useToast } from "@/components/ui/use-toast";

export default function ProfilePage() {
  const { getUsername, getFullName, getInitials } = useContext(UserContext);
  const { toast } = useToast();

  const username = getUsername();
  const fullName = getFullName();

  //ref for image upload
  const imageUploadRef = React.useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    imageUploadRef.current?.click();
  };

  const handleImageUpload = async () => {
    console.log(imageUploadRef.current?.files?.[0]);
    const file = imageUploadRef.current?.files?.[0];
    if (file) {
      const fileName = `${username}`;
      const { error } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, { cacheControl: "1", upsert: true });
      if (error) {
        console.log(error);
      } else {
        toast({
          title: "Avatar",
          description: "Profile image has been updated!",
        });
      }
    }
  };

  if (!username) {
    return (
      <main
        className={"flex w-full h-full justify-center items-center text-5xl"}
      >
        Loading...
      </main>
    );
  }

  return (
    <main
      className={
        "w-full h-full flex flex-col items-center justify-between border-t border-l rounded-tl-[20px]  dark:border-stone-400 border-stone-800 dark:border-opacity-10 p-4 "
      }
    >
      <Card
        className={
          " flex flex-col w-full h-[35%] dark:border-transparent relative  "
        }
      >
        <div className="relative h-[65%] bg-[url('/banner1.jpg')] overflow-visible">
          <input
            ref={imageUploadRef}
            type="file"
            hidden
            onChange={() => handleImageUpload()}
          />
          <ToolTip tip="Change Profile Image">
            <Avatar
              className={
                " absolute bottom-[-45px] left-[60px] w-[150px] h-[150px] select-none z-100 cursor-pointer"
              }
              onClick={() => handleUploadClick()}
            >
              {getUsername() ? (
                <AvatarImage
                  src={
                    `${process.env.NEXT_PUBLIC_AVATAR_URL}${getUsername()}#` +
                    new Date().getTime()
                  }
                />
              ) : (
                <AvatarImage />
              )}
              {getInitials() ? (
                <AvatarFallback>{getInitials()}</AvatarFallback>
              ) : (
                <AvatarImage />
              )}
            </Avatar>
          </ToolTip>
        </div>
        <CardContent className="h-[35%] flex flex-col justify-center items-start gap-1 border-transparent border-opacity-0 pl-[220px] py-2  ">
          <p className="text-3xl font-medium capitalize">{fullName}</p>
          <p className="text-md text-stone-600">@{username}</p>
        </CardContent>
      </Card>
    </main>
  );
}
