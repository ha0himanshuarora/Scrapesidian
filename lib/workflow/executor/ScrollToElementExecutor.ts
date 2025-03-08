import { ExecutionEnvironment } from "@/types/executor";
import { ScrollToElementTask } from "../task/ScrollToElement";

export async function ScrollToElementExecutor(environment: ExecutionEnvironment<typeof ScrollToElementTask>): Promise<boolean> {
    try {
        const selector = environment.getInput("Selector");
        console.log("Scroll to: ", selector);

        if (!selector) {
            environment.log.error("input->selector not defined");
            return false;
        }

        const elementFound = await environment.getPage()!.evaluate((selector) => {
            const element = document.querySelector(selector);
            if (!element) {
                throw new Error("Element not found"); // Exit immediately if element is not found
            }
            const top = element.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top });
            return true;
        }, selector);

        return elementFound;
    } catch (error: any) {
        environment.log.error(error.message || error); // Log the error message
        return false; // Return false if element is not found
    }
}
