"use server";

import { periodToDateRange } from "@/lib/helper/dates";
import prisma from "@/lib/prisma";
import { Period } from "@/types/analytics";
import { ExecutionPhaseStatus, WorkflowExecutionStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { eachDayOfInterval, format } from "date-fns";

type Stats=Record<string,{success:number;failed:number;}>;
const {COMPLETED,FAILED}=ExecutionPhaseStatus;

export async function GetCreditUsageInPeriod(period:Period) {
    const{userId}=await auth();
    if(!userId){throw new Error("unauthenticated");}
    const dateRange=periodToDateRange(period);
    const executionPhases=await prisma.executionPhase.findMany({
        where:{userId,startedAt:{gte:dateRange.startDate,lte:dateRange.endDate,},
        status:{in:[COMPLETED,FAILED],},
    },
    });
    
    const dateFormat="yyyy-MM-dd";

    const stats:Stats=eachDayOfInterval({
        start:dateRange.startDate,
        end:dateRange.endDate})
        .map(date=>format(date,dateFormat))
        .reduce((acc,date)=>{
            acc[date]={success:0,failed:0};
            return acc;
    },{}as any);

    executionPhases.forEach(phase =>{
        const date=format(phase.startedAt!,dateFormat)
        if(phase.status===COMPLETED){
            stats[date].success+=phase.creditsConsumed||0;
        }
        if(phase.status===FAILED){
            stats[date].failed+=phase.creditsConsumed||0;
        }
    });
    const result=Object.entries(stats).map(([date,infos])=>({date,...infos}));;
    return result;
}