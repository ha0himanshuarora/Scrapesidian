import { ExecutionEnvironment } from "@/types/executor";
import { waitFor } from "@/lib/helper/waitFor";
import { NavigateUrlTask } from "../task/NavigateUrlTask";

export async function NavigateUrlExecutor(environment:ExecutionEnvironment<typeof NavigateUrlTask>):Promise<boolean>{
    try{
        const url =environment.getInput("URL");
        console.log("Click on: ",url);
        if(!url){environment.log.error("input->selector not defined");}

        await environment.getPage()!.goto(url);
        environment.log.info(`visited url ${url}`);
        return true;

}catch(error:any){
    environment.log.error(error);return false;
}
}