"use client"
import { LogOut, Menu } from "lucide-react";
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
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { set } from "date-fns";
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
const supabase = createClient();
  

export default function MenuButton() {
    const [user, setUser] = useState<User | null>(null)
    
    const handleLogout = async () => {
        await supabase.auth.signOut()
        
    }

    supabase.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_OUT") {
            window.location.href = "/signing"
        }
    })
    
    const getUser = async () => {
        const {data, error} = await supabase.auth.getUser();
        if (error) {
          console.log(error)
        } else {
          setUser(data.user)
        }
      }
    getUser();

    const {data, count} = useQuery(
        supabase
          .from('users')
          .select('username')
          .eq('email', user?.email)
          .single(),
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        }
    );

    

    

    return (
        <main className={"select-none "}>
            <DropdownMenu>
                <DropdownMenuTrigger>
                <ToolTip tip={data ? data.username : "loading.."} >
                    <Avatar className={"w-12 h-12 select-none"}>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
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