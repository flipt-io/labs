type WellProps = {
  children: React.ReactNode;
};

export default function Well(props: WellProps) {
  const { children } = props;

  return (
    <div className="mt-4 overflow-hidden rounded-lg bg-gray-50">
      <div className="px-4 py-5 sm:p-6">{children}</div>
    </div>
  );
}
