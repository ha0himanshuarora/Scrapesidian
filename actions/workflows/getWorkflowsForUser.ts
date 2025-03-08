"use server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Workflow } from "@prisma/client"; // Ensure you have the correct import for your Prisma models

// Define the return type for better type safety
export async function GetWorkflowsForUser(): Promise<Workflow[]> {
    try {

        const { userId } = await auth();

        if (!userId) {
            console.error("User is unauthenticated");
            throw new Error("Unauthenticated");
        }

        const workflows = await prisma.workflow.findMany({
            where: { userId },
            orderBy: { createdAt: "asc" },
        });
        return workflows;
    } catch (error) {
        console.error("Error fetching workflows for user:", error);
        throw error; // Re-throw the error after logging it
    }
}