// Simple in-memory storage for requests
export interface RequestData {
  id: string
  method: string
  url: string
  headers: Record<string, string>
  body?: any
  timestamp: string
  type: "http" | "dns"
  query?: Record<string, string>
}

// Module-level storage (works better than global in serverless)
let requestsStore: RequestData[] = []

export function addRequest(request: RequestData) {
  requestsStore.unshift(request)

  // Limit stored requests to prevent memory issues
  if (requestsStore.length > 100) {
    requestsStore = requestsStore.slice(0, 100)
  }
}

export function getRequests(): RequestData[] {
  return [...requestsStore] // Return a copy
}

export function initializeDemoData() {
  // Only add demo DNS requests if none exist
  const dnsRequests = requestsStore.filter((r) => r.type === "dns")
  if (dnsRequests.length === 0) {
    const demoRequests: RequestData[] = [
      {
        id: "demo-dns-1",
        type: "dns",
        method: "QUERY",
        url: "example.com",
        headers: {
          "dns-type": "A",
          "dns-class": "IN",
        },
        timestamp: new Date().toISOString(),
        query: {
          name: "example.com",
          type: "A",
        },
      },
      {
        id: "demo-dns-2",
        type: "dns",
        method: "QUERY",
        url: "api.example.org",
        headers: {
          "dns-type": "AAAA",
          "dns-class": "IN",
        },
        timestamp: new Date().toISOString(),
        query: {
          name: "api.example.org",
          type: "AAAA",
        },
      },
    ]

    demoRequests.forEach((req) => requestsStore.push(req))
  }
}
