import { useEffect, useState } from "react";
import { Button } from "./Button";
import { FliptApiClient } from "@flipt-io/flipt";
import ChatWindow from "./ChatWindow";
import { Chat } from "./Chat";
import Page from "./Page";

type GuideProps = {
  module: string;
  steps: number;
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
};

export default function Guide(props: GuideProps) {
  const { module, steps, currentStep, nextStep, prevStep } = props;
  const [chatEnabled, setChatEnabled] = useState(false);

  const client = new FliptApiClient({
    environment: "http://localhost:8080",
  });

  useEffect(() => {
    const checkChatEnabled = async () => {
      try {
        const flag = await client.flags.get("default", "chat-enabled");
        setChatEnabled(flag.enabled);
      } catch (e) {
        console.log(e);
      }
    };

    checkChatEnabled();
    const interval = setInterval(() => {
      checkChatEnabled();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  let page = "intro";

  if (currentStep > 0) {
    page = `step${currentStep}`;
  }

  const path = `modules/${module}/${page}`;

  return (
    <>
      <article className="prose font-light text-gray-600">
        <div className="flex flex-col divide-y-2 divide-gray-100">
          <div>
            <Page path={path} />
          </div>
          <div className="flex flex-row justify-between pt-10">
            <Button
              disabled={currentStep < 1}
              className="px-5 py-3 text-xl font-thin"
              onClick={prevStep}
            >
              Back
            </Button>
            <Button
              disabled={currentStep >= steps}
              className="px-5 py-3 text-xl font-thin"
              onClick={nextStep}
            >
              Next
            </Button>
          </div>
        </div>
      </article>
      {chatEnabled && (
        <ChatWindow>
          <Chat />
        </ChatWindow>
      )}
    </>
  );
}
