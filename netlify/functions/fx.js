export async function handler() {
  try {
    const res = await fetch(
      "https://api.frankfurter.app/latest?base=EUR&symbols=GBP",
    );

    const data = await res.json();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "FX fetch failed" }),
    };
  }
}
