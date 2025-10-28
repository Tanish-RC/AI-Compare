import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

export async function analyzeWithClaude(fileData, fileName, prompt) {
  try {
    // Convert the base64 data (already base64 from frontend PDF upload)556456
    const pdfBase64 = fileData;

    // Create the Claude API request
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250929", // or 'claude-sonnet-4-5' if available to you
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "document",
              source: {
                type: "base64",
                media_type: "application/pdf",
                data: pdfBase64,
              },
            },
            {
              type: "text",
              text: prompt || "Summarize this medical document.",
            },
          ],
        },
      ],
    });

    // Extract and return the model’s text output
    const outputText = response.content?.[0]?.text || "No response content.";
    console.log(response);
    return outputText;
  } catch (err) {
    console.error("🚨 Claude Error:", err);
    throw new Error(err.message || "Claude API error");
  }
}
