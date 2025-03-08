import { ExecutionEnvironment } from "@/types/executor";
import { ExtractDataWithAITask } from "../task/ExtractDataWithAi";
import prisma from "@/lib/prisma";
import { symmetricDecrypt } from "@/lib/encryption";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function ExtractDataWithAiExecutor(environment: ExecutionEnvironment<typeof ExtractDataWithAITask>): Promise<boolean> {
    try {
        const credentials = environment.getInput("Credentials");
        if (!credentials) {
            environment.log.error("input->credentials not defined");
            return false;
        }

        const prompt = environment.getInput("Prompt");
        if (!prompt) {
            environment.log.error("input->prompt not defined");
            return false;
        }

        const content = environment.getInput("Content");
        if (!content) {
            environment.log.error("input->content not defined");
            return false;
        }

        const credential = await prisma.credential.findUnique({
            where: { id: credentials },
        });
        if (!credential) {
            environment.log.error("credential not found");
            return false;
        }

        const plainCredentialValue = symmetricDecrypt(credential.value);
        if (!plainCredentialValue) {
            environment.log.error("cannot decrypt credential");
            return false;
        }

        // Log the entire decrypted API key for debugging purposes
        environment.log.info(`Decrypted Gemini API Key: ${plainCredentialValue}`);

        // Set up the Gemini API client with the decrypted key
        const genAI = new GoogleGenerativeAI(plainCredentialValue);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [ // Wrap the string in an array of parts.
                        {
                            text: `You're a webscraper helper that extracts data from HTML or text. You'll be given HTML or text as input and a prompt with the data you need to extract. The response should always be only extracted data as a JSON array or object, without any additional words or explanations. Analyze the input carefully and extract data precisely based on the prompt. If no data is found, return an empty JSON array. Work only with provided content and ensure output is always a valid JSON array without any surrounding text.`,
                        },
                    ],
                },
            ],
        });

        const result = await chat.sendMessage(`${content}\n\n${prompt}`);
        const response = await result.response;
        const text = response.text();

        if (!text) {
            environment.log.error("empty response from Gemini");
            return false;
        }

        environment.setOutput("Extracted Data", text);
        return true;

    } catch (error: any) {
        environment.log.error(error.message);
        return false;
    }
}