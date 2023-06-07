export const config = {
  runtime: "edge",
};

const handler = async (req: Request): Promise<Response> => {
  const body = req.body;
  console.log(body);

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const res = await fetch("http://localhost:8080/chat/", {
    headers: requestHeaders,
    method: "POST",
    body: JSON.stringify(body),
  });

  return res;
};
export default handler;
