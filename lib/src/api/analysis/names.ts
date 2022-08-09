export enum AnalysisNames {
    packet_ts_vs_rtp_ts = 'packet_ts_vs_rtp_ts',
}

export const makeAnalysisName = (name: AnalysisNames) => `analyses.${name}`;
