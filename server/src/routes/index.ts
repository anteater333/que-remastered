import server from "../server";

server.get("/", async (request, reply) => {
  return { status: "ok" };
});
