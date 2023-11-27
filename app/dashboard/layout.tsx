import { ReactNode } from "react";
import UserProvider from "./UserProvider";
import MenuBar from "@/components/MenuBar";
import SideMenu from "@/components/SideMenu";

const isSSR = () => typeof window === "undefined";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <main>
      {isSSR() && (
        <UserProvider>
          <div className={"flex w-screen  h-screen "}>
            <SideMenu />
            <div className={"flex flex-col flex-1"}>
              <MenuBar />
              {children}
            </div>
          </div>
        </UserProvider>
      )}
    </main>
  );
}
