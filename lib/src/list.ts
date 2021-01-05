import * as apiTypes from './api';
import { Client, ILoginData, IApiHandler, ILocalStorageHandler, IGenericResponse, ILoginResponse } from './auth';
import { Info } from './info';
import { Live } from './live';
import { Pcap } from './pcap';
import { Transport } from './transport';
import { post } from './transport/common';
import { RestClient } from './transport/restClient';
import { WSCLient } from './transport/wsClient';
import * as types from './types';

//////////////////////////////////////////////////////////////////////////////

const makeApiHandler = (baseUrl: string): IApiHandler => ({
    login: async (data: ILoginData): Promise<IGenericResponse<ILoginResponse>> => {
        const response = await post(baseUrl, null, '/auth/login', data);
        console.log(`response: ${JSON.stringify(response)}`);
        return response;
    },
    revalidateToken: async () => {
        return Promise.reject();
    },
});

let token: string | undefined = undefined;

const storageHandler: ILocalStorageHandler = {
    setItem: (key: string, value: any) => {
        console.log(`setItem: ${key} ${JSON.stringify(value)}`);
        token = value;
    },
    getItem: (key: string) => {
        console.log(`getItem: ${token}`);
        return token;
    },
    removeItem: (key: string) => {},
};
export class LIST {
    // returns a new LIST object
    public static async connectWithOptions(options: types.IListOptions): Promise<LIST> {
        const apiHandler = makeApiHandler(options.baseUrl);
        const client = new Client(apiHandler, storageHandler);
        const loginResult = await client.login(options.username, options.password);
        // TODO: validate result

        const rest = new RestClient(options.baseUrl, client.getToken.bind(client));
        const user: apiTypes.user.IUserInfo = (await rest.get('/api/user')) as apiTypes.user.IUserInfo;
        const ws = new WSCLient(options.baseUrl, '/socket', user.id);
        const transport = new Transport(rest, ws);

        return new LIST(transport);
    }

    public static async connect(baseUrl: string, username: string, password: string): Promise<LIST> {
        return LIST.connectWithOptions({ baseUrl, username, password });
    }

    private constructor(public readonly transport: Transport) {
        this.transport = transport;
    }

    public async close(): Promise<void> {
        await this.transport.post('/auth/logout', {});
        this.transport.close();
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
