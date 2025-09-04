// netlify/functions/zenquotes-proxy.js
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

exports.handler = async (event) => {
  try {
    const response = await fetch("https://zenquotes.io/api/image");

    // Get the content type from the ZenQuotes response
    const contentType = response.headers.get("content-type") || "image/jpeg";
    const imageData = await response.text();

    return {
      statusCode: 200,
      body: imageData,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": contentType, // Use the correct content type
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch image" }),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    };
  }
};
