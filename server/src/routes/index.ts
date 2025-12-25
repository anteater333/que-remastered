import server from "../server";
import signUpRoutes from "./signup.route";

/** Health Check */
server.get("/", async (request, reply) => {
  return { status: "ok" };
});

server.register(signUpRoutes, { prefix: "/signup" });
