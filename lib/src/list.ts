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

let token: string | undefined = undefined;

const storageHandler: ILocalStorageHandler = (() => {
    if (typeof process === 'object') {
        return {
            setItem: (key: string, value: any) => {
                token = value;
            },
            getItem: (key: string) => {
                return token;
            },
            removeItem: (key: string) => token = undefined,
        };
    } else {
        return {
            setItem: (key: string, value: any) => {},
            getItem: (key: string) => {
                return '';
            },
            removeItem: (key: string) => {},
        };
    }
})();

export class LIST {
    // returns a new LIST object
    public static async connectWithOptions(options: types.IListOptions): Promise<LIST> {
        const apiHandler = makeApiHandler(options.baseUrl);
        const authClient = new AuthClient(apiHandler, storageHandler);
        const loginError = await authClient.login(options.username, options.password);
        if (loginError) {
            authClient.close();
            throw loginError;
        }

        const rest = new RestClient(options.baseUrl, authClient.getToken.bind(authClient));
        const user: apiTypes.user.IUserInfo = (await rest.get('/api/user')) as apiTypes.user.IUserInfo;
        const ws = new WSCLient(options.baseUrl, '/socket', user.id);
        const transport = new Transport(rest, ws);

        return new LIST(transport, authClient);
    }

    public static async connect(baseUrl: string, username: string, password: string): Promise<LIST> {
        return LIST.connectWithOptions({ baseUrl, username, password });
    }

    private constructor(public readonly transport: Transport, private readonly authClient: AuthClient) {}

    public async close(): Promise<void> {
        await this.transport.post('/auth/logout', {});
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
}
