import { useState } from "react";
import Guide from "./Guide";

type ModuleProps = {
  name: string;
  steps: number;
};

export default function Module(props: ModuleProps) {
  const { name, steps } = props;

  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <Guide
      module={name}
      steps={steps}
      currentStep={currentStep}
      nextStep={nextStep}
      prevStep={prevStep}
    />
  );
}
