"use server";

import { periodToDateRange } from "@/lib/helper/dates";
import prisma from "@/lib/prisma";
import { Period } from "@/types/analytics";
import { WorkflowExecutionStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { eachDayOfInterval, format } from "date-fns";

type Stats = Record<string, { success: number; failed: number }>;

export async function GetWorkflowExecutionStats(period: Period) {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("unauthenticated");
    }

    // Get the date range for the provided period
    const dateRange = periodToDateRange(period);

    // Fetch workflow executions within the date range
    const executions = await prisma.workflowExecution.findMany({
        where: {
            userId,
            startedAt: {
                gte: dateRange.startDate,
                lte: dateRange.endDate,
            },
        },
    });

    const dateFormat = "yyyy-MM-dd";

    // Initialize stats for each day in the date range
    const stats: Stats = eachDayOfInterval({
        start: dateRange.startDate,
        end: dateRange.endDate,
    })
        .map(date => format(date, dateFormat))
        .reduce((acc, date) => {
            acc[date] = { success: 0, failed: 0 };
            return acc;
        }, {} as any);

    // Populate stats with execution results
    executions.forEach(execution => {
        const date = format(execution.startedAt!, dateFormat);  // Ensure `startedAt` is defined
        if (execution.status === WorkflowExecutionStatus.COMPLETED) {
            stats[date].success += 1;
        }
        if (execution.status === WorkflowExecutionStatus.FAILED) {
            stats[date].failed += 1;
        }
    });

    // Convert stats to a more readable result format
    const result = Object.entries(stats).map(([date, infos]) => ({
        date,
        ...infos,
    }));

    return result;
}
