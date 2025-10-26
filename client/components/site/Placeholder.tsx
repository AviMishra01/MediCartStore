interface Props { title: string; description?: string }
export default function Placeholder({ title, description }: Props) {
  return (
    <section className="container py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description ? (
          <p className="mt-3 text-muted-foreground">{description}</p>
        ) : null}
        <p className="mt-6 text-sm text-muted-foreground">This page is scaffolded. Ask to generate it next and we will build it fully with the same layout and styling.</p>
      </div>
    </section>
  );
}
