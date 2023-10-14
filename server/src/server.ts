import { Socket, Server } from 'socket.io';
import { SocketFunction } from './index';

export class CallForHelpServer {
  public static readonly PORT: string = '3000';
  public static readonly CORS_ORIGIN = 'http://localhost:5173';

  private onConnectCallback: SocketFunction;
  private port: number;
  private corsOrigin: string;
  private io: Server;

  constructor(onConnectCallback: SocketFunction) {
    this.onConnectCallback = onConnectCallback;
    this.configurate();
    this.createServerSocket();
    this.listen();
  }

  private configurateSetting(
    settingEnvName: string,
    defaultSetting: string
  ): string {
    const setting = process.env[settingEnvName];

    if (setting === undefined) {
      console.log(
        `Environment variable ${settingEnvName} is non-existent! defaulting to ${defaultSetting}`
      );

      return defaultSetting;
    }

    return setting;
  }

  private configurate(): void {
    this.port = parseInt(
      this.configurateSetting('PORT', CallForHelpServer.PORT)
    );
    this.corsOrigin = this.configurateSetting(
      'CORS_ORIGIN',
      CallForHelpServer.CORS_ORIGIN
    );
  }

  private createServerSocket(): void {
    this.io = new Server(this.port, {
      cors: {
        origin: [this.corsOrigin]
      }
    });
  }

  private listen(): void {
    console.log(`Listening for connections on ${this.port}`);

    this.io.on('connection', (socket: Socket) => {
      console.log(`New connection from ${socket.handshake.address}`);
      this.onConnectCallback(this.io, socket);
    });
  }
}
