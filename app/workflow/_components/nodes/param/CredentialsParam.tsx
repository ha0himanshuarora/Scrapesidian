"use client";
import { ParamProps } from '@/types/appNode';
import React, { useId } from 'react'
import{Select,SelectGroup,SelectValue,SelectTrigger,SelectContent,SelectLabel,SelectItem,SelectSeparator,SelectScrollUpButton,SelectScrollDownButton,} from "@/components/ui/select"
import { Label } from '@/components/ui/label';
import { useQuery } from '@tanstack/react-query';
import { GetCredentialsForUser } from '@/actions/credentials/getCredentialsForUser';




function CredentialsParam({param,updateNodeParamValue,value,}:ParamProps) {
  const id=useId();
  const query=useQuery({
    queryKey:["credentials-for-user"],
    queryFn:()=>GetCredentialsForUser(),
    refetchInterval:10000,
  })

  return (
    <div className='flex flex-col gap-1 w-full'>
      <Label htmlFor={id} className='text-xs flex'>
        {param.name}
        {param.required && <p className='text-red-400 px-2'>*</p>}
      </Label>
      <Select onValueChange={value=>updateNodeParamValue(value)} defaultValue={value}>
        <SelectTrigger className='w-full'>
          <SelectValue placeholder="Select an option"/>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Credentials</SelectLabel>
              {query.data?.map(Credential=>(<SelectItem key={Credential.id} value={Credential.id}>{Credential.name}</SelectItem>))}
            </SelectGroup>
          </SelectContent>
        </SelectTrigger>
      </Select>
    </div>
  )
}

export default CredentialsParam;
