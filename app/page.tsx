"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RefreshCcw, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Request {
  id: string
  method: string
  url: string
  headers: Record<string, string>
  body?: any
  timestamp: string
  type: "http" | "dns"
  query?: Record<string, string>
}

export default function Home() {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRequests = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/requests", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.message || "Unknown server error")
      }

      setRequests(data.requests || [])
    } catch (error) {
      console.error("Failed to fetch requests:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      setError(errorMessage)
      setRequests([]) // Set empty array as fallback
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()

    // Poll for new requests every 5 seconds
    const interval = setInterval(fetchRequests, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Pingback Server</h1>
        <Button variant="outline" onClick={fetchRequests} disabled={loading} className="flex items-center gap-2">
          <RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Error loading requests: {error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Endpoint Information</CardTitle>
            <CardDescription>Use these endpoints to send requests to the pingback server</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <h3 className="font-medium mb-2">HTTP Endpoint:</h3>
                <code className="bg-muted p-2 rounded block">{`${typeof window !== "undefined" ? window.location.origin : ""}/api/pingback`}</code>
                <p className="text-sm text-muted-foreground mt-1">Accepts GET and POST requests</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Example Usage:</h3>
                <div className="space-y-2">
                  <code className="bg-muted p-2 rounded block text-sm">
                    curl {typeof window !== "undefined" ? window.location.origin : ""}/api/pingback
                  </code>
                  <code className="bg-muted p-2 rounded block text-sm">
                    curl -X POST -H "Content-Type: application/json" -d '{"{"}"test":"data"{"}"}'{" "}
                    {typeof window !== "undefined" ? window.location.origin : ""}/api/pingback
                  </code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="all">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all">All Requests</TabsTrigger>
              <TabsTrigger value="http">HTTP</TabsTrigger>
              <TabsTrigger value="dns">DNS</TabsTrigger>
            </TabsList>
            <div className="text-sm text-muted-foreground">Total: {requests.length} requests</div>
          </div>

          <Card>
            <TabsContent value="all" className="m-0">
              <RequestList requests={requests} />
            </TabsContent>
            <TabsContent value="http" className="m-0">
              <RequestList requests={requests.filter((r) => r.type === "http")} />
            </TabsContent>
            <TabsContent value="dns" className="m-0">
              <RequestList requests={requests.filter((r) => r.type === "dns")} />
            </TabsContent>
          </Card>
        </Tabs>
      </div>
    </main>
  )
}

function RequestList({ requests }: { requests: Request[] }) {
  if (requests.length === 0) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        No requests received yet. Send a request to the pingback endpoint to see it appear here.
      </div>
    )
  }

  return (
    <ScrollArea className="h-[500px]">
      <div className="divide-y">
        {requests.map((request) => (
          <div key={request.id} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge variant={request.type === "http" ? "default" : "secondary"}>{request.type.toUpperCase()}</Badge>
                {request.type === "http" && (
                  <Badge variant={request.method === "GET" ? "outline" : "destructive"}>{request.method}</Badge>
                )}
              </div>
              <span className="text-xs text-muted-foreground">{new Date(request.timestamp).toLocaleString()}</span>
            </div>

            <div className="grid gap-2">
              <div>
                <span className="text-sm font-medium">URL: </span>
                <span className="text-sm break-all">{request.url}</span>
              </div>

              {request.query && Object.keys(request.query).length > 0 && (
                <div>
                  <span className="text-sm font-medium">Query Parameters: </span>
                  <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-x-auto">
                    {JSON.stringify(request.query, null, 2)}
                  </pre>
                </div>
              )}

              {request.body && (
                <div>
                  <span className="text-sm font-medium">Body: </span>
                  <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-x-auto">
                    {typeof request.body === "string" ? request.body : JSON.stringify(request.body, null, 2)}
                  </pre>
                </div>
              )}

              <details className="text-sm">
                <summary className="cursor-pointer font-medium">
                  Headers ({Object.keys(request.headers).length})
                </summary>
                <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-x-auto">
                  {JSON.stringify(request.headers, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
