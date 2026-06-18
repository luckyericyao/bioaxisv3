type ProcessStep = {
  title: string;
  body: string;
};

type ProcessStepsProps = {
  steps: ProcessStep[];
};

export function ProcessSteps({ steps }: ProcessStepsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {steps.map((step, index) => (
        <article key={step.title} className="border border-bioaxis-line bg-bioaxis-panel p-6">
          <span className="text-sm font-bold text-bioaxis-dim">{String(index + 1).padStart(2, "0")}</span>
          <h3 className="mt-4 text-xl font-bold uppercase text-bioaxis-text">{step.title}</h3>
          <p className="mt-4 text-sm leading-6 text-bioaxis-muted">{step.body}</p>
        </article>
      ))}
    </div>
  );
}

