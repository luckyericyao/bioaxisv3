type MissionCardProps = {
  title: string;
  body: string;
};

export function MissionCard({ title, body }: MissionCardProps) {
  return (
    <article className="border border-white/70 bg-white/[0.78] p-6 shadow-[0_18px_60px_rgba(15,76,129,0.10)] backdrop-blur transition hover:border-bioaxis-ice hover:bg-white">
      <h3 className="text-xl font-bold uppercase text-bioaxis-text">{title}</h3>
      <p className="mt-4 text-sm leading-6 text-bioaxis-muted">{body}</p>
    </article>
  );
}
