import { Transport } from '@bisect/bisect-core-ts';
import { IPcapUploadResult, UploadProgressCallback } from './types';
import { IPcapInfo, IStreamInfo } from './api/pcap';

// ////////////////////////////////////////////////////////////////////////////

export default class DownloadManager {
    public constructor(private readonly transport: Transport) {}

    public async getAll(): Promise<any> {
        const result = await this.transport.get(`/api/downloadmngr`);
        return result;
    }

    public async download(id: string): Promise<any> {
        const result = await this.transport.download(`/api//downloadmngr/download/${id}`);
        return result;
    }
}
