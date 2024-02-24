export default function Layout(p: React.PropsWithChildren) {
  return (
    <article className="container relative max-w-3xl space-y-4 py-6 lg:py-10">
      {p.children}
    </article>
  );
}
