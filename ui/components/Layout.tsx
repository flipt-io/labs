type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout(props: LayoutProps) {
  const { children } = props;
  return (
    <>
      <div className="mx-auto h-screen flex flex-col">
        <div className="px-8 bg-accents-0">
          <main className="w-full max-w-3xl mx-auto py-16 flex flex-col gap-12">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
