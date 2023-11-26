
import { Inbox, Menu, Send } from 'lucide-react';
import React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from '@/components/ui/button';
import MenuButton from './MenuButton';


export default function SideMenu() {

  return (
    <div className={"w-[100px] flex flex-col justify-between items-center  border-stone-800 dark:border-opacity-400 dark:border-opacity-10 py-5 pl-2 pr-1 mr-1 overflow-hidden"}>
        <p className="font-thin text-center text-5xl">
            W
        </p>

        <div className="flex flex-col items-center space-y-3">
            <Button variant="outline" className='border-0 rounded-[15px] w-[60px] h-[60px] '>
                <Send />
            </Button>
            <Button variant="outline" className='border-0 rounded-[15px] w-[60px] h-[60px] '>
                <Inbox />
            </Button>
        </div>
        <MenuButton />
        
    </div>
  );
};

