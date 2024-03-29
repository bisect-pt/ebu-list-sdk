import { Transport } from '@bisect/bisect-core-ts';
import { IAnalysisProfiles } from './api/pcap';

// ////////////////////////////////////////////////////////////////////////////

export default class AnalysisProfile {
    public constructor(private readonly transport: Transport) {}

    public async getInfo(): Promise<IAnalysisProfiles> {
        const response = await this.transport.get(`/api/analysis_profile`);
        const allAnalysisProfiles: IAnalysisProfiles = response;
        return allAnalysisProfiles;
    }

    public async setDefault(id: string): Promise<any> {
        const response = await this.transport.put(`/api/analysis_profile/default`, { id });
        return response;
    }
}
