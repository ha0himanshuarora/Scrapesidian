"use server";
import prisma from "@/lib/prisma";
import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
import {createWorkflowSchema, createWorkflowSchemaType} from "@/schema/workflow"
import { AppNode } from "@/types/appNode";
import { TaskType } from "@/types/task";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { Edge } from "@xyflow/react";
import { redirect } from "next/navigation";

export async function CreateWorkflow(form:createWorkflowSchemaType){
    const {success,data}=createWorkflowSchema.safeParse(form);
    if (!success){
        throw new Error("invalid form data");
    }
    const{userId}=await auth();
    if (!userId){
        throw new Error("unathenticated");
    }

    const initialFLow:{nodes:AppNode[],edges:Edge[]}={nodes:[],edges:[],};

    //Flow Entry Point
    initialFLow.nodes.push(CreateFlowNode(TaskType.LAUNCH_BROWSER));

    const result =await prisma.workflow.create({
        data:{
            userId,
            status:WorkflowStatus.DRAFT,
            definition:JSON.stringify(initialFLow),
            ...data,
        },
    });
    if (!result){
        throw new Error("failed to create workflow");
    }
    redirect(`/workflow/editor/${result.id}`)
};