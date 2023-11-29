"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();

import { Button } from "@/components/ui/button";
import { Check, Plus, Search } from "lucide-react";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { useContext, useEffect, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { UserContext } from "@/app/dashboard/UserProvider";
import { useToast } from "./ui/use-toast";

type Result = {
  username: string;
  full_name: string;
};

export default function SearchModal() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Result[]>([]); // [{username, fullName}]
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {

    const searchUsers = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("username, full_name")
        .or(
          `username.ilike.%${debouncedSearch}%, full_name.ilike.%${debouncedSearch}%`
        );

      if (error) {
        console.log(error);
      } else {
        setResults(data);
      }
    };

    if (debouncedSearch !== "") {
      searchUsers();
    } else {
      setResults([]);
    }
  }, [debouncedSearch]);

  const onClose = () => {
    setSearch("");
    setResults([]);
  };

  return (
    <Dialog onOpenChange={() => onClose()}>
      <DialogTrigger>
        <div className="flex justify-center items-center border-0 rounded-[15px] w-[60px] h-[60px] mb-10 transition-colors border-stone-200 bg-white hover:bg-stone-100 hover:text-stone-900 dark:border-stone-800 dark:bg-stone-950 dark:hover:bg-stone-800 dark:hover:text-stone-50">
          <Search />
        </div>
      </DialogTrigger>
      <DialogContent className="flex flex-col justify-start items-start min-w-[30vw] h-[80vh]">
        <DialogHeader>
          <DialogTitle className="">Add Friends</DialogTitle>
          <DialogDescription>
            Search for friends by their name or username.
          </DialogDescription>
        </DialogHeader>
        <Input
          placeholder="Search"
          onChange={(e) => setSearch(e.target.value)}
        />
        {debouncedSearch !== "" && results.length > 0 && (
          <ScrollArea className="flex-1 w-full flex flex-col justify-start items-center gap-2">
            {results.map((result) => (
              <ResultCard key={result.username} {...result} />
            ))}
          </ScrollArea>
        )}
        {debouncedSearch === "" && (
          <div className="flex-1 w-full flex flex-col justify-center items-center gap-2">
            <p className="text-stone-500">
              Search for friends by their name or username.
            </p>
          </div>
        )}
        {debouncedSearch !== "" && results.length === 0 && (
          <div className="flex-1 w-full flex flex-col justify-center items-center gap-2">
            <p className="text-stone-500">No results found.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function ResultCard({ username, full_name }: Result) {
  const { getUsername } = useContext(UserContext);
  const { toast } = useToast();

  if (getUsername() === username) {
    return null;
  }

  const [sent, setSent] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const getRequestStatus = async () => {
      const { data, error } = await supabase
        .from("friends")
        .select("status")
        .eq("user1", getUsername())
        .eq("user2", username)
        .single();

      if (error) {
        console.log(error);
        setStatus("none");
      } else {
        if (data.status) {
          setStatus(data.status);
        } else {
          setStatus("none");
        }
      }
    };

    getRequestStatus();
  }, []);

  if (!status) {
    return null;
  }

  const sendRequest = async (username: string) => {
    const { data, error } = await supabase
      .from("friends")
      .insert([{ user1: getUsername(), user2: username, status: "pending" }]);

    if (error) {
      console.log(error);
    } else {
      console.log(data);
      setSent(true);
      toast({
        title: "Friend Request",
        description: `Friend request sent to @${username}!`,
      });
    }
  };

  const showButton = () => {
    if (status === "accepted" || sent) {
      return <Check className="h-8 w-8 mr-3" />;
    }

    if (status === "pending") {
      return (
        <Button
          variant="outline"
          disabled
          className="rounded-full bg-yellow-400"
        >
          Pending...
        </Button>
      );
    }

    return (
      <Button
        variant="outline"
        size="icon"
        className="rounded-full"
        onClick={() => sendRequest(username)}
      >
        <Plus className="h-4 w-4" />
      </Button>
    );
  };

  return (
    <Card className={" mb-2 rounded-[22px]"}>
      <CardContent className="flex flex-row justify-between items-center py-2 px-4">
        <div className={"flex flex-row gap-4 "}>
          <Avatar className={"h-[55px] w-[55px]"}>
            <AvatarImage
              src={`${process.env.NEXT_PUBLIC_AVATAR_URL}${username}`}
            />
            <AvatarFallback>{full_name[0]}</AvatarFallback>
          </Avatar>
          <div className={"flex flex-col justify-center items-start"}>
            <div className={"text-lg font-semibold"}>{full_name}</div>
            <div className={"text-md font-thin text-stone-500"}>
              @{username}
            </div>
          </div>
        </div>
        {showButton()}
      </CardContent>
    </Card>
  );
}
