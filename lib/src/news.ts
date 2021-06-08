import { Transport } from '@bisect/bisect-core-ts';

//////////////////////////////////////////////////////////////////////////////

export default class News {
    public constructor(private readonly transport: Transport) {}

    public async getNews(): Promise<any> {
        const response = await this.transport.get('/api/news');
        return response;
    }

    public async getHTML(urls: any): Promise<any> {
        const response = await this.transport.post('/api/news/html', urls);
        return response;
    }

    public async setNewsRead(timestamp: any): Promise<any> {
        const response = await this.transport.post('/api/news/markread', timestamp);
        return response;
    }
}
