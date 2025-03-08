import React, { Suspense } from 'react'
import{Alert,AlertDescription,AlertTitle} from "@/components/ui/alert";
import { LockKeyholeIcon, ShieldIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { GetCredentialsForUser } from '@/actions/credentials/getCredentialsForUser';
import { Card } from '@/components/ui/card';
import CreateCredentialDialog from './_components/CreateCredentialDialog';
import { formatDistanceToNow } from 'date-fns';
import DeleteCredentialDialog from './_components/DeleteCredentialDialog';

export default function CredentialsPage() {
  return (
    <div className='flex flex-1 flex-col h-full'>
        <div className='flex justify-between'>
            <div className='flex flex-col'>
                <h1 className='text-3xl font-bold'>Credentials</h1>
                <p className='text-muted-foreground'>Manage your Credentials</p>
            </div>
            <CreateCredentialDialog/>

        </div>


        <div className='h-full py-6 space-y-8'>
            <Alert>
                <ShieldIcon className='h-4 w-4 stroke-primary'/>
                <AlertTitle className='text-primary'>Encryption</AlertTitle>
                <AlertDescription>All information is securely encrypted</AlertDescription>
            </Alert>
            <Suspense fallback={<Skeleton className='h-[300px] w-full'/>}>
                <UserCredentials/>
            </Suspense>
        </div>
      
    </div>
  )
}

async function UserCredentials() {
    const credentials = await GetCredentialsForUser();
    if (!credentials) {
      return <div>Something went wrong</div>;
    }
  
    if (credentials.length === 0) {
      return (
        <Card className="w-full p-6 flex flex-col items-center justify-center gap-6">
          {/* Icon Section */}
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
              <ShieldIcon size={40} className="stroke-primary" />
            </div>
          </div>
          {/* Text Section */}
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="font-bold text-lg">No credentials created yet</p>
            <p className="text-sm text-muted-foreground">
              Click the button below to create your first credentials
            </p>
          </div>
          {/* Create Button */}
          <CreateCredentialDialog triggerText="Create your first credential" />
        </Card>
      );
    }
  
    return (
        <div className="flex gap-4 flex-wrap">
          {credentials.map((credential) => {
            const createdAt = formatDistanceToNow(credential.createdAt, { addSuffix: true });
      
            return (
              <Card key={credential.id} className=" w-full p-4 flex justify-between gap-2">
                <div className=" rounded-full flex items-center gap-2">
                  <LockKeyholeIcon size={18} className="stroke-primary" />
                  <div>
                    <p className="font-bold">{credential.name}</p>
                    <p className="text-xs text-muted-foreground">{createdAt}</p>
                  </div>
                </div>

                <DeleteCredentialDialog name={credential.name}/>
              </Card>
            );
          })}
        </div>
      );
}      