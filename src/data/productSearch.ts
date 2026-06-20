import { getProductItemHref, getProductItemsForFamily } from "@/data/productItems";
import { productTaxonomy, type ProductSearchResult } from "@/data/productTaxonomy";
import { resourceArticles } from "@/data/resourceArticles";
import { resourceGuides } from "@/data/resources";
import { workflows } from "@/data/workflows";

type SearchField = {
  label: string;
  text: string | string[];
  weight: number;
  phraseBonus: number;
  direct?: boolean;
};

type ScoredResult = ProductSearchResult & {
  score: number;
  exactPhraseMatch: boolean;
  directMatch: boolean;
  order: number;
};

const maxCountPerField = 5;

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/[µμ]/g, "u")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeSource(text: string | string[]) {
  return normalizeText(Array.isArray(text) ? text.join(" ") : text);
}

function tokenVariants(token: string) {
  const variants = new Set([token]);

  if (token.endsWith("ies") && token.length > 3) {
    variants.add(`${token.slice(0, -3)}y`);
  }

  if (token.endsWith("y") && token.length > 2) {
    variants.add(`${token.slice(0, -1)}ies`);
  }

  if (token.endsWith("s") && token.length > 3) {
    variants.add(token.slice(0, -1));
  } else if (token.length > 2) {
    variants.add(`${token}s`);
  }

  return [...variants];
}

function queryTokens(query: string) {
  return normalizeText(query)
    .split(" ")
    .filter(Boolean);
}

function countTokenOccurrences(fieldTokens: string[], token: string) {
  const variants = tokenVariants(token);

  return fieldTokens.reduce((count, fieldToken) => count + (variants.includes(fieldToken) ? 1 : 0), 0);
}

function scoreField(field: SearchField, normalizedPhrase: string, tokens: string[]) {
  const normalizedField = normalizeSource(field.text);

  if (!normalizedField) {
    return { score: 0, matched: false, exactPhraseMatch: false };
  }

  const fieldTokens = normalizedField.split(" ");
  const tokenScore = tokens.reduce((score, token) => {
    const count = Math.min(countTokenOccurrences(fieldTokens, token), maxCountPerField);
    return score + count * field.weight;
  }, 0);
  const exactPhraseMatch = normalizedPhrase.length > 0 && normalizedField.includes(normalizedPhrase);
  const phraseScore = exactPhraseMatch ? field.phraseBonus : 0;
  const score = tokenScore + phraseScore;

  return {
    score,
    matched: score > 0,
    exactPhraseMatch
  };
}

function scoreResult(fields: SearchField[], query: string) {
  const normalizedPhrase = normalizeText(query);
  const tokens = queryTokens(query);
  const matchedFields: string[] = [];
  let score = 0;
  let exactPhraseMatch = false;
  let directMatch = false;

  fields.forEach((field) => {
    const fieldScore = scoreField(field, normalizedPhrase, tokens);

    score += fieldScore.score;

    if (fieldScore.matched) {
      matchedFields.push(field.label);
      directMatch = directMatch || Boolean(field.direct);
    }

    exactPhraseMatch = exactPhraseMatch || fieldScore.exactPhraseMatch;
  });

  return {
    score,
    exactPhraseMatch,
    directMatch,
    matchedFields: [...new Set(matchedFields)]
  };
}

function typeRank(type: ProductSearchResult["type"]) {
  if (type === "segment") {
    return 6;
  }
  if (type === "subcategory") {
    return 5;
  }
  if (type === "family") {
    return 4;
  }
  if (type === "product") {
    return 3;
  }
  if (type === "workflow") {
    return 2;
  }

  return 1;
}

function productUniverseRank(type: ProductSearchResult["type"]) {
  return type === "workflow" || type === "resource" ? 0 : 1;
}

