import server from "./server";
import "./routes";

const start = async () => {
  try {
    await server.listen({ port: 3000, host: "0.0.0.0" });

    const address = server.server.address();
    const port = typeof address === "string" ? address : address?.port;
    console.log(`Server running on http://localhost:${port}.`);
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
};

start();
