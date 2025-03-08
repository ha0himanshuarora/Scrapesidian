import { ExecutionEnvironment } from "@/types/executor";
import { waitFor } from "@/lib/helper/waitFor";
import { ClickElementTask } from "../task/ClickElement";

export async function ClickElementExecutor(environment:ExecutionEnvironment<typeof ClickElementTask>):Promise<boolean>{
    try{
        const selector =environment.getInput("Selector");
        console.log("Click on: ",selector);
        if(!selector){environment.log.error("input->selector not defined");}

        await environment.getPage()!.click(selector);
        return true;

}catch(error:any){
    environment.log.error(error);return false;
}
}