function segmentAliases(segmentSlug: string) {
  const aliases: Record<string, string[]> = {
    "molecular-biology-pcr": [
      "gene",
      "gene editing",
      "gene cloning",
      "cloning",
      "gene expression",
      "transfection",
      "nucleic acid extraction",
      "PCR",
      "qPCR",
      "RT-PCR"
    ],
    "cell-culture": [
      "cell",
      "cells",
      "cell models",
      "cell line",
      "transfection",
      "primary cells",
      "cell banking"
    ],
    "automation-consumables": [
      "Hamilton",
      "Tecan",
      "robotic tips",
      "conductive tips",
      "liquid handler",
      "automation-compatible tips"
    ],
    "storage-cryopreservation": ["cell banking", "cryogenic vials", "cryovials", "freezing media", "sample banking"],
    "sample-prep-filtration": ["PES 0.22", "PES 0.22 µm", "sterile syringe filter", "syringe filters", "sample cleanup"]
  };

  return aliases[segmentSlug] ?? [];
}

function familyAliases(segmentSlug: string, familySlug: string) {
  const aliases: Record<string, string[]> = {
    "dna-extraction-kits": ["gene extraction", "genomic DNA", "nucleic acid extraction"],
    "rna-extraction-kits": ["gene expression", "RNA isolation", "nucleic acid extraction"],
    "plasmid-prep-kits": ["cloning", "gene cloning", "plasmid"],
    "qpcr-plates": ["qPCR plates", "real time PCR plates", "optical qPCR"],
    "optical-sealing-films": ["qPCR optical seals", "optical seals", "PCR seals"],
    "filtered-pipette-tips": ["filtered 200 µL tips", "aerosol barrier tips", "PCR clean tips"],
    "low-retention-pipette-tips": ["low retention tips", "low bind tips", "protein recovery tips"],
    "hamilton-robotic-tips": ["Hamilton", "Hamilton-compatible", "conductive robotic tips", "liquid handler tips"],
    "tecan-robotic-tips": ["Tecan", "Tecan-compatible", "liquid handler tips"],
    "pes-syringe-filters": ["PES 0.22", "PES 0.22 µm", "sterile syringe filter"],
    "sterile-syringe-filters": ["sterile syringe filter", "sterile filtration", "0.22 µm sterile filter"],
    "sterile-cryovials": ["cryogenic vials", "cryovials", "cell banking", "cryopreservation"]
  };

  return [...(aliases[familySlug] ?? []), ...segmentAliases(segmentSlug)];
}

function stripScore(result: ScoredResult): ProductSearchResult {
  return {
    type: result.type,
    title: result.title,
    description: result.description,
    href: result.href,
    segmentTitle: result.segmentTitle,
    segmentSlug: result.segmentSlug,
    categoryTitle: result.categoryTitle,
    categorySlug: result.categorySlug,
    subcategoryTitle: result.subcategoryTitle,
    familyTitle: result.familyTitle,
    familySlug: result.familySlug,
    productTitle: result.productTitle,
    productSlug: result.productSlug,
    matchedFields: result.matchedFields
  };
}

