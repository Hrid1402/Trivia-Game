import { GoogleGenerativeAI } from "@google/generative-ai"


const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);  

const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" });



export async function responseAI(amount, topic, difficulty, language){
    const prompt = `Generate ${amount} trivia questions in ${language} about ${topic} with a difficulty of ${difficulty}. Return ONLY the JSON in this format:  
    json
    {
    "response_code": 0,
    "results": [
        {
            "question": "<A trivia question>",
            "correct_answer": "<The correct answer>",
            "incorrect_answers": [
                "<Incorrect answer 1>",
                "<Incorrect answer 2>",
                "<Incorrect answer 3>"
            ]
        }
    ]
    }
    Rules:  
    - The correct answer must always be true. NEVER generate false correct answers.  
    - For incorrect answers, ensure they are plausible and closely related to the correct answer. Avoid making the correct answer stand out due to being more detailed or specific. Each option should be equally informative, with only slight errors or misconceptions that could easily confuse the player. Adjust the difficulty by making the incorrect answers either subtly closer or farther from the truth, depending on the level of difficulty.  
    - If the request cannot be fulfilled, return ONLY this error format:
    json
    {
        "response_code": 1,
        "error": "<Error description>"
    }
    Return ONLY the JSON object as plain text, with NO formatting, NO code blocks, and NO extra text.
    `
    const result = await model.generateContent([prompt]);
    const response = result.response.text();
    try{
        const json = JSON.parse(response);
        if(json.response_code == 0){
            return json;
        }else{
            alert(error);
        }
        
    }catch{
        alert("Error generating, try again")
    }
    
}   
