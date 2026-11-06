export type SourcingSpecification = {
  key: string;
  label: string;
  value: string;
  status: "target" | "to-confirm";
};

const fieldLabels: Record<string, string> = {
  "nominal volume": "Nominal volume", volume: "Volume", format: "Format", membrane: "Membrane", "pore size": "Pore size",
  "filter barrier": "Barrier", sterility: "Sterility", packaging: "Packaging", surface: "Surface", material: "Material",
  profile: "Profile", diameter: "Diameter", mwco: "MWCO", barcode: "Barcode", "serum status": "Serum status", cleanliness: "Cleanliness"
};
const priority = ["nominal volume", "volume", "format", "membrane", "pore size", "filter barrier", "sterility", "packaging", "surface", "material"];

function requirementLabel(label: string) {
  if (label.length <= 28) return label;
  if (/material|resin|polymer/i.test(label)) return "Material";
  if (/capacity|volume|well count|tube format/i.test(label)) return "Format / capacity";
  if (/steril|sterile/i.test(label)) return "Sterility";
  if (/packag|rack|bulk/i.test(label)) return "Packaging";
  if (/centrifuge|footprint|storage fit|instrument|platform|compatib/i.test(label)) return "Workflow fit";
  if (/surface|retention|binding/i.test(label)) return "Surface";
  if (/document|certificate|coa|sds/i.test(label)) return "Documentation";
  return "Requirement to review";
}

export function sourcingSpecifications(input: readonly string[] | Record<string, string | string[]>): SourcingSpecification[] {
  const multipleOptions = new Set(Array.isArray(input) ? [] : Object.entries(input)
    .filter(([, value]) => Array.isArray(value) && new Set(value.map((item) => item.trim()).filter(Boolean)).size > 1)
    .map(([key]) => key.trim().toLowerCase().replace(/\s+/g, " ")));
  const entries: [string, string][] = Array.isArray(input)
    ? input.map((item) => {
      const separator = item.indexOf(":");
      return separator < 0 ? [item.trim(), ""] : [item.slice(0, separator).trim(), item.slice(separator + 1).trim()];
    })
    : Object.entries(input).map(([key, value]) => [key.trim(), Array.isArray(value) ? value.map((item) => item.trim()).filter(Boolean).join(", ") : value.trim()]);

  return entries.filter(([label]) => label).map(([label, rawValue]) => {
    const key = label.toLowerCase().replace(/\s+/g, " ");
    const barrierTarget = key === "filter barrier" && /^filtered or aerosol barrier$/i.test(rawValue);
    const value = barrierTarget ? "Filtered" : rawValue;
    const specific = Boolean(value) && (barrierTarget || (
      Object.hasOwn(fieldLabels, key)
      && !multipleOptions.has(key)
      && !/\b(?:or|options?|review(?:ed)?|required|request(?:ed)?|relevant|dependent|compatibility|confirm(?:ed|ation)?|where|available|select(?:ed)?|varies)\b|[|/]/i.test(value)
      && !/\b(?:tbd|tbc|unknown|unspecified|pending|supplier|documentation|to be|not (?:specified|provided|confirmed|known|applicable))\b|^[-–—?]+$|^n\.?a\.?$/i.test(value)
      && !/\b(?:review|option|fit|compatibility)\b/i.test(key)
    ));
    return { key, label: fieldLabels[key] ?? requirementLabel(label), value: value || "To confirm", status: specific ? "target" as const : "to-confirm" as const };
  }).sort((a, b) => {
    const rank = (key: string) => priority.includes(key) ? priority.indexOf(key) : priority.length;
    return rank(a.key) - rank(b.key);
  });
}
