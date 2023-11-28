import { ReactNode } from "react";
import MenuBar from "@/components/MenuBar";
import SideMenu from "@/components/SideMenu";
import dynamic from "next/dynamic";

const UserProvider = dynamic(() => import("./UserProvider"), { ssr: false });

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <main>
      
        <UserProvider>
          <div className={"flex w-screen  h-screen "}>
            <SideMenu />
            <div className={"flex flex-col flex-1"}>
              <MenuBar />
              
              {children}
            </div>
          </div>
        </UserProvider>
      
    </main>
  );
}
