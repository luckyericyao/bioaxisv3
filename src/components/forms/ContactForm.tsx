import { SourcingIntakeForm } from "@/components/forms/SourcingIntakeForm";

export function ContactForm() {
  return (
    <SourcingIntakeForm
      requestType="contact"
      title="Send a sourcing question. BioAxis will route the next step."
      productFieldLabel="Message / sourcing question"
      submitLabel="Send sourcing question"
      compact
    />
  );
}
