import { ArrowDownCircleIcon } from "@heroicons/react/24/outline";

type InteractiveArrowProps = {
  subheading?: string;
};

export default function InteractiveArrow(props: InteractiveArrowProps) {
  const { subheading } = props;

  return (
    <div className="not-prose flex flex-col items-center justify-center">
      <p className="text-lg font-medium text-violet-600">
        This is an interactive component
      </p>
      {subheading && <p className="text-sm text-gray-500">{subheading}</p>}
      <ArrowDownCircleIcon
        className="mt-6 h-12 w-12 rounded-full text-violet-400 motion-safe:animate-bounce"
        aria-hidden="true"
      />
    </div>
  );
}
