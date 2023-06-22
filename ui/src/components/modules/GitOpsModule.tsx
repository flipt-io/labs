import { useState } from "react";
import Guide from "components/Guide";

export default function GitOpsModule() {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <Guide
      path="gitops"
      totalSteps={5}
      currentStep={currentStep}
      nextStep={nextStep}
      prevStep={prevStep}
    />
  );
}
