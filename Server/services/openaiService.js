// import OpenAI from "openai";
// import dotenv from "dotenv";

// dotenv.config();
// console.log(process.env.OPENAI_API_KEY);
// const client = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// // export async function analyzeWithOpenAI(fileData, fileName, prompt) {
// //   console.log(prompt)
// //   const response = await client.responses.create({
// //     model: "gpt-5",
// //     input: [
// //       {
// //         role: "user",
// //         content: [
// //           {
// //             type: "input_file",
// //             filename: fileName,
// //             file_data: `data:application/pdf;base64,${fileData}`,
// //           },
// //           { type: "input_text", text: prompt },
// //         ],
// //       },
// //     ],
// //   });
// //   // console.log(response);
// //   return (
// //     response.output_text ||
// //     response.output?.[0]?.content?.[0]?.text ||
// //     "No response content."
// //   );
// // }


// export async function analyzeWithOpenAI(pdfBase64, fileName, prompt) {
//   const response = await client.responses.create({
//     model: "gpt-5",
//     input: [
//       {
//         role: "user",
//         content: [
//           {
//             type: "input_file",
//             filename: fileName,
//             file_data: `data:application/pdf;base64,${pdfBase64}`,
//           },
//           { type: "input_text", text: prompt },
//         ],
//       },
//     ],
//   });

//   return (
//     response.output_text ||
//     response.output?.[0]?.content?.[0]?.text ||
//     ""
//   );
// }


import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeWithOpenAI(fileData, fileName, prompt) {
  try {
    const response = await openaiClient.responses.create({
      model: "gpt-5-mini",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_file",
              filename: fileName,
              file_data: `data:application/pdf;base64,${fileData}`,
            },
            { type: "input_text", text: prompt },
          ],
        },
      ],
    });
    
    return (
      response.output_text ||
      response.output?.[0]?.content?.[0]?.text ||
      "No response content."
    );
  } catch (err) {
    console.error("🚨 OpenAI Error:", err);
    throw new Error(err.message || "OpenAI API error");
  }
}
