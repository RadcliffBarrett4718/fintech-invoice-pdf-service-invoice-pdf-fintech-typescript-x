import assert from "node:assert/strict";
import { canIssueInvoice, issueInvoice, orderSchema } from "./invoice_service.js";
import { InfraiClient } from "./infrai_client.js";

const settled = orderSchema.parse({ orderId: "o1", customerName: "Nia", amountCents: 5000, currency: "USD", paymentEvent: "settled" });
const pending = { ...settled, paymentEvent: "pending" as const };
assert.equal(canIssueInvoice(settled), true);
assert.equal(canIssueInvoice(pending), false);
const requests: { path: string; body: Record<string, unknown> }[] = [];
const client = new InfraiClient("test-key", async (input, init) => {
  requests.push({ path: new URL(String(input)).pathname, body: JSON.parse(String(init?.body)) });
  const url = requests.length === 1 ? "data:application/pdf;base64,generated" : "data:application/pdf;base64,stamped";
  return new Response(JSON.stringify({ ok: true, data: { url } }), { status: 200 });
});
const issued = await issueInvoice(client, settled);
assert.equal(requests[1].path, "/v1/pdf/watermark");
assert.equal(requests[1].body.pdf, "data:application/pdf;base64,generated");
assert.equal(requests[1].body.store, false);
assert.equal(issued.pdf, "data:application/pdf;base64,stamped");
console.log("invoice decision test passed");
