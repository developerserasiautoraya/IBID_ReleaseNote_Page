import { createRequestHandler } from "@react-router/express"
import type { ServerBuild } from "react-router"



export default function createServer(build: ServerBuild) {
	return createRequestHandler({ build })
}