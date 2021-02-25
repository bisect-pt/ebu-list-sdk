import { Transport } from './transport';

import { IFrameInfo } from './api/stream';

// ////////////////////////////////////////////////////////////////////////////

export default class Stream {
    public constructor(private readonly transport: Transport) {
        this.transport = transport;
    }

    public async getFramesFromStream(pcapID: string, streamID: string | undefined): Promise<IFrameInfo[]> {
        const response = await this.transport.get(`/api/pcap/${pcapID}/stream/${streamID}/frames`);
        const frames: IFrameInfo[] = response as IFrameInfo[];
        return frames;
    }

    public getUrlForFrame(pcapID: string, streamID: string | undefined, timestamp: string) {
        return this.transport.rest.getAuthUrl(`/api/pcap/${pcapID}/stream/${streamID}/frame/${timestamp}/png`);
    }
}
