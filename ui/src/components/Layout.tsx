type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout(props: LayoutProps) {
  const { children } = props;
  return (
    <>
      <div className="mx-auto flex h-screen flex-col">
        <div className="px-8">
          <main className="mx-auto flex w-full max-w-3xl flex-col gap-12 px-6 py-16">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
