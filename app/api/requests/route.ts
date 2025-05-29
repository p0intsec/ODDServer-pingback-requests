import { NextResponse } from "next/server"
import { getRequests, initializeDemoData } from "@/lib/storage"

export async function GET() {
  try {
    // Initialize demo data if needed
    initializeDemoData()

    const requests = getRequests()

    return NextResponse.json({
      requests,
      count: requests.length,
    })
  } catch (error) {
    console.error("Error in /api/requests:", error)

    return NextResponse.json(
      {
        error: "Failed to fetch requests",
        message: error instanceof Error ? error.message : "Unknown error",
        requests: [], // Fallback empty array
      },
      { status: 500 },
    )
  }
}
