"use client"
import { LogOut } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {createClient} from "@/lib/supabase/client"
import { ToolTip } from "./ToolTip";
import { Avatar, AvatarFallback, AvatarImage} from "./ui/avatar";
import { useContext } from "react";

import { UserContext } from "@/app/dashboard/UserProvider";
const supabase = createClient();
  

export default function MenuButton() {
    const {getUsername} = useContext(UserContext);
    
    const handleLogout = async () => {
        localStorage.removeItem("avatar")
        await supabase.auth.signOut()
        
    }

    return (
        <main className={"select-none "}>
            <DropdownMenu>
                <DropdownMenuTrigger>
                <ToolTip tip={getUsername()} >
                    <Avatar className={"w-12 h-12 select-none"}>
                        <AvatarImage />
                        <AvatarFallback />
                    </Avatar>
                </ToolTip>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>
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
    )
}