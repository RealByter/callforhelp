import { Socket, Server } from "socket.io";

export class CallForHelpServer {
    public static readonly PORT: number = 3000;
    private port: string | number;
    private io: Server;

    constructor() {
        this.configurate();
        this.createServerSocket();
        this.listen();
    }

    private configurate(): void { 
        const proccessPort = process.env.PORT;

        if (proccessPort === undefined) {
            this.port = CallForHelpServer.PORT;
            console.log(`Environment variable port is undefined, defaulting to ${CallForHelpServer.PORT}`);
        } else {
            this.port = proccessPort;
        }
    }

    private createServerSocket(): void {
        this.io = require('socket.io')(this.port, {
            cors: {
                origin: ['http://localhost:8080']
            }
        });
    }

    private onConnect(socket: Socket): void {
        // register handlers here, see https://socket.io/docs/v4/server-application-structure/ for structure
    }
    
    private listen(): void {
        console.log(`Listening for connections on ${this.port}`)

        this.io.on('connection', (socket: Socket) => {
            console.log(`New connection from ${socket.handshake.address}`)
            this.onConnect(socket);
        });
    }
}