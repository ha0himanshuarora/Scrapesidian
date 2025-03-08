"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function SetupUser() {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthenticated");
    }

    // Find user balance by userId//Mongo done
    const balance = await prisma.userBalance.findUnique({
        where: {
            userId: userId,  // userId is a string
        },
    });

    if (!balance) {
        // Create user balance with 100 credits
        await prisma.userBalance.create({
            data: {
                userId: userId,  // userId is a string
                credits: 100,
            },
        });
    }

    redirect("/");
}
