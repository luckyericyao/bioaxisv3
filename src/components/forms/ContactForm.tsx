import { SourcingIntakeForm } from "@/components/forms/SourcingIntakeForm";

export function ContactForm() {
  return (
    <SourcingIntakeForm
      requestType="contact"
      title="Send the question. BioAxis will route the next step."
      productFieldLabel="Message or sourcing question"
      submitLabel="Send sourcing question"
      compact
    />
  );
}
