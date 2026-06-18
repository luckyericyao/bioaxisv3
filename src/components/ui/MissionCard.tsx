type MissionCardProps = {
  title: string;
  body: string;
};

export function MissionCard({ title, body }: MissionCardProps) {
  return (
    <article className="border border-bioaxis-line bg-bioaxis-panel p-6 transition hover:border-bioaxis-accent/70 hover:bg-bioaxis-panelSoft">
      <h3 className="text-xl font-bold uppercase text-bioaxis-text">{title}</h3>
      <p className="mt-4 text-sm leading-6 text-bioaxis-muted">{body}</p>
    </article>
  );
}

