import server from "../server";
import authPlugin from "./auth";
import multipartPlugin from "./multipart";
import ssePlugin from "./sse";

// 플러그인 등록
server.register(authPlugin);
server.register(multipartPlugin);
server.register(ssePlugin);
