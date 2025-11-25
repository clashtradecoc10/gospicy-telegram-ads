import { NextResponse } from "next/server";

export async function GET() {
  try {
    // API Configuration
    const API_URL = "https://ads.telegram.org/api";
    const API_HASH = "b1f22a97609d892a3d";

    // Request Parameters
    const params = {
      owner_id:
        "iwfscPgWGH3dDCLkcjsEAp4gj1zRgMkBUZNjjs-awcc3L4UjlitRN4MODXK-K03M",
      //offset_id: "LoSbf3tN5Kazwy8j5fK3RyBS6hJkFY9u5iFRJis7R34",
      method: "getAdsList",
    };

    // Authentication Cookie
    const AUTH_COOKIE =
      "stel_ssid=a78a91045b622c92de_13089839686219380278; " +
      "stel_dt=-60; " +
      "stel_token=8377ce353ac3c6a7e4b4fc406d03103d8377ce238377cdcec4ca516353ff07bbd4310; " +
      "stel_ln=de; " +
      "stel_adowner=iwfscPgWGH3dDCLkcjsEAp4gj1zRgMkBUZNjjs-awcc3L4UjlitRN4MODXK-K03M";

    // Convert params to URL-encoded string
    const body = new URLSearchParams(params).toString();

    console.log(`📡 Requesting: ${API_URL}?hash=${API_HASH}`);
    console.log(`📦 Body: ${body}`);

    // Make the API request
    const response = await fetch(`${API_URL}?hash=${API_HASH}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        Cookie: AUTH_COOKIE,
      },
      body,
    });

    console.log(`📊 Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ API Error: ${errorText}`);
      return NextResponse.json(
        {
          success: false,
          error: `API returned ${response.status}: ${response.statusText}`,
          details: errorText,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Log the response nicely
    console.log("✅ Response received:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(JSON.stringify(data, null, 2));
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Filter ads to only include those newer than the specified date
    const cutoffDate = 1763935526;
    const filteredItems =
      data?.items?.filter((item: any) => item.date > cutoffDate) || [];

    // Extract useful information
    const adsCount = filteredItems.length;
    const hasMore = data?.has_more || false;

    return NextResponse.json({
      success: true,
      message: `Retrieved ${adsCount} ads (filtered by date > ${cutoffDate})`,
      hasMore,
      data: {
        ...data,
        items: filteredItems,
      },
    });
  } catch (error) {
    console.error("❌ Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
