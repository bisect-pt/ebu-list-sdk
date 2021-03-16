import { Transport } from './transport';

import { IFrameInfo } from './api/stream';

// ////////////////////////////////////////////////////////////////////////////

export default class Stream {
    public constructor(private readonly transport: Transport) {
        this.transport = transport;
    }

    //Video
    public async getFramesFromStream(pcapID: string, streamID: string | undefined): Promise<IFrameInfo[]> {
        const response = await this.transport.get(`/api/pcap/${pcapID}/stream/${streamID}/frames`);
        const frames: IFrameInfo[] = response as IFrameInfo[];
        return frames;
    }

    public getUrlForFrame(pcapID: string, streamID: string | undefined, timestamp: string) {
        return this.transport.rest.getAuthUrl(`/api/pcap/${pcapID}/stream/${streamID}/frame/${timestamp}/png`);
    }

    //Video Graphs - Cinst Line Chart
    public async getCInstForStream(
        pcapID: string,
        streamID: string | undefined,
        fromNs: string | undefined,
        toNs: string | undefined
    ): Promise<any> {
        const response = await this.transport.get(
            `/api/pcap/${pcapID}/stream/${streamID}/analytics/CInst?from=${fromNs}&to=${toNs}`
        );
        const cinstData: any = response;
        return cinstData;
    }

    //Video Graphs - Vrx Line Chart
    public async getVrxIdealForStream(
        pcapID: string,
        streamID: string | undefined,
        fromNs: string | undefined,
        toNs: string | undefined,
        groupByNanoseconds?: any
    ): Promise<any> {
        const groupBy = groupByNanoseconds ? `&groupByNanoseconds=${groupByNanoseconds}` : '';
        const response = await this.transport.get(
            `/api/pcap/${pcapID}/stream/${streamID}/analytics/VrxIdeal?from=${fromNs}&to=${toNs}${groupBy}`
        );
        const vrxData: any = response;
        return vrxData;
    }

    //Video Graphs - FTP Line Chart
    public async getDeltaToIdealTpr0Raw(
        pcapID: string,
        streamID: string | undefined,
        fromNs: string | undefined,
        toNs: string | undefined
    ): Promise<any> {
        const response = await this.transport.get(
            `/api/pcap/${pcapID}/stream/${streamID}/analytics/DeltaToIdealTpr0Raw?from=${fromNs}&to=${toNs}`
        );
        const ftpData: any = response;
        return ftpData;
    }

    //Video Graphs - RTP Latency Line Chart
    public async getDeltaPacketTimeVsRtpTimeRaw(
        pcapID: string,
        streamID: string | undefined,
        fromNs: string | undefined,
        toNs: string | undefined
    ): Promise<any> {
        const response = await this.transport.get(
            `/api/pcap/${pcapID}/stream/${streamID}/analytics/DeltaPacketTimeVsRtpTimeRaw?from=${fromNs}&to=${toNs}`
        );
        const latencyData: any = response;
        return latencyData;
    }

    //Video Graphs - RTP Offset Line Chart
    public async getDeltaRtpVsNtRaw(
        pcapID: string,
        streamID: string | undefined,
        fromNs: string | undefined,
        toNs: string | undefined
    ): Promise<any> {
        const response = await this.transport.get(
            `/api/pcap/${pcapID}/stream/${streamID}/analytics/DeltaRtpVsNt?from=${fromNs}&to=${toNs}`
        );
        const rtpOffsetData: any = response;
        return rtpOffsetData;
    }

    //Video Graphs - RTP Time Step Line Chart
    public async getDeltaToPreviousRtpTsRaw(
        pcapID: string,
        streamID: string | undefined,
        fromNs: string | undefined,
        toNs: string | undefined
    ): Promise<any> {
        const response = await this.transport.get(
            `/api/pcap/${pcapID}/stream/${streamID}/analytics/DeltaToPreviousRtpTsRaw?from=${fromNs}&to=${toNs}`
        );
        const rtpOffsetData: any = response;
        return rtpOffsetData;
    }

    //Audio
    public async renderMp3(pcapID: string, streamID: string | undefined, channelsString: string): Promise<any> {
        const response = await this.transport.get(
            `/api/pcap/${pcapID}/stream/${streamID}/rendermp3?channels=${channelsString}`
        );
        const render: any = response;
        return render;
    }

    public downloadMp3Url(pcapID: string, streamID: string | undefined, channelsString?: string) {
        return this.transport.rest.getAuthUrl(
            `/api/pcap/${pcapID}/stream/${streamID}/downloadmp3${channelsString ? `?channels=${channelsString}` : ''}`
        );
    }

    //Ancillary
    public downloadAncillaryUrl(pcapID: string, streamID: string | undefined, filename: string) {
        return this.transport.rest.getAuthUrl(`/api/pcap/${pcapID}/stream/${streamID}/ancillary/${filename}`);
    }

    public async downloadText(path: string): Promise<any> {
        const response = await this.transport.getText(`${path}`);
        const text: any = response;
        return text;
    }
}
