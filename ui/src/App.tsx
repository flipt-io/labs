import { Chat } from "./components/Chat";
import ChatWindow from "./components/ChatWindow";
import Guide from "./components/Guide";
import { useState } from "react";
import { FliptApiClient } from "@flipt-io/flipt";
import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";

function App() {
  const [chatEnabled, setChatEnabled] = useState(false);

  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Guide
          path="basic"
          totalSteps={4}
          currentStep={currentStep}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      ),
    },
  ]);

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
  });

  return (
    <div className="mx-auto flex h-screen flex-col">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-12 py-16">
        <div className="flex flex-col gap-12">
          <RouterProvider router={router} />
          {chatEnabled && (
            <ChatWindow>
              <Chat />
            </ChatWindow>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
