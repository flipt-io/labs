import clsx from "clsx";

type StepProps = {
  module: string;
  currentStep: number;
  steps: number;
};

export default function Steps(props: StepProps) {
  const { module, currentStep, steps } = props;
  return (
    <nav aria-label="Progress" className="mx-auto">
      <ol
        role="list"
        className="mx-auto mb-10 flex max-w-[65ch] list-none items-center"
      >
        {[...Array(steps).keys()].map((step, stepIdx) => (
          <li
            key={step}
            className={clsx(
              stepIdx !== steps - 1 ? "pr-8 sm:pr-20" : "",
              "relative"
            )}
          >
            {step < currentStep ? (
              <>
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="h-0.5 w-full max-w-lg bg-violet-600/40" />
                </div>
                <a
                  href={`/${module}/${step}`}
                  className="relative flex h-3 w-3 items-center justify-center rounded-full bg-violet-400 hover:bg-violet-600"
                />
              </>
            ) : step === currentStep ? (
              <>
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="h-0.5 w-full max-w-lg bg-gray-200" />
                </div>
                <a
                  href={`/${module}/${step}`}
                  className="relative flex h-3 w-3 items-center justify-center rounded-full border-2 border-violet-400 bg-white"
                  aria-current="step"
                >
                  <span
                    className="h-1 w-1 rounded-full bg-violet-400"
                    aria-hidden="true"
                  />
                  <span className="sr-only">{step}</span>
                </a>
              </>
            ) : (
              <>
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="h-0.5 w-full max-w-lg bg-gray-200" />
                </div>
                <a
                  href={`/${module}/${step}`}
                  className="group relative flex h-3 w-3 items-center justify-center rounded-full border-2 border-gray-300 bg-white hover:border-gray-400"
                >
                  <span
                    className="h-1 w-1 rounded-full bg-transparent group-hover:bg-gray-300"
                    aria-hidden="true"
                  />
                  <span className="sr-only">{step}</span>
                </a>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
