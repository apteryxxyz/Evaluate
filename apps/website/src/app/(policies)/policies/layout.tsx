export default function Layout(p: React.PropsWithChildren) {
  return (
    <article className="container flex max-w-3xl flex-col gap-6 space-y-4 py-6 lg:py-10">
      {p.children}
    </article>
  );
}
