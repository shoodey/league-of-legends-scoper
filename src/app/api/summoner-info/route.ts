import { NextRequest, NextResponse } from "next/server";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export async function GET(req: NextRequest) {
  const request = req.clone();
  const authToken = request.headers.get("x-auth-token");
  const appPort = request.headers.get("x-app-port");

  if (!authToken) {
    return NextResponse.json(
      {
        error: "Missing x-auth-token header",
      },
      {
        status: 401,
      }
    );
  }

  if (!appPort) {
    return NextResponse.json(
      {
        error: "Missing x-app-port header",
      },
      {
        status: 400,
      }
    );
  }

  const res = await fetch(
    `https://127.0.0.1:${appPort}/lol-summoner/v1/current-summoner`,
    {
      headers: {
        Authorization: `Basic ${btoa(`riot:${authToken}`)}`,
      },
      cache: "no-cache",
    }
  );
  const data = await res.json();

  return NextResponse.json(data);
}
