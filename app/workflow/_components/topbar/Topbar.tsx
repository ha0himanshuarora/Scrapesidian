"use client";
import TooltipWrapper from '@/components/TooltipWrapper';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import SaveBtn from './SaveBtn';
import ExecuteBtn from './ExecuteBtn';
import NavigationTabs from './NavigationTabs';
import PublishBtn from './PublishBtn';
import UnpublishBtn from './UnpublishBtn';

interface Props{
    title: string;
    subtitle:string;
    workflowId:string;
    hideButtons?:boolean;
    isPublished:boolean;
}

function Topbar({title, subtitle, workflowId,hideButtons=false,isPublished=false,}:Props) {
    const router=useRouter();
    return (
        <header className='flex items-center p-2 border-2 border-separater justify-between w-full h-[60px] sticky top-0 bg-background z-10'>
            <div className="flex gap-1 flex-1 items-center">
                <TooltipWrapper content="Back">
                    <Button variant={"ghost"} size={"icon"} onClick={()=>router.back()}>
                        <ChevronLeftIcon size={20}/>
                    </Button>
                </TooltipWrapper>
                <div>
                    <p className="font-bold text-ellipsis truncate">{title}</p>
                    <p className="text-xs text-muted-foreground truncate text-ellipsis">{subtitle}</p>
                </div>
            </div>
            <NavigationTabs workflowId={workflowId}/>
            <div className="flex gap-1 flex-1 justify-end items-center">
                {hideButtons===false && (
                    <>
                        <ExecuteBtn workflowId={workflowId}/>
                        {isPublished&&<UnpublishBtn workflowId={workflowId}/>}
                        {!isPublished &&(
                        <>
                            <SaveBtn workflowId={workflowId}/>
                            <PublishBtn workflowId={workflowId}/>
                        </>)}
                    </>
                )}
            </div>
        </header>
    );
}

export default Topbar;
