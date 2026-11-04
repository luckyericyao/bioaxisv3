export type DocumentStatus = "available" | "request_required" | "supplier_dependent";

export type ProductDocuments = {
  sds?: DocumentStatus;
  coa?: DocumentStatus;
  specificationSheet?: DocumentStatus;
  sterilityStatement?: DocumentStatus;
  animalOriginStatement?: DocumentStatus;
  lotLevelDocumentation?: DocumentStatus;
};

export type ProductCatalogItem = {
  id: string;
  slug: string;
  name: string;
  supplier?: string;
  catalogNumber?: string;
  description: string;
  productType: string;
  specs: Record<string, string | string[]>;
  tags: string[];
  documents: ProductDocuments;
  actions: {
    quote: boolean;
    equivalent: boolean;
    sample: boolean;
    documents: boolean;
    recurringSupply: boolean;
  };
};

export type ProductCatalogFamily = {
  id: string;
  slug: string;
  name: string;
  description: string;
  typicalSpecs: string[];
  products: ProductCatalogItem[];
};

export type ProductCatalogCategory = {
  id: string;
  slug: string;
  name: string;
  description: string;
  tags: string[];
  families: ProductCatalogFamily[];
};

export type ProductCatalogSegment = {
  id: string;
  slug: string;
  index: string;
  name: string;
  shortDescription: string;
  heroDescription: string;
  categories: ProductCatalogCategory[];
};

export type ProductCatalogFilters = {
  productType?: string[];
  supplier?: string[];
  format?: string[];
  sterility?: string[];
  material?: string[];
  volumeSize?: string[];
  application?: string[];
  documentation?: string[];
  packaging?: string[];
  automationCompatible?: string[];
  query?: string;
};

export type FamilySeed = {
  slug: string;
  name: string;
  description?: string;
  typicalSpecs?: string[];
  productNames?: ProductNameSeed[];
};

export type ProductNameSeed = {
  slug: string;
  name: string;
  specs?: Record<string, string | string[]>;
  tags?: string[];
};

export type CategorySeed = {
  slug: string;
  name: string;
  description: string;
  tags: string[];
  families: FamilySeed[];
};

export type SegmentSeed = {
  slug: string;
  index: string;
  name: string;
  shortDescription: string;
  heroDescription: string;
  categories: CategorySeed[];
};
