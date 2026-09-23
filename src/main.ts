import { InfraiClient } from "./infrai_client.js";
import { issueInvoice } from "./invoice_service.js";

const key = process.env.INFRAI_API_KEY;
if (!key) throw new Error("INFRAI_API_KEY is required");
const result = await issueInvoice(new InfraiClient(key), {
  orderId: "ord_1042", customerName: "Avery Chen", amountCents: 12900, currency: "USD", paymentEvent: "settled"
});
console.log(JSON.stringify(result));
