import server from "../server";
import authPlugin from "./auth";

// 플러그인 등록
server.register(authPlugin);
