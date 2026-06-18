type DocumentationChecklistProps = {
  items: string[];
};

export function DocumentationChecklist({ items }: DocumentationChecklistProps) {
  return (
    <section className="border border-bioaxis-line bg-bioaxis-panel p-6">
      <h2 className="text-2xl font-bold uppercase text-bioaxis-text">Documentation checklist</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item} className="border border-bioaxis-line bg-bioaxis-black p-4">
            <p className="text-sm font-semibold text-bioaxis-steel">{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
