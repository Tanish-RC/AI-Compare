// // import { GoogleGenAI } from "@google/generative-ai";

// // const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);

// // export async function analyzeWithGemini(fileData, fileName, prompt) {
// //   const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

// //   const pdfBuffer = Buffer.from(fileData, "base64");

// //   const result = await model.generateContent([
// //     prompt,
// //     {
// //       inlineData: {
// //         mimeType: "application/pdf",
// //         data: pdfBuffer.toString("base64"),
// //       },
// //     },
// //   ]);

// //   return result.response.text() || "No response content.";65456
// // }

// import { GoogleGenAI } from "@google/genai";
// import dotenv from "dotenv";

// dotenv.config();

// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY,
// });

// // export async function analyzeWithGemini(fileData, fileName, prompt) {
// //   try {
// //     // Convert base64 string to binary (in case it’s already base64 from frontend)
// //     const pdfBuffer = Buffer.from(fileData, "base64");

// //     // Build the request contents — text prompt + inline PDF
// //     const contents = [
// //       { text: prompt },
// //       {
// //         inlineData: {
// //           mimeType: "application/pdf",
// //           data: pdfBuffer.toString("base64"),
// //         },
// //       },
// //     ];

// //     // Generate the response using the Gemini 2.5 model
// //     const response = await ai.models.generateContent({
// //       model: "gemini-2.5-pro", // Fast and capable multimodal model
// //       contents,
// //     });

// //     // Extract model text output safely
// //     const outputText =
// //       response.text || response?.output_text || "No response content.";
// //     // console.log(response);
// //     return outputText;
// //   } catch (err) {
// //     console.error("🚨 Gemini Error:", err);
// //     throw new Error(err.message || "Gemini API error");
// //   }
// // }


// export async function analyzeWithGemini(pdfBase64, fileName, prompt) {
//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-pro",
//     contents: [
//       { text: prompt },
//       {
//         inlineData: {
//           mimeType: "application/pdf",
//           data: pdfBase64,
//         },
//       },
//     ],
//   });

//   return response.text || "";
// }


import { GoogleGenAI } from "@google/genai";

const geminiClient = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function analyzeWithGemini(fileData, fileName, prompt) {
  try {
    const pdfBuffer = Buffer.from(fileData, "base64");

    const response = await geminiClient.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { text: prompt },
        {
          inlineData: {
            mimeType: "application/pdf",
            data: pdfBuffer.toString("base64"),
          },
        },
      ],
    });

    return response.text || "No response content.";
  } catch (err) {
    console.error("🚨 Gemini Error:", err);
    throw new Error(err.message || "Gemini API error");
  }
}
