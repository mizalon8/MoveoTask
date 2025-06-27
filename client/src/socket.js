import { io } from "socket.io-client";

const socket = io("https://moveotask-production-a21d.up.railway.app");

export default socket;
