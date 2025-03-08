"use client"

import { TaskParam } from "@/types/task";
import { ReactNode } from "react";
import NodeParamField from "./NodeParamField";
import { Handle, Position } from "@xyflow/react";
import { ColorForHandle } from "./common";
import { cn } from "@/lib/utils";

export function NodeOutputs({ children }: {children : ReactNode  }) {
    return <div className="flex flex-col divide-y gap-4">{children}</div>;
    }
export function NodeOutput ({output} : {output: TaskParam }) {
    return ( <div className="flex justify-end relative p-3 bg-secondary ">
        <p className="twxt-xs text-muted-foreground">{output.name}</p>
        <Handle id={output.name} type="source" position={Position.Right} className={cn("!bg-muted-foreground !border-2 !border-background !-right-2 !w-4 !h-4", ColorForHandle[output.type])}/>
        </div>
);    
}
