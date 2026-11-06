import Image from "next/image";
import type { ReactNode } from "react";
import { sourcingSpecifications } from "@/lib/sourcingSpecifications";

type Props = {
  title: string;
  description: string;
  specifications: readonly string[] | Record<string, string | string[]>;
  children: ReactNode;
};

export function SourcingConfigurationOverview({ title, description, specifications, children }: Props) {
  const fields = sourcingSpecifications(specifications).slice(0, 6);
  const filteredTips = /\bfiltered\b.*\btips\b/i.test(title) && !/\bnon[- ]filtered\b/i.test(title);
  return <section className={`page-container configuration-overview ${filteredTips ? "has-visual" : ""}`}>
    <div className="configuration-intro">
      <p className="helper-text text-bioaxis-muted">Sourcing configuration</p>
      <h1 className="configuration-title mt-3">{title}</h1>
      <p className="mt-2 max-w-2xl text-bioaxis-muted">{filteredTips ? "A target for quote or sample review." : /general configuration/i.test(title) ? "Define the specifications for your sourcing request." : description}</p>
    </div>
    {filteredTips ? <figure className="configuration-visual">
      <div className="configuration-image relative bg-bioaxis-panelSoft"><Image src="/images/systematic/filtered-tips-illustration.webp" alt="Illustration of filtered pipette tips in a rack; not a confirmed supplier product." fill priority sizes="(min-width:1024px) 550px, 350px" className="object-contain" /></div>
      <figcaption className="mt-2 text-sm leading-[21px] text-bioaxis-muted">Illustration; supplier product to confirm.</figcaption>
    </figure> : null}
    <div className="configuration-fields" data-product-decision-summary="true">
      <table className="w-full border-collapse text-left" aria-label="Sourcing target and confirmation fields" data-product-key-specs="true">
        <tbody>{fields.map((field, index) => <tr key={field.key} data-product-specification-group={field.status === "target" ? "target" : "options"} className={index > 3 ? "hidden border-b border-bioaxis-line sm:table-row" : "border-b border-bioaxis-line"}>
          <th scope="row" className="w-[36%] py-2 pr-2 align-top text-base font-medium text-bioaxis-text">{field.key === "nominal volume" ? <><span className="sm:hidden">Volume</span><span className="hidden sm:inline">Nominal volume</span></> : field.label}</th>
          <td className="py-2 align-top text-bioaxis-steel">{field.status === "target" ? <>{field.value}<span className="ml-2 text-sm text-bioaxis-muted">Target</span></> : <>To confirm{field.value !== "To confirm" ? <span className="hidden text-sm text-bioaxis-muted md:inline"> · {field.value}</span> : null}</>}</td>
        </tr>)}</tbody>
      </table>
      <p role="note" className="helper-text my-3 hidden text-bioaxis-muted sm:block">Supplier details confirmed per request.</p>
      {children}
    </div>
  </section>;
}
