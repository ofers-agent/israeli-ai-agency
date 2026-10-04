# israeli-ai-agency

Source of truth for https://israeli-ai-agency.pages.dev (Cloudflare Pages, direct upload, free tier).

- `index.html` - landing page (includes the Cloudflare Web Analytics beacon, added 2026-10-04)
- `for-ai/index.html`, `llms.txt`, `llms-full.txt`, `openapi.json`, `api/v1/*.json`, `.well-known/api-catalog` - AI-discovery layer
- `functions/mcp.js` - read-only MCP endpoint (reconstructed 2026-10-04 from the live endpoint; verified identical on 13 requests)
- `_headers` - CORS and api-catalog content type

Deploy: `npx wrangler pages deploy . --project-name israeli-ai-agency --branch main`
