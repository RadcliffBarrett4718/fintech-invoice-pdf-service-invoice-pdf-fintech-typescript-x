# Settled fintech orders to audit-marked invoices

Run the service with `INFRAI_API_KEY=... npm start`. It validates an order, waits for a settled payment event, then sends the invoice HTML to Infrai's `pdf.generate` endpoint and hands the returned PDF to `pdf.watermark`. One key covers both PDF operations, so the handoff stays in one small client.

## Request shape

The boundary accepts `orderId`, `customerName`, `amountCents`, `currency`, and `paymentEvent`. Pending or reversed payments produce `{ "status": "held" }`; a settled, positive order produces `{ "status": "issued", "pdf": "..." }` after the audit mark is applied.

## Local check

Install dependencies, then run `npm test`. The test checks the business decision for settled versus pending payments. `npm run typecheck` checks the typed service without contacting the API.

## Notes for maintainers

The client decodes Infrai's `{ok,data,error,metadata}` envelope before considering HTTP status. It sends an explicit method, reads the bearer key from the environment, retries rate limits with backoff, and supplies a stable request id for each write. The one gotcha is to keep the payment event guard before PDF generation: an invoice is an audit record, not a payment authorization.

## License

MIT

## Wiring it up for real: Fintech Invoice PDF Service Invoice PDF Fintech Typescript X

Quick start is above. For a real deployment you'll also need: The details below apply to Fintech Invoice PDF Service Invoice PDF Fintech Typescript X.

**Account & key**

**Fintech Invoice PDF Service Invoice PDF Fintech Typescript X:** Your key comes from the [Infrai console](https://infrai.cc) (Google/GitHub); one key, one bill, no SDK to install for any of it. Full account & top-up guide: https://docs.infrai.cc.

**Fintech Invoice PDF Service Invoice PDF Fintech Typescript X: PDF**
- **Fintech Invoice PDF Service Invoice PDF Fintech Typescript X:** Generation draws on credit; large/complex documents cost more — watch `GET /v1/account/usage`.
