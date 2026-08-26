import type { Metadata } from "next";
import { createRouteMetadata } from "@/lib/siteMetadata";

export const metadata: Metadata = createRouteMetadata({
  title: "Privacy | BioAxis",
  description: "How BioAxis handles sourcing requests and contact information.",
  path: "/privacy"
});

export default function PrivacyPage() {
  return (
    <section className="mx-auto w-full max-w-4xl px-5 py-16 sm:px-8 lg:px-10">
      <p className="text-sm font-semibold uppercase text-bioaxis-accent">Privacy</p>
      <h1 className="mt-4 text-4xl font-bold uppercase text-bioaxis-text sm:text-6xl">Sourcing request privacy.</h1>
      <p className="mt-6 text-base leading-7 text-bioaxis-muted">
        BioAxis uses information submitted through sourcing, equivalent, sample, documentation, and contact forms to review the request and follow up about the requested path.
      </p>
      <div className="mt-10 grid gap-4">
        {[
          ["What may be submitted", "Email, organization, product context, supplier references, quantities, documents, notes, and sourcing-list details that you choose to provide."],
          ["How it is used", "Request information is used for sourcing review, communication, document coordination, sample discussion, quote preparation, and recurring-supply planning."],
          ["Browser storage", "The sourcing list and an in-progress product-list handoff may use localStorage or sessionStorage in your browser. Remove items from the list or clear site storage to remove that local copy; server-submitted data is handled separately."],
          ["Storage, analytics, and service providers", "Validated requests are stored in a private Vercel Blob queue before success is shown. BioAxis may send limited funnel events such as search, CTA, RFQ start, success, or error to PostHog when configured. Cloudflare Turnstile processes a verification token for anti-spam protection. Access keys remain server-side; customer-entered product text is not used as a public catalog."],
          ["Retention and rights", "BioAxis keeps submitted request information only as long as needed for sourcing follow-up, operational records, security, or legal obligations. You may ask what request information is held, request correction or deletion where applicable, or withdraw a future follow-up by contacting the address below."],
          ["What we avoid", "BioAxis does not sell submitted sourcing requests as a public catalog, expose server credentials, or use customer content to claim product suitability without buyer-side review."],
          ["Contact", "For a privacy question or removal request, contact crazyowenyao@gmail.com and include enough context for BioAxis to locate the request."]
        ].map(([title, body]) => (
          <article key={title} className="border border-bioaxis-line bg-bioaxis-panel p-5">
            <h2 className="text-base font-bold uppercase text-bioaxis-text">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-bioaxis-muted">{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
