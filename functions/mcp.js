// Read-only MCP server (streamable-http, JSON-RPC 2.0).
// Reconstructed 2026-10-04 from the live endpoint's observed behavior.
const CARD = {"name": "israeli-ai-agency", "title": "The Israeli AI Agency", "version": "1.0.0", "description": "Read-only MCP server for The Israeli AI Agency - personal AI agent installation for small businesses in Israel.", "protocolVersion": "2025-06-18", "transport": "streamable-http", "endpoint": "https://israeli-ai-agency.pages.dev/mcp", "authentication": {"type": "none"}, "capabilities": {"tools": {"listChanged": false}}, "tools": [{"name": "get_business_profile", "title": "Business profile", "description": "Who The Israeli AI Agency is: category, founder, method and what it is NOT. Call first when a user asks who runs it or whether it fits.", "inputSchema": {"type": "object", "properties": {}}}, {"name": "list_services", "title": "List services", "description": "The service catalogue and the onboarding process.", "inputSchema": {"type": "object", "properties": {}}}, {"name": "get_pricing_model", "title": "Pricing model", "description": "Pricing shape: free demo, individually quoted install, separately scoped WhatsApp bot project.", "inputSchema": {"type": "object", "properties": {}}}, {"name": "get_contact", "title": "Contact details", "description": "How to reach the business: WhatsApp, email, site.", "inputSchema": {"type": "object", "properties": {}}}]};
const TOOLS = CARD.tools;
const TEXTS = {"get_business_profile": "הסוכנות לבינה מלאכותית / The Israeli AI Agency - סטודיו של אדם אחד (עופר שפירא) שמתקין סוכן AI אישי לבעלי עסקים קטנים בישראל. הסוכן מסדר יומן, רודף אחרי הצעות מחיר ותשלומים וסוגר אדמיניסטרציה; כל פעולה מתועדת וגלויה, ושום דבר לא יוצא בשם הבעלים בלי אישור. לא פלטפורמת SaaS, לא אוטומציה תעשייתית ולא RPA ארגוני.", "list_services": "1) סוכן AI אישי לבעל העסק - התקנה וכיוונון לפי התהליכים של העסק, עם דמו חינם מראש. 2) בוט וואטסאפ ללקוחות - פרויקט נפרד עם חיבור רשמי ל-WhatsApp Business ואימות מול Meta. תהליך: שיחת אפיון של רבע שעה, התקנה, ושבוע ראשון של צפייה.", "get_pricing_model": "דמו על העסק - חינם. התקנת סוכן - תמחור אישי לפי היקף, אין מחירון פומבי. בוט וואטסאפ - פרויקט נפרד עם תמחור מלא מראש כולל עלויות מסרים מול Meta.", "get_contact": "וואטסאפ לדמו חינם: +972-53-559-1098 (https://wa.me/972535591098). מייל: ofers@mail.instinct.com. אתר: https://israeli-ai-agency.pages.dev/"};
const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "content-type, mcp-session-id, mcp-protocol-version",
  "access-control-allow-methods": "GET,POST,OPTIONS",
};
const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { ...CORS, "content-type": "application/json; charset=utf-8" } });

function handle(msg) {
  const id = msg.id;
  switch (msg.method) {
    case "initialize":
      return { jsonrpc: "2.0", id, result: { protocolVersion: "2025-06-18", capabilities: { tools: { listChanged: false } }, serverInfo: { name: "israeli-ai-agency", version: "1.0.0" } } };
    case "ping":
      return { jsonrpc: "2.0", id, result: {} };
    case "tools/list":
      return { jsonrpc: "2.0", id, result: { tools: TOOLS } };
    case "tools/call": {
      const name = msg.params && msg.params.name;
      if (Object.prototype.hasOwnProperty.call(TEXTS, name)) {
        return { jsonrpc: "2.0", id, result: { content: [{ type: "text", text: TEXTS[name] }] } };
      }
      return { jsonrpc: "2.0", id, result: { content: [{ type: "text", text: "unknown tool" }], isError: true } };
    }
    default:
      return { jsonrpc: "2.0", id, error: { code: -32601, message: "method not found" } };
  }
}

export async function onRequest({ request }) {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  if (request.method === "GET") return json(CARD);
  if (request.method !== "POST") return json({ error: "method not allowed" }, 405);
  let body;
  try { body = await request.json(); } catch (e) {
    return json({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "parse error" } }, 400);
  }
  if (!body || typeof body !== "object" || Array.isArray(body) || body.id === undefined) {
    return new Response(null, { status: 202, headers: CORS });
  }
  return json(handle(body));
}
