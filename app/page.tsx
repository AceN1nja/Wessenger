"use client";
import DarkModeToggle from "@/components/DarkModeToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import LoginForm from "@/components/LoginForm";
import SignUpForm from "@/components/SignUpForm";

export default function Home() {
  return (
    <main className="flex h-screen w-screen flex-row items-center justify-between dark:text-white text-black">
      <div
        className={`flex flex-col h-full w-[65%] justify-center items-center border-r border-opacity-30 dark:border-white border-black dark:bg-stone-950 bg-stone-50`}
      >
        <DarkModeToggle className={"absolute top-5 left-5"} />
        <h1
          className={
            "flex flex-row text-9xl w-full justify-center font-thin items-center p-8"
          }
        >
          WESSENGER
        </h1>
        <h2
          className={
            "flex flex-row text-4xl w-full justify-end font-thin items-center pr-12"
          }
        >
          It's like WeChat, but Messenger
        </h2>
      </div>

      <div
        className={"flex flex-col h-full w-[35%] justify-center items-center"}
      >
        <Tabs defaultValue="login" className={"w-[55%]"}>
          <TabsList className="grid w-full grid-cols-2 rounded-md">
            <TabsTrigger className="rounded-md" value="login">Login</TabsTrigger>
            <TabsTrigger className="rounded-md" value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm />
          </TabsContent>
          <TabsContent value="signup">
            <SignUpForm />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
