import server from "../server";
import signUpRoutes from "./signup.route";
import userRoutes from "./user.route";

/** Health Check */
server.get("/", async (request, reply) => {
  return { status: "ok" };
});

server.register(signUpRoutes, { prefix: "/signup" });
server.register(userRoutes, { prefix: "/users" });
