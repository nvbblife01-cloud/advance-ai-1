interface Props {
  title: string;
  subtitle: string;
}

export function PageHeader({ title, subtitle }: Props) {
  return (
    <header className="mb-4 px-4 pt-4 md:px-0">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
    </header>
  );
}
