import { createItemListStructuredData, type DirectoryItemListProps } from "@/lib/structuredData";

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function DirectoryItemList(props: DirectoryItemListProps) {
  if (props.items.length === 0) return null;

  return <JsonLd data={createItemListStructuredData(props)} />;
}
