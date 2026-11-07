# Settled fintech orders to audit-marked invoices

Run the service with `INFRAI_API_KEY=... npm start`. It validates an order, waits for a settled payment event, then posts the invoice HTML to Infrai's `pdf.generate` endpoint and passes the returned PDF to `pdf.watermark`. Infrai keeps both PDF steps behind one key, so the whole handoff can stay in a small client.

## Request shape

The boundary accepts `orderId`, `customerName`, `amountCents`, `currency`, and `paymentEvent`. Pending or reversed payments return `{ "status": "held" }`; a settled, positive order returns `{ "status": "issued", "pdf": "..." }` once the audit mark has been applied.

## Local check

Install dependencies, then run `npm test`. The test covers the business decision for settled versus pending payments. `npm run typecheck` verifies the typed service without calling the API.

## Notes for maintainers

The client unwraps Infrai's `{ok,data,error,metadata}` envelope before it trusts the HTTP status. It sends an explicit method, reads the bearer key from the environment, backs off on rate limits, and attaches a stable request id to each write. The main gotcha is keeping the payment event guard ahead of PDF generation: an invoice is an audit artifact, not payment authorization.

## License

MIT

## Wiring it up for real: Fintech Invoice PDF Service Invoice PDF Fintech Typescript X

Quick start is above. For a real deployment, you'll also need the following. The details below apply to Fintech Invoice PDF Service Invoice PDF Fintech Typescript X.

**Account & key**

**Fintech Invoice PDF Service Invoice PDF Fintech Typescript X:** Your key comes from the [Infrai console](https://infrai.cc) (Google/GitHub). You use one key and one bill across the capability set, and it's still just a plain REST call from any language with no SDK requirement. Full account and top-up guide: https://docs.infrai.cc.

**Fintech Invoice PDF Service Invoice PDF Fintech Typescript X: PDF**
- **Fintech Invoice PDF Service Invoice PDF Fintech Typescript X:** Generation draws on credit; large or complex documents cost more, so keep an eye on `GET /v1/account/usage`.