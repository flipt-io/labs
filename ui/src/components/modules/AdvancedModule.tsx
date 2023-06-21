import { useState } from "react";
import Guide from "../Guide";

export default function AdvancedModule() {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <Guide
      path="advanced"
      totalSteps={5}
      currentStep={currentStep}
      nextStep={nextStep}
      prevStep={prevStep}
    />
  );
}
