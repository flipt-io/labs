import { useEffect, useState } from "react";
import Button from "./Button";
import { FliptApiClient } from "@flipt-io/flipt";
import ChatWindow from "./ChatWindow";
import Steps from "./Steps";
import { Chat } from "./Chat";
import Page from "./Page";
import { useParams, useNavigate } from "react-router-dom";

type GuideProps = {
  module: string;
  steps: number;
};

export default function Guide(props: GuideProps) {
  const { module, steps } = props;

  const params = useParams();
  const navigate = useNavigate();

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
        // ignore
      }
    };

    checkChatEnabled();
    const interval = setInterval(() => {
      checkChatEnabled();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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
        <article className="prose font-light text-gray-600">
          <div className="divide-y-2 divide-gray-100">
            <div>
              <Page path={path} />
            </div>
            <div className="flex flex-row justify-between pt-10">
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
              <Button
                disabled={currentStep >= steps}
                className="px-5 py-2 text-lg"
                onClick={() => {
                  navigate(`/${module}/${currentStep + 1}`);
                }}
              >
                Next
              </Button>
            </div>
          </div>
        </article>
      </div>
      {chatEnabled && (
        <ChatWindow>
          <Chat />
        </ChatWindow>
      )}
    </>
  );
}
