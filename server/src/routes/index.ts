import server from "../server";
import signInRoutes from "./signin.route";
import signUpRoutes from "./signup.route";
import stageRoutes from "./stage.route";
import userRoutes from "./user.route";

/** Health Check */
server.get("/", async (request, reply) => {
  return { status: "ok" };
});

server.register(signUpRoutes, { prefix: "/signup" });
server.register(signInRoutes, { prefix: "/signin" });
server.register(userRoutes, { prefix: "/users" });
server.register(stageRoutes, { prefix: "/stages" });
