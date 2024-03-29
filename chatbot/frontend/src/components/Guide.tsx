import { useEffect } from "react";
import Button from "./Button";
import Steps from "./Steps";
import Page from "./Page";
import { useParams, useNavigate } from "react-router-dom";

type GuideProps = {
  module: string;
  steps: number;
  next?: string;
};

export default function Guide(props: GuideProps) {
  const { module, steps, next } = props;

  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (params.step) {
      currentStep = parseInt(params.step);
      if (currentStep < 1 || currentStep > steps) {
        navigate(`/${module}`);
        return;
      }
    }
  }, [params.step]);

  let page = "intro";
  let currentStep = 0;

  if (params.step) {
    currentStep = parseInt(params.step);

    if (currentStep > 0) {
      page = `step${currentStep}`;
    }
  }

  const path = `modules/${module}/${page}`;

  return (
    <>
      <div className="flex flex-col">
        <Steps module={module} steps={steps} currentStep={currentStep} />

        <div className="divide-y-2 divide-gray-100">
          <article className="prose pb-5 font-light text-gray-600">
            <Page path={path} />
          </article>
          <div className="flex flex-row justify-between pt-5">
            <Button
              disabled={currentStep < 1}
              className="px-5 py-2 text-lg"
              onClick={() => {
                if (currentStep > 1) {
                  navigate(`/${module}/${currentStep - 1}`);
                  return;
                }
                navigate(`/${module}`);
              }}
            >
              Back
            </Button>
            {currentStep >= steps && next && (
              <Button
                className="px-5 py-2 text-lg"
                onClick={() => {
                  navigate(`/${next}`);
                }}
              >
                Next Module
              </Button>
            )}
            {(currentStep < steps || !next) && (
              <Button
                disabled={currentStep >= steps}
                className="px-5 py-2 text-lg"
                onClick={() => {
                  navigate(`/${module}/${currentStep + 1}`);
                }}
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
