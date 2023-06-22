import { useState } from "react";
import Guide from "./Guide";

type ModuleProps = {
  path: string;
  steps: number;
};

export default function Module(props: ModuleProps) {
  const { path, steps } = props;

  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <Guide
      path={path}
      steps={steps}
      currentStep={currentStep}
      nextStep={nextStep}
      prevStep={prevStep}
    />
  );
}
