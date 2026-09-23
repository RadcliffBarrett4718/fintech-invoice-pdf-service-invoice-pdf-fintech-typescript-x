import { z } from "zod";
import { InfraiClient } from "./infrai_client.js";

export const orderSchema = z.object({
  orderId: z.string().min(1), customerName: z.string().min(1), amountCents: z.number().int().nonnegative(), currency: z.string().length(3), paymentEvent: z.enum(["settled", "pending", "reversed"])
});
export type Order = z.infer<typeof orderSchema>;

export function canIssueInvoice(order: Order): boolean { return order.paymentEvent === "settled" && order.amountCents > 0; }

export async function issueInvoice(client: InfraiClient, raw: unknown) {
  const order = orderSchema.parse(raw);
  if (!canIssueInvoice(order)) return { status: "held", reason: "payment_not_settled" as const };
  const html = `<h1>Invoice ${order.orderId}</h1><p>Customer: ${order.customerName}</p><p>Total: ${(order.amountCents / 100).toFixed(2)} ${order.currency}</p>`;
  const generated = await client.post<{ url: string }>("/v1/pdf/generate", { html, page_size: "A4", orientation: "portrait", store: false }, `invoice-${order.orderId}`);
  const stamped = await client.post<{ url: string }>("/v1/pdf/watermark", { pdf: generated.url, text: "AUDIT COPY", opacity: 0.18, position: "bottom-right", store: false }, `watermark-${order.orderId}`);
  return { status: "issued", orderId: order.orderId, pdf: stamped.url };
}
