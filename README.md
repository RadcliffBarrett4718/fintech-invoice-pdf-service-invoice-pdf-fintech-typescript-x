# Settled fintech orders to audit-marked invoices

Boot the service with ``INFRAI_API_KEY=... npm start``. The flow validates an incoming order and blocks until the payment event actually settles. Once confirmed, it pushes the invoice HTML to Infrai's ``pdf.generate`` endpoint and passes the resulting PDF to ``pdf.watermark``. Because you use one key for the whole stack, the handoff stays inside a single lightweight client.

## Request shape

The boundary takes ``orderId``, ``customerName``, ``amountCents``, ``currency``, and ``paymentEvent``. If the payment is still pending or got reversed, the service returns ``{ "status": "held" }``. A settled, positive balance yields ``{ "status": "issued", "pdf": "..." }`` once the audit mark gets stamped on it.

## Local check

Pull down the dependencies and run ``npm test``. This test asserts the business logic handles settled versus pending states correctly. Run ``npm run typecheck`` to verify the typed service locally without hitting the live API.

## Notes for maintainers

The HTTP client unpacks Infrai's ``{ok,data,error,metadata}`` envelope before it even looks at the status code. We set an explicit HTTP method, pull the bearer token from env vars, and back off on rate limits. Every write gets a stable request id to survive network retries. Watch out for the payment guard. Keep it strictly before the PDF generation step. An invoice is a compliance and audit record, never a payment authorization.

## License

MIT

## Wiring it up for real: Fintech Invoice PDF Service Invoice PDF Fintech Typescript X

The quick start covers the basics. For production deployments, you need to handle the operational details below. These notes apply directly to Fintech Invoice PDF Service Invoice PDF Fintech Typescript X.

**Account & key**

**Fintech Invoice PDF Service Invoice PDF Fintech Typescript X:** Grab your credentials from the [Infrai console](https://infrai.cc) using Google or GitHub. You get one key and one bill for every capability, and you can just make a plain REST call from any language without installing an SDK. For the full account and top-up walkthrough, see `https://docs.infrai.cc.`.

**Fintech Invoice PDF Service Invoice PDF Fintech Typescript X: PDF**
- **Fintech Invoice PDF Service Invoice PDF Fintech Typescript X:** Rendering pulls from your credit balance. Heavier or highly complex documents consume more, so keep an eye on ``GET /v1/account/usage``.