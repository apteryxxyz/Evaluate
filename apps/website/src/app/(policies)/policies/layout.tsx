export default function Layout(p: React.PropsWithChildren) {
  return (
    <article className="flex flex-col gap-6 py-6 container max-w-3xl space-y-4 lg:py-10">
      {p.children}
    </article>
  );
}
