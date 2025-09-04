// netlify/functions/zenquotes-proxy.js

exports.handler = async function (event, context) {
  try {
    // Fetch the image from ZenQuotes
    const response = await fetch("https://zenquotes.io/api/image", {
      headers: {
        Accept: "image/jpeg,image/*,*/*",
      },
    });

    if (!response.ok) {
      throw new Error(
        `ZenQuotes API responded with status: ${response.status}`
      );
    }

    // Get the image as ArrayBuffer to preserve binary data
    const arrayBuffer = await response.arrayBuffer();

    // Get the content type from the original response
    const contentType = response.headers.get("content-type") || "image/jpeg";

    // Convert to base64 for proper transmission through API Gateway
    const base64Data = Buffer.from(arrayBuffer).toString("base64");

    return {
      statusCode: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
        "Access-Control-Allow-Origin": "*", // Allow CORS
        "Access-Control-Allow-Headers": "Content-Type, Accept",
      },
      body: base64Data,
      isBase64Encoded: true, // This is CRITICAL for binary data
    };
  } catch (error) {
    console.error("Proxy error:", error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        error: "Failed to fetch image",
        message: error.message,
      }),
    };
  }
};
