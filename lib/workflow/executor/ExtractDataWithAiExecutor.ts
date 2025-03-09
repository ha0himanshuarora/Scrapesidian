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

        environment.log.info(`Decrypted Gemini API Key: ${plainCredentialValue}`);

        const genAI = new GoogleGenerativeAI(plainCredentialValue);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [
                        {
                            text: `You're a webscraper helper that extracts data from HTML or text. You'll be given HTML or text as input and a prompt with the data you need to extract. The response should always be only extracted data as a JSON object, without any additional words or explanations. Analyze the input carefully and extract data precisely based on the prompt. If no data is found, return an empty JSON object. Work only with provided content and ensure output is always a valid JSON object without any surrounding text.`,
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

        try {
            const jsonObject = JSON.parse(text);

            const extractedData = {
                usernameSelector: jsonObject.usernameSelector,
                passwordSelector: jsonObject.passwordSelector,
                loginSelector: jsonObject.loginSelector,
            };

            environment.setOutput("Extracted data", JSON.stringify(extractedData));
            return true;
        } catch (error) {
            if (error instanceof Error) {
                environment.log.error("Invalid JSON response from Gemini: " + error.message);
            } else {
                environment.log.error("Invalid JSON response from Gemini: unknown error");
            }
            return false;
        }
    } catch (error) {
        if (error instanceof Error) {
            environment.log.error(error.message);
        } else {
            environment.log.error("An unknown error occurred");
        }
        return false;
    }
}