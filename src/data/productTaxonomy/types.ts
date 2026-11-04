export type ProductSpecification = string;
export type DocumentationRequirement = string;
export type ApplicationArea = string;
export type ProductRequestType = "quote" | "equivalent" | "sample" | "documentation";

export type ProductItem = {
  slug: string;
  name: string;
  indexable: boolean;
  shortDescription: string;
  introduction: string;
  details: string[];
  commonSpecifications: string[];
  applications: string[];
  compatibilityConsiderations: string[];
  documentationNeeds: string[];
  equivalentMatchingInputs: string[];
  sampleEvaluationNotes: string[];
  relatedRequestTypes: ProductRequestType[];
};

export type RelatedCategory = {
  label: string;
  href: string;
  segmentSlug: string;
  subcategorySlug: string;
  categorySlug: string;
};

export type ProductFamily = {
  slug: string;
  id: string;
  name: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  description: string;
  buyerSpecs: string[];
  commonFormats: string[];
  applications: string[];
  documentationNeeds: DocumentationRequirement[];
  equivalentMatchingInputs: string[];
  equivalentSwitchingConsiderations: string[];
  typicalProducts: string[];
  commonUseCases: string[];
  selectionCriteria: string[];
  keySpecifications: ProductSpecification[];
  representativeFormats: string[];
  documentationChecklist: DocumentationRequirement[];
  recommendedRFQFields: string[];
  relatedFamilies: string[];
  productItems?: ProductItem[];
  requestCta: string;
  seoTitle: string;
  metaDescription: string;
};

export type ProductSubcategory = {
  slug: string;
  id: string;
  name: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  description: string;
  buyerSpecs: string[];
  selectionCriteria: string[];
  families: ProductFamily[];
  productFamilies: ProductFamily[];
  featuredFamilies: ProductFamily[];
  typicalProducts: string[];
  commonFormats: string[];
  formats: string[];
  applications: ApplicationArea[];
  commonApplications: ApplicationArea[];
  specifications: ProductSpecification[];
  documentation: DocumentationRequirement[];
  documentationNeeds: DocumentationRequirement[];
  relatedCategories: RelatedCategory[];
  relatedSubcategories: string[];
  relatedSegments: string[];
  requestTypes: string[];
  seoTitle: string;
  metaDescription: string;
};

export type ProductSegment = {
  slug: string;
  id: string;
  name: string;
  title: string;
  shortTitle: string;
  index: number;
  headline: string;
  heroStatement: string;
  shortDescription: string;
  longDescription: string;
  description: string;
  heroDescription: string;
  buyerUseCases: string[];
  primaryApplications: ApplicationArea[];
  buyerTypes: string[];
  buyerSpecs: string[];
  subcategories: ProductSubcategory[];
  categories: ProductSubcategory[];
  featuredCategories: ProductSubcategory[];
  relatedSegments: string[];
  rfqPrompts: string[];
  equivalentPrompts: string[];
  samplePrompts: string[];
  productFamilies: string[];
  applications: ApplicationArea[];
  specifications: ProductSpecification[];
  formats: string[];
  imageKey: string;
  visualTheme: string;
  ctaCopy: string;
  seoTitle: string;
  metaDescription: string;
};

export type ProductTaxonomySegment = ProductSegment;
export type ProductCategory = ProductSubcategory;
export type FeaturedFamily = ProductFamily;

export type RawSubcategory = {
  name: string;
  slug: string;
  families: string[];
};

export type RawSegment = {
  name: string;
  slug: string;
  headline: string;
  shortDescription: string;
  buyerUseCases: string[];
  buyerSpecs: string[];
  commonFormats: string[];
  applications: string[];
  documentationNeeds: string[];
  subcategories: RawSubcategory[];
  relatedSegments: string[];
};

export type SearchResultType = "segment" | "subcategory" | "family" | "product" | "workflow" | "resource";
export type ProductSearchMatchTier = "title" | "path" | "combined" | "family" | "related" | "specification" | "description" | "application" | "context" | "partial";

export type ProductSearchResult = {
  type: SearchResultType;
  matchKind?: "taxonomy" | "sourcing-template" | "catalog-reference" | "content";
  catalogReference?: string;
  matchTier?: ProductSearchMatchTier;
  queryCoverage?: number;
  title: string;
  description: string;
  href: string;
  segmentTitle?: string;
  segmentSlug?: string;
  categoryTitle?: string;
  categorySlug?: string;
  subcategoryTitle?: string;
  familyTitle?: string;
  familySlug?: string;
  productTitle?: string;
  productSlug?: string;
  matchedFields?: string[];
};
