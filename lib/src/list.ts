import * as apiTypes from './api';
import { AuthClient, ILoginData, IApiHandler, ILocalStorageHandler, IGenericResponse, ILoginResponse } from './auth';
import { Info } from './info';
import { Live } from './live';
import { Pcap } from './pcap';
import { Transport } from './transport';
import { get, post } from './transport/common';
import { RestClient } from './transport/restClient';
import { WSCLient } from './transport/wsClient';
import * as types from './types';

//////////////////////////////////////////////////////////////////////////////

const makeApiHandler = (baseUrl: string): IApiHandler => ({
    login: async (data: ILoginData): Promise<IGenericResponse<ILoginResponse>> =>
        post(baseUrl, null, '/auth/login', data),
    revalidateToken: async (token: string) => get(baseUrl, token, '/api/user/revalidate-token'),
});

class TokenStorage implements ILocalStorageHandler {
    public token: any | undefined = undefined;

    public setItem(key: string, value: any) {
        this.token = value;
    }
    public getItem(key: string) {
        return undefined; // this.token;
    }
    public removeItem(key: string) {
        this.token = undefined;
    }
}

export class LIST {
    // returns a new LIST object
    public static async connectWithOptions(options: types.IListOptions): Promise<LIST> {
        const apiHandler = makeApiHandler(options.baseUrl);

        const storage = new TokenStorage();

        const authClient = new AuthClient(apiHandler, storage);
        const loginError = await authClient.login(options.username, options.password);
        if (loginError) {
            authClient.close();
            throw loginError;
        }

        const rest = new RestClient(options.baseUrl, authClient.getToken.bind(authClient));

        try {
            const user: apiTypes.user.IUserInfo = (await rest.get('/api/user')) as apiTypes.user.IUserInfo;
            const ws = new WSCLient(options.baseUrl, '/socket', user.id);
            const transport = new Transport(rest, ws);

            return new LIST(transport, authClient);
        } catch (e) {
            authClient.close();
            return e;
        }
    }

    public static async connect(baseUrl: string, username: string, password: string): Promise<LIST> {
        return LIST.connectWithOptions({ baseUrl, username, password });
    }

    private constructor(public readonly transport: Transport, private readonly authClient: AuthClient) {}

    public async close(): Promise<void> {
        this.transport.close();
        this.authClient.close();
    }

    public get info() {
        return new Info(this.transport);
    }

    public get live() {
        return new Live(this.transport);
    }

    public get pcap() {
        return new Pcap(this.transport);
    }

    public async logout(): Promise<void> {
        return this.transport.post('/auth/logout', {});
    }
}
