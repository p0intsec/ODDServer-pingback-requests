import { type NextRequest, NextResponse } from "next/server"
import { addRequest, initializeDemoData, type RequestData } from "@/lib/storage"

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// GET handler for pingback
export async function GET(request: NextRequest) {
  try {
    const id = generateId()
    const url = new URL(request.url)
    const timestamp = new Date().toISOString()

    // Extract headers
    const headers: Record<string, string> = {}
    request.headers.forEach((value, key) => {
      headers[key] = value
    })

    // Extract query parameters
    const query: Record<string, string> = {}
    url.searchParams.forEach((value, key) => {
      query[key] = value
    })

    // Create request data
    const requestData: RequestData = {
      id,
      method: "GET",
      url: url.toString(),
      headers,
      query,
      timestamp,
      type: "http",
    }

    // Store the request
    addRequest(requestData)

    // Initialize demo data
    initializeDemoData()

    return NextResponse.json({
      message: "GET pingback received successfully",
      request: {
        id: requestData.id,
        method: requestData.method,
        timestamp: requestData.timestamp,
        url: requestData.url,
      },
    })
  } catch (error) {
    console.error("Error in GET /api/pingback:", error)

    return NextResponse.json(
      {
        error: "Failed to process GET request",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// POST handler for pingback
export async function POST(request: NextRequest) {
  try {
    const id = generateId()
    const url = new URL(request.url)
    const timestamp = new Date().toISOString()

    // Extract headers
    const headers: Record<string, string> = {}
    request.headers.forEach((value, key) => {
      headers[key] = value
    })

    // Extract query parameters
    const query: Record<string, string> = {}
    url.searchParams.forEach((value, key) => {
      query[key] = value
    })

    // Parse body safely
    let body: any = null
    try {
      const contentType = request.headers.get("content-type") || ""

      if (contentType.includes("application/json")) {
        body = await request.json()
      } else if (contentType.includes("application/x-www-form-urlencoded")) {
        const formData = await request.formData()
        body = Object.fromEntries(formData)
      } else if (contentType.includes("text/")) {
        body = await request.text()
      } else {
        // For other content types, try to read as text
        body = await request.text()
      }
    } catch (bodyError) {
      console.warn("Could not parse request body:", bodyError)
      body = "Could not parse body"
    }

    // Create request data
    const requestData: RequestData = {
      id,
      method: "POST",
      url: url.toString(),
      headers,
      query,
      body,
      timestamp,
      type: "http",
    }

    // Store the request
    addRequest(requestData)

    // Initialize demo data
    initializeDemoData()

    return NextResponse.json({
      message: "POST pingback received successfully",
      request: {
        id: requestData.id,
        method: requestData.method,
        timestamp: requestData.timestamp,
        url: requestData.url,
        bodyReceived: body !== null,
      },
    })
  } catch (error) {
    console.error("Error in POST /api/pingback:", error)

    return NextResponse.json(
      {
        error: "Failed to process POST request",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
