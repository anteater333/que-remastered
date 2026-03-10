import "@fastify/jwt";
import { QueUserRole } from "../../../shared/role";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: {
      id: string;
      email: string;
      role: QueUserRole;
    };
  }
}
