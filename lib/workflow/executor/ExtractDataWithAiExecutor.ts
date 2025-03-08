import { ExecutionEnvironment } from "@/types/executor";
import { waitFor } from "@/lib/helper/waitFor";
import { ClickElementTask } from "../task/ClickElement";
import { ExtractDataWithAITask } from "../task/ExtractDataWithAi";
import prisma from "@/lib/prisma";
import { symmetricDecrypt } from "@/lib/encryption";
import OpenAI from "openai";
export async function ExtractDataWithAiExecutor(environment:ExecutionEnvironment<typeof ExtractDataWithAITask>):Promise<boolean>{
    try{
        const credentials =environment.getInput("Credentials");
        if(!credentials){environment.log.error("input->creentials not defined");}

        const prompt =environment.getInput("Prompt");
        if(!prompt){environment.log.error("input->prompt not defined");}

        const content =environment.getInput("Content");
        if(!content){environment.log.error("input->content not defined");}

        const credential=await prisma.credential.findUnique({
            where:{id:credentials},
        });
        if(!credential){environment.log.error("credential not found");return false;}

        const plainCredentialValue=symmetricDecrypt(credential.value)
        if(!plainCredentialValue){
            environment.log.error("cannot decrypt credential");
            return false;
        }
        const mockExtractedData={
            usernameSelector:"#username",
            passwordSelector:"#password",
            loginSelector:"body>div>form>input.btn.btn-primary",
        };
//Use for API
        // const openai = new OpenAI({
        //     apiKey:plainCredentialValue,
        // });

        // const response = await openai.chat.completions.create({
        //     model: "gpt-4o-mini",
        //     messages: [
        //         { role: "system",
        //          content: "You're a webscraper helper that extracts data from HTML or text. you'll be given HTML or text as input and prompt with data you need to extract. The response should always be only extracted data as JSON array or object, without any additional words or explanations. Analyze the input carefully and extract data precisely based on the prompt. If no data is found return an empty JSON array. Work only with provided content and ensure output is always a valid JSON array without any surrounding text."
        //          },
        //         {
        //             role: "user",
        //             content: content,
        //         },
        //         {role:"user",
        //             content:prompt,
        //         },
        //     ],
        //     temperature:1,
        //     store: true,
        // });
        // environment.log.info(`Prompt tokens${response.usage?.prompt_tokens}`)
        // environment.log.info(`Completetion tokens${response.usage?.completion_tokens}`)
        // const result=response.choices[0].message?.content;
        // if(!result){environment.log.error("empty response from AI");return false;}
        // environment.setOutput("Extracted Data", result);
        environment.setOutput("Extracted data",JSON.stringify(mockExtractedData));
        return true;

}catch(error:any){
    environment.log.error(error);return false;
}
}