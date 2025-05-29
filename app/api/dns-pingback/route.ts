import { type NextRequest, NextResponse } from "next/server"
import { addRequest, type RequestData } from "@/lib/storage"

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Handle DNS-style pingback requests
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

    // Extract query parameters for DNS simulation
    const query: Record<string, string> = {}
    url.searchParams.forEach((value, key) => {
      query[key] = value
    })

    // Simulate DNS query parameters
    const dnsType = query.type || "A"
    const domain = query.domain || query.q || "unknown"
    const clientIP = headers["x-forwarded-for"] || headers["x-real-ip"] || "unknown"

    // Create DNS-style request data
    const requestData: RequestData = {
      id,
      method: "DNS_QUERY",
      url: `${domain} (${dnsType})`,
      headers: {
        ...headers,
        "dns-query-type": dnsType,
        "dns-domain": domain,
        "client-ip": clientIP,
        "dns-timestamp": timestamp,
      },
      query: {
        ...query,
        resolved_domain: domain,
        query_type: dnsType,
        client_ip: clientIP,
      },
      timestamp,
      type: "dns",
    }

    // Store the request
    addRequest(requestData)

    return NextResponse.json({
      message: "DNS pingback received successfully",
      dns_query: {
        id: requestData.id,
        domain: domain,
        type: dnsType,
        timestamp: requestData.timestamp,
        client_ip: clientIP,
      },
      // Simulate DNS response
      dns_response: {
        status: "NOERROR",
        answer: dnsType === "A" ? ["192.168.1.1"] : ["2001:db8::1"],
        ttl: 300,
      },
    })
  } catch (error) {
    console.error("Error in DNS pingback:", error)

    return NextResponse.json(
      {
        error: "Failed to process DNS pingback",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  return GET(request) // Handle POST the same way for flexibility
}
