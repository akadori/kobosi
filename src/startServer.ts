import http, {
	Server,
	ServerOptions,
	IncomingMessage,
	ServerResponse,
	RequestListener,
} from "http";
import { Socket } from "net";

const originalCreateServer = http.createServer;
let sockets: Array<Socket> = [];
let closeServer: typeof Server.prototype.close;

function isOption(arg: any): arg is ServerOptions {
	return arg && typeof arg === "object";
}
function createEasyToStopServer<
	Request extends typeof IncomingMessage = typeof IncomingMessage,
	Response extends typeof ServerResponse = typeof ServerResponse,
>(
	requestListener?: RequestListener<Request, Response>,
): Server<Request, Response>;
function createEasyToStopServer<
	Request extends typeof IncomingMessage = typeof IncomingMessage,
	Response extends typeof ServerResponse = typeof ServerResponse,
>(
	options: ServerOptions<Request, Response>,
	requestListener?: RequestListener<Request, Response>,
): Server<Request, Response>;
function createEasyToStopServer<
	Request extends typeof IncomingMessage = typeof IncomingMessage,
	Response extends typeof ServerResponse = typeof ServerResponse,
>(
	...args:
		| [ServerOptions<Request, Response>, RequestListener<Request, Response>?]
		| [RequestListener<Request, Response>?]
): Server<Request, Response> {
	let server: Server<Request, Response>;
	if (isOption(args[0])) {
		server = originalCreateServer(args[0], args[1]);
	} else {
		server = originalCreateServer(args[0]);
	}
	server.on("connection", (socket) => {
		sockets.push(socket);
	});
	closeServer = server.close.bind(server);
	return server;
}

export const startServer = (entryPoint: string) => {
	http.createServer = createEasyToStopServer;
	require(entryPoint);
};

export const restartServer = (
	entryPoint: string,
	serverWillRestart: () => void,
) => {
	sockets.forEach((socket) => {
		socket.destroy();
	});
	sockets = [];
	closeServer();
	serverWillRestart();
	require(entryPoint);
};