export function getProductSearchResults(query: string): ProductSearchResult[] {
  if (queryTokens(query).length === 0) {
    return [];
  }

  const results: ScoredResult[] = [];
  let order = 0;

  function addResult(result: ProductSearchResult, fields: SearchField[]) {
    const scored = scoreResult(fields, query);

    if (scored.score <= 0) {
      return;
    }

    results.push({
      ...result,
      matchedFields: scored.matchedFields,
      score: scored.score,
      exactPhraseMatch: scored.exactPhraseMatch,
      directMatch: scored.directMatch,
      order: order++
    });
  }

  productTaxonomy.forEach((segment) => {
    addResult(
      {
        type: "segment",
        title: segment.name,
        description: segment.shortDescription,
        href: `/products/${segment.slug}`,
        segmentTitle: segment.name,
        segmentSlug: segment.slug
      },
      [
        { label: "title", text: segment.name, weight: 100, phraseBonus: 150, direct: true },
        { label: "path", text: [segment.name, segment.slug], weight: 70, phraseBonus: 120, direct: true },
        { label: "representative families", text: segment.productFamilies, weight: 60, phraseBonus: 80, direct: true },
        { label: "aliases", text: segmentAliases(segment.slug), weight: 62, phraseBonus: 96, direct: true },
        { label: "specifications", text: [...segment.buyerSpecs, ...segment.specifications, ...segment.formats], weight: 35, phraseBonus: 60 },
        { label: "description", text: [segment.headline, segment.shortDescription, segment.longDescription], weight: 25, phraseBonus: 50 },
        { label: "applications", text: [...segment.buyerUseCases, ...segment.primaryApplications, ...segment.applications], weight: 15, phraseBonus: 35 },
        { label: "metadata", text: [...segment.buyerTypes, ...segment.rfqPrompts, ...segment.equivalentPrompts, ...segment.samplePrompts], weight: 10, phraseBonus: 25 }
      ]
    );

    segment.subcategories.forEach((subcategory) => {
      addResult(
        {
          type: "subcategory",
          title: subcategory.name,
          description: subcategory.shortDescription,
          href: `/products/${segment.slug}/${subcategory.slug}`,
          segmentTitle: segment.name,
          segmentSlug: segment.slug,
          categoryTitle: subcategory.name,
          categorySlug: subcategory.slug,
          subcategoryTitle: subcategory.name
        },
        [
          { label: "title", text: subcategory.name, weight: 100, phraseBonus: 150, direct: true },
          { label: "path", text: [segment.name, segment.slug, subcategory.name, subcategory.slug], weight: 70, phraseBonus: 120, direct: true },
            { label: "representative families", text: subcategory.families.map((family) => family.name), weight: 60, phraseBonus: 80, direct: true },
            { label: "aliases", text: segmentAliases(segment.slug), weight: 42, phraseBonus: 72 },
            { label: "specifications", text: [...subcategory.buyerSpecs, ...subcategory.commonFormats], weight: 35, phraseBonus: 60 },
          { label: "description", text: [subcategory.shortDescription, subcategory.longDescription], weight: 25, phraseBonus: 50 },
          { label: "applications", text: subcategory.applications, weight: 15, phraseBonus: 35 },
          { label: "metadata", text: subcategory.documentationNeeds, weight: 10, phraseBonus: 25 }
        ]
      );

      subcategory.families.forEach((family) => {
        addResult(
          {
            type: "family",
            title: family.name,
            description: family.shortDescription,
            href: `/products/${segment.slug}/${subcategory.slug}/${family.slug}`,
            segmentTitle: segment.name,
            segmentSlug: segment.slug,
            categoryTitle: subcategory.name,
            categorySlug: subcategory.slug,
            subcategoryTitle: subcategory.name,
            familyTitle: family.name,
            familySlug: family.slug
          },
          [
            { label: "title", text: family.name, weight: 100, phraseBonus: 150, direct: true },
            { label: "path", text: [segment.name, segment.slug, subcategory.name, subcategory.slug, family.name, family.slug], weight: 70, phraseBonus: 120, direct: true },
            { label: "representative families", text: [...family.typicalProducts, ...family.representativeFormats, ...family.relatedFamilies], weight: 60, phraseBonus: 80, direct: true },
            { label: "aliases", text: familyAliases(segment.slug, family.slug), weight: 68, phraseBonus: 104, direct: true },
            { label: "specifications", text: [...family.buyerSpecs, ...family.commonFormats, ...family.keySpecifications, ...family.selectionCriteria], weight: 35, phraseBonus: 60 },
            { label: "description", text: [family.shortDescription, family.longDescription, family.description], weight: 25, phraseBonus: 50 },
            { label: "applications", text: [...family.applications, ...family.commonUseCases], weight: 15, phraseBonus: 35 },
            { label: "metadata", text: [...family.documentationNeeds, ...family.equivalentMatchingInputs, ...family.equivalentSwitchingConsiderations, ...family.recommendedRFQFields], weight: 10, phraseBonus: 25 }
          ]
        );

        getProductItemsForFamily(segment.slug, subcategory.slug, family.slug).forEach((productItem) => {
          addResult(
            {
              type: "product",
              title: productItem.name,
              description: productItem.shortDescription,
              href: getProductItemHref(segment.slug, subcategory.slug, family.slug, productItem.slug),
              segmentTitle: segment.name,
              segmentSlug: segment.slug,
              categoryTitle: subcategory.name,
              categorySlug: subcategory.slug,
              subcategoryTitle: subcategory.name,
              familyTitle: family.name,
              familySlug: family.slug,
              productTitle: productItem.name,
              productSlug: productItem.slug
            },
            [
              { label: "title", text: productItem.name, weight: 100, phraseBonus: 150, direct: true },
              { label: "path", text: [segment.name, segment.slug, subcategory.name, subcategory.slug, family.name, family.slug, productItem.name, productItem.slug], weight: 70, phraseBonus: 120, direct: true },
              { label: "aliases", text: familyAliases(segment.slug, family.slug), weight: 52, phraseBonus: 86, direct: true },
              { label: "specifications", text: productItem.commonSpecifications, weight: 35, phraseBonus: 60 },
              { label: "description", text: [productItem.shortDescription, productItem.introduction, ...productItem.details], weight: 25, phraseBonus: 50 },
              { label: "applications", text: [...productItem.applications, ...productItem.compatibilityConsiderations], weight: 15, phraseBonus: 35 },
              { label: "metadata", text: [...productItem.documentationNeeds, ...productItem.equivalentMatchingInputs, ...productItem.sampleEvaluationNotes], weight: 10, phraseBonus: 25 }
            ]
          );
        });
      });
    });
  });

  workflows.forEach((workflow) => {
    addResult(
      {
        type: "workflow",
        title: workflow.title,
        description: workflow.shortDescription,
        href: `/workflows#${workflow.slug}`
      },
      [
        { label: "title", text: workflow.title, weight: 92, phraseBonus: 130, direct: true },
        { label: "path", text: ["Workflows", workflow.stage, workflow.slug], weight: 62, phraseBonus: 88, direct: true },
        { label: "workflow tags", text: workflow.productFamilies, weight: 46, phraseBonus: 70, direct: true },
        { label: "description", text: [workflow.shortDescription, workflow.description], weight: 32, phraseBonus: 48 },
        { label: "workflow details", text: [...workflow.whatYouAreDoing, ...workflow.consumablesNeeded, ...workflow.commonQuestions, ...workflow.bioAxisHelp], weight: 22, phraseBonus: 36 }
      ]
    );
  });

  resourceGuides.forEach((guide) => {
    const article = resourceArticles.find((item) => item.slug === guide.slug);
    const articleBody = article?.sections.flatMap((section) => [section.heading, ...section.body]) ?? [];

    addResult(
      {
        type: "resource",
        title: guide.title,
        description: guide.summary,
        href: `/resources/${guide.slug}`
      },
      [
        { label: "title", text: guide.title, weight: 88, phraseBonus: 128, direct: true },
        { label: "path", text: ["Resources", guide.slug], weight: 58, phraseBonus: 84, direct: true },
        { label: "workflow tags", text: [...guide.relatedSegments, ...guide.relatedWorkflows], weight: 42, phraseBonus: 64 },
        { label: "description", text: [guide.summary, article?.description ?? ""], weight: 30, phraseBonus: 44 },
        { label: "resource body", text: articleBody, weight: 16, phraseBonus: 30 }
      ]
    );
  });

  return results
    .sort(
      (a, b) =>
        productUniverseRank(b.type) - productUniverseRank(a.type) ||
        Number(b.exactPhraseMatch) - Number(a.exactPhraseMatch) ||
        Number(b.directMatch) - Number(a.directMatch) ||
        b.score - a.score ||
        typeRank(b.type) - typeRank(a.type) ||
        a.order - b.order
    )
    .map(stripScore);
}
