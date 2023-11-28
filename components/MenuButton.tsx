"use client";
import { LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { ToolTip } from "./ToolTip";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useContext } from "react";

import { UserContext } from "@/app/dashboard/UserProvider";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
const supabase = createClient();

export default function MenuButton() {
  const { getUsername, getInitials } = useContext(UserContext);
  const { toast } = useToast();
  const router = useRouter();

  const handleLogout = async () => {
    toast({
      title: "Logged out",
      description: "You have been logged out!",
    });
    await supabase.auth.signOut();
  };

  return (
    <main className={"select-none "}>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <ToolTip tip={getUsername()}>
            <Avatar className={"w-16 h-16 select-none object-fit"}>
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
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleLogout()}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </main>
  );
}
