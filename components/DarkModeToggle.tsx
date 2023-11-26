"use client"
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { Suspense } from "react";

export default function DarkModeToggle({className, size}: {className?: string, size?: number}) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    //set local storage
    localStorage.setItem("theme", theme === "dark" ? "light" : "dark");
    //set theme
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return (
    <Suspense fallback={<div></div>}>
      <main className={className}>
          <button
              className={"flex items-center justify-center w-11 h-11 rounded-full bg-stone-800 dark:bg-white focus:outline-none" + cn(className)}
              onClick={() => toggleTheme()}
          >
              { localStorage.getItem("theme") === "dark" ? 
                  <Sun className=" text-gray-800" />
              : 
                  <Moon className= "text-gray-200" />
              }
          </button>
      </main>
    </Suspense>
    
  );
}