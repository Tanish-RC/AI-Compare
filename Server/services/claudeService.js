// import Anthropic from "@anthropic-ai/sdk";

// const anthropic = new Anthropic({
//   apiKey: process.env.CLAUDE_API_KEY,
// });

// // export async function analyzeWithClaude(fileData, fileName, prompt) {
// //   try {
// //     // Convert the base64 data (already base64 from frontend PDF upload)556456
// //     const pdfBase64 = fileData;

// //     // Create the Claude API request
// //     const response = await anthropic.messages.create({
// //       model: "claude-sonnet-4-5-20250929", // or 'claude-sonnet-4-5' if available to you
// //       max_tokens: 4000,
// //       messages: [
// //         {
// //           role: "user",
// //           content: [
// //             {
// //               type: "document",
// //               source: {
// //                 type: "base64",
// //                 media_type: "application/pdf",
// //                 data: pdfBase64,
// //               },
// //             },
// //             {
// //               type: "text",
// //               text: prompt || "Summarize this medical document.",
// //             },
// //           ],
// //         },
// //       ],
// //     });
    
// //     // Extract and return the model’s text output
// //     const outputText = response.content?.[0]?.text || "No response content.";
// //     // console.log(response);
// //     return outputText;
// //   } catch (err) {
// //     console.error("🚨 Claude Error:", err);
// //     throw new Error(err.message || "Claude API error");
// //   }
// // }


// export async function analyzeWithClaude(pdfBase64, fileName, prompt) {
//   const response = await anthropic.messages.create({
//     model: "claude-sonnet-4-5-20250929",
//     max_tokens: 4000,
//     messages: [
//       {
//         role: "user",
//         content: [
//           {
//             type: "document",
//             source: {
//               type: "base64",
//               media_type: "application/pdf",
//               data: pdfBase64,
//             },
//           },
//           { type: "text", text: prompt },
//         ],
//       },
//     ],
//   });

//   return response.content?.[0]?.text || "";
// }


import Anthropic from "@anthropic-ai/sdk";

const anthropicClient = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

export async function analyzeWithClaude(fileData, fileName, prompt) {
  try {
    // const response = await anthropicClient.messages.create({
    //   model: "claude-sonnet-4-5-20250929",
    //   max_tokens: 45000,
    //   stream: true,
    //   messages: [
    //     {
    //       role: "user",
    //       content: [
    //         {
    //           type: "document",
    //           source: {
    //             type: "base64",
    //             media_type: "application/pdf",
    //             data: fileData,
    //           },
    //         },
    //         {
    //           type: "text",
    //           text: prompt,
    //         },
    //       ],
    //     },
    //   ],
    // });
    // console.log(response)
    // return response.content?.[0]?.text || "No response from Claude.";
    const stream = anthropicClient.messages
  .stream({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 45000,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "document",
            source: {
              type: "base64",
              media_type: "application/pdf",
              data: fileData,
            },
          },
          {
            type: "text",
            text: prompt,
          },
        ],
      },
    ],
  })
  .on('text', (text) => {
    // This fires for each text chunk
    console.log(text);
    // or send to client: res.write(text);
  })
  .on('contentBlock', (contentBlock) => {
    // Fires when a content block starts
    console.log('Content block:', contentBlock);
  })
  .on('message', (message) => {
    // Fires when the message is complete
    console.log('Message complete:', message);
  })
  .on('error', (error) => {
    // Handle errors
    console.error('Stream error:', error);
  });

// Wait for the final complete message
const finalMessage = await stream.finalMessage();
console.log('Final message:', finalMessage);
return finalMessage.content?.[0]?.text || "No response from Claude.";
  } catch (err) {
    console.error("🚨 Claude Error:", err);
    throw new Error(err.message || "Claude API error");
  }
}
