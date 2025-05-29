# Pingback Server

A lightweight HTTP and DNS pingback server built with Next.js that captures, logs, and displays incoming requests in real-time. Perfect for testing webhooks, monitoring API calls, debugging integrations, and development workflows.

## Features

- **HTTP Request Capture**: Accepts both GET and POST requests
- **Real-time Monitoring**: Live dashboard with automatic refresh
- **Request Details**: Complete logging of headers, query parameters, and request bodies
- **Multiple Content Types**: Supports JSON, form data, and text payloads
- **DNS Simulation**: Demonstrates DNS request handling (simulated for demo)
- **Responsive UI**: Clean, mobile-friendly interface built with shadcn/ui
- **Request Filtering**: Filter between HTTP and DNS requests
- **In-memory Storage**: Fast, lightweight storage for development and testing

## Use Cases

### 1. Webhook Testing
Test webhook integrations from third-party services like GitHub, Stripe, or Slack.

\`\`\`bash
# Example: GitHub webhook
curl -X POST \\
  -H "Content-Type: application/json" \\
  -H "X-GitHub-Event: push" \\
  -d '{"ref":"refs/heads/main","commits":[{"message":"Test commit"}]}' \\
  https://your-domain.com/api/pingback
\`\`\`

### 2. API Development & Debugging
Monitor and debug API calls during development.

\`\`\`bash
# Test GET request with query parameters
curl "https://your-domain.com/api/pingback?user_id=123&action=login"

# Test POST request with JSON payload
curl -X POST \\
  -H "Content-Type: application/json" \\
  -d '{"user":"john_doe","email":"john@example.com"}' \\
  https://your-domain.com/api/pingback
\`\`\`

### 3. Integration Testing
Verify that your applications are sending requests correctly.

\`\`\`javascript
// Example: Testing from a React app
fetch('https://your-domain.com/api/pingback', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-token'
  },
  body: JSON.stringify({
    event: 'user_signup',
    timestamp: new Date().toISOString(),
    data: { userId: 456, plan: 'premium' }
  })
})
\`\`\`

### 4. Form Submission Testing
Test HTML form submissions and data processing.

\`\`\`html
<form action="https://your-domain.com/api/pingback" method="POST">
  <input type="text" name="name" value="John Doe" />
  <input type="email" name="email" value="john@example.com" />
  <button type="submit">Submit</button>
</form>
\`\`\`

### 5. Monitoring External Services
Monitor requests from external services and APIs.

\`\`\`bash
# Example: Monitoring a scheduled job
curl -X POST \\
  -H "Content-Type: application/json" \\
  -d '{"job":"daily_backup","status":"completed","duration":"5m32s"}' \\
  https://your-domain.com/api/pingback
\`\`\`

## API Endpoints

### POST /api/pingback
Accepts POST requests with any content type.

**Supported Content Types:**
- \`application/json\`
- \`application/x-www-form-urlencoded\`
- \`text/plain\`
- \`text/html\`
- Any other content type (treated as text)

**Example Response:**
\`\`\`json
{
  "message": "POST pingback received successfully",
  "request": {
    "id": "abc123def456",
    "method": "POST",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "url": "https://your-domain.com/api/pingback",
    "bodyReceived": true
  }
}
\`\`\`

### GET /api/pingback
Accepts GET requests with optional query parameters.

**Example Response:**
\`\`\`json
{
  "message": "GET pingback received successfully",
  "request": {
    "id": "xyz789uvw012",
    "method": "GET",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "url": "https://your-domain.com/api/pingback?param1=value1"
  }
}
\`\`\`

### GET /api/requests
Returns all captured requests.

**Example Response:**
\`\`\`json
{
  "requests": [
    {
      "id": "abc123def456",
      "method": "POST",
      "url": "https://your-domain.com/api/pingback",
      "headers": {
        "content-type": "application/json",
        "user-agent": "curl/7.68.0"
      },
      "body": {
        "user": "john_doe",
        "action": "login"
      },
      "query": {},
      "timestamp": "2024-01-15T10:30:00.000Z",
      "type": "http"
    }
  ],
  "count": 1
}
\`\`\`

## Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Local Development

1. **Clone or download the project**
   \`\`\`bash
   # If using the v0 download feature
   npx create-next-app@latest pingback-server --typescript --tailwind --eslint --app
   cd pingback-server
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

4. **Open your browser**
   Navigate to \`http://localhost:3000\` to see the dashboard.

### Deployment

#### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with zero configuration

#### Other Platforms
The app works on any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Usage Examples

### Testing Webhook Integrations

**Stripe Webhook:**
\`\`\`bash
curl -X POST \\
  -H "Content-Type: application/json" \\
  -H "Stripe-Signature: t=1234567890,v1=signature" \\
  -d '{"type":"payment_intent.succeeded","data":{"object":{"id":"pi_123"}}}' \\
  https://your-domain.com/api/pingback
\`\`\`

**Discord Webhook:**
\`\`\`bash
curl -X POST \\
  -H "Content-Type: application/json" \\
  -d '{"content":"Hello from Discord!","username":"TestBot"}' \\
  https://your-domain.com/api/pingback
\`\`\`

### API Testing

**REST API Testing:**
\`\`\`bash
# Create user
curl -X POST \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer token123" \\
  -d '{"name":"John Doe","email":"john@example.com"}' \\
  https://your-domain.com/api/pingback

# Get user
curl -H "Authorization: Bearer token123" \\
  "https://your-domain.com/api/pingback?id=123&include=profile"
\`\`\`

### Form Testing

**Contact Form:**
\`\`\`html
<form action="https://your-domain.com/api/pingback" method="POST" enctype="application/x-www-form-urlencoded">
  <input type="text" name="name" placeholder="Your Name" required />
  <input type="email" name="email" placeholder="Your Email" required />
  <textarea name="message" placeholder="Your Message" required></textarea>
  <button type="submit">Send Message</button>
</form>
\`\`\`

## Dashboard Features

### Request List
- **Real-time Updates**: Automatically refreshes every 5 seconds
- **Request Details**: View complete request information
- **Filtering**: Filter by request type (HTTP/DNS)
- **Expandable Headers**: Click to view all request headers
- **Timestamps**: Human-readable timestamps for each request

### Request Information Displayed
- HTTP method (GET, POST, etc.)
- Full URL with query parameters
- Request headers
- Request body (for POST requests)
- Query parameters
- Timestamp
- Request type (HTTP/DNS)

## Configuration

### Environment Variables
No environment variables are required for basic functionality. The app works out of the box.

### Customization
- **Request Limit**: Modify the request storage limit in \`lib/storage.ts\`
- **Polling Interval**: Change the refresh interval in the main component
- **UI Theme**: Customize the theme using Tailwind CSS classes

## Limitations

- **In-Memory Storage**: Requests are stored in memory and will be lost on server restart
- **Request Limit**: Limited to 100 stored requests to prevent memory issues
- **DNS Simulation**: DNS requests are simulated for demonstration purposes
- **No Authentication**: No built-in authentication (add as needed)

## Security Considerations

- **Production Use**: Add authentication and rate limiting for production environments
- **Data Sanitization**: Consider sanitizing logged data for sensitive information
- **CORS**: Configure CORS settings as needed for your use case
- **Rate Limiting**: Implement rate limiting to prevent abuse

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues and questions:
1. Check the GitHub issues
2. Create a new issue with detailed information
3. Include request examples and error messages

---

**Happy Testing!** 🚀

Use this pingback server to streamline your development workflow and ensure your integrations work perfectly.
