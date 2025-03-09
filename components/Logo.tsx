import { cn } from '@/lib/utils';
import { SquareDashedMousePointer } from 'lucide-react';
import Link from 'next/link';
import React from 'react'
import Image from 'next/image';


function Logo({fontSize="text-2xl",iconSize=20}:{fontSize?:string;iconSize?:number;}) {
    return (
    <div className={cn("text-2xl font-extrabold flex items-center gap-2", fontSize)}>
      <Link className="flex font-bold flex-row p-2" href="/">
        <Image src="/ObsidianLogo.png" width={35} height={35} alt="Obsidian logo" className="shadow-sm"/>
      </Link>

        
        <div>
            <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
            Scrape
            </span>
            <span className="text-stone-700 dark:text-stone-300">sidian</span>
        </div>
    </div>
    );
}
export default Logo;
