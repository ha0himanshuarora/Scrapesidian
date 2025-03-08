import { ExecutionEnvironment } from "@/types/executor";
import { FillInputTask } from "../task/FillInput";
import { waitFor } from "@/lib/helper/waitFor";

export async function FillInputExecutor(environment: ExecutionEnvironment<typeof FillInputTask>): Promise<boolean> {

    try {

        const selector = environment.getInput("Selector");
        console.log("Selector input:", selector);

        if (!selector) {
            environment.log.error("input->selector not defined");
            return false;
        } else {
            environment.log.info(`Selector: ${selector}`);
        }

        const value = environment.getInput("Value");
        console.log("Value input:", value);

        if (!value) {
            environment.log.error("input->value not defined");
            return false;
        } else {
            environment.log.info(`Value: ${value}`);
        }

        await environment.getPage()!.type(selector, value);
        return true;

    } catch (error: any) {
        environment.log.error(error);
        return false;
    }
}
