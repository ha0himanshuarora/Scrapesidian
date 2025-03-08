import { ExecutionEnvironment } from "@/types/executor";
import { waitFor } from "@/lib/helper/waitFor";
import { ReadPropertyFromJsonTask } from "../task/ReadPropertyFromJson";

export async function ReadPropertyFromJsonExecutor(environment:ExecutionEnvironment<typeof ReadPropertyFromJsonTask>):Promise<boolean> {
    try {
        const jsonData = environment.getInput("JSON");
        if (!jsonData) {
            environment.log.error("input->JSON not defined");
            return false;
        }
        
        const propertyName = environment.getInput("Property name");
        if (!propertyName) {
            environment.log.error("input->Property name not defined");
            return false;
        }

        const json = JSON.parse(jsonData);

        // Log the parsed JSON and property name for debugging
        console.log('Parsed JSON:', json);
        console.log('Property Name:', propertyName);

        const propertyValue = json[propertyName];
        if (propertyValue === undefined) {
            environment.log.error(`Property '${propertyName}' not defined in the JSON`);
            return false;
        }

        // Log the property value for debugging
        console.log('Property Value:', propertyValue);
        
        environment.setOutput("Property value", propertyValue);
        return true;

    } catch (error: any) {
        environment.log.error(error);
        return false;
    }
}
