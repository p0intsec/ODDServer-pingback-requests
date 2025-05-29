export interface RequestData {
  id: string
  method: string
  url: string
  headers: Record<string, string>
  query: Record<string, string>
  body?: any
  timestamp: string
  type: "http" | "dns"
}

const requests: RequestData[] = []

export function addRequest(request: RequestData) {
  requests.unshift(request)
  if (requests.length > 100) {
    requests.pop()
  }
}
