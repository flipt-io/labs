export const config = {
  runtime: "edge",
};

const handler = async (req: Request): Promise<Response> => {
  const body = await req.json();

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const response = await fetch("http://localhost:8080/chat", {
    headers: requestHeaders,
    method: "POST",
    body: JSON.stringify(body),
  });

  return response;
};

export default handler;
