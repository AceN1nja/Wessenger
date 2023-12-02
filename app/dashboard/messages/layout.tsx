
import { Separator } from "@/components/ui/separator";
import Inbox from "./Inbox";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main
      className={
        "w-full h-full flex flex-row items-center justify-between border-t border-l rounded-tl-[20px]  dark:border-stone-400 border-stone-800 dark:border-opacity-10 p-4 space-x-4 "
      }
    >
      <div className={"flex flex-col w-[20%] h-full justify-start items-start"}>
        <div className="flex flex-row justify-start items-center space-y-3 text-3xl font-extralight">
          Messages
        </div>
        <Inbox />
      </div>
      <Separator orientation="vertical" className="bg-opacity-50" />
      <div className={"flex flex-col w-[80%] h-full justify-start items-start"}>
          {children}
      </div>
    </main>
  );
}



