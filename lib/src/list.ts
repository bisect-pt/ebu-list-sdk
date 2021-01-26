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
import { Unwinder } from '@bisect/bisect-core-ts';

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
        return this.token;
    }
    public removeItem(key: string) {
        this.token = undefined;
    }
}

export class LIST {
    // returns a new LIST object
    public static async connectWithOptions(options: types.IListOptions): Promise<LIST> {
        const unwinder = new Unwinder();

        try {
            const apiHandler = makeApiHandler(options.baseUrl);
            const storage = new TokenStorage();
            const authClient = new AuthClient(apiHandler, storage);
            unwinder.add(() => authClient.close());

            const rest = new RestClient(options.baseUrl, authClient.getToken.bind(authClient));

            const loginError = await authClient.login(options.username, options.password);
            if (loginError) {
                throw loginError;
            }

            const user: apiTypes.user.IUserInfo = (await rest.get('/api/user')) as apiTypes.user.IUserInfo;
            const ws = new WSCLient(options.baseUrl, '/socket', user.id);
            const transport = new Transport(rest, ws);

            unwinder.reset();
            return new LIST(transport, authClient);
        } finally {
            unwinder.unwind();
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
