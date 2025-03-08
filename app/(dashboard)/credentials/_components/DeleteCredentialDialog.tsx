"use client";
import { DeleteCredential } from "@/actions/credentials/deleteCredential";
import { DeleteWorkflow } from "@/actions/workflows/deleteWorkflow";
import{AlertDialog,AlertDialogAction,AlertDialogCancel,AlertDialogContent,AlertDialogDescription,AlertDialogFooter,AlertDialogHeader,AlertDialogTitle,AlertDialogTrigger} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { XIcon } from "lucide-react";

import React, { useState } from 'react'
import { toast } from "sonner";


interface Props{name:string;}


function DeleteWorkflowDialog({name}:Props) {
    const [open,setOpen]=useState(false);
    const[confirmText,setConfirmText]=useState("");


    const deleteMutation=useMutation({
        mutationFn:DeleteCredential,
        onSuccess:()=>{toast.success("credential deleted successfully",{id:name});setConfirmText("");},
        onError:()=>{toast.error("Something went wrong",{id:name})}
    })
    
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
            <Button variant={"destructive"} size={"icon"}>
                <XIcon size={18}/>
            </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Confirm</AlertDialogTitle>
                <AlertDialogDescription>
                    If you Delete this Credential, you will not be able to recover it.
                    <div className="flex flex-col py-4 gap-2">
                        <p>If Sure, Enter <b>{name}</b> to confirm:</p>
                        <Input value={confirmText} onChange={e=>setConfirmText(e.target.value)}/>
                    </div>
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={()=>setConfirmText("")}>Cancel</AlertDialogCancel>
                <AlertDialogAction disabled={confirmText!==name|| deleteMutation.isPending} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={()=>{toast.loading("Deleting Credential...",{id:name});deleteMutation.mutate(name)}}>Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteWorkflowDialog;
