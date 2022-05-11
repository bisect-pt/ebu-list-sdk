export const analysisConstants = {
    outcome: {
        not_compliant: 'not_compliant',
        compliant: 'compliant',
        disabled: 'disabled'
    },
    errors: {
        invalid_rtp_ts_vs_nt: 'errors.invalid_rtp_ts_vs_nt',
    },
    warnings: {
        pcap: {
            truncated: 'warnings.pcap.truncated',
        },
    },
    analysesNames: {
        rtp_ts_vs_nt: 'Delta between RTP timestamps and (N x Tframe) in ticks',
        packet_ts_vs_rtp_ts: 'Delta between packet capture timestamps and RTP timestamps in ns',
        inter_frame_rtp_ts_delta: 'Inter-frame RTP timestamps delta',
        rtp_sequence: 'RTP sequence',
        '2110_21_cinst': 'SMPTE 2110-21 (Cinst)',
        '2110_21_vrx': 'SMPTE 2110-21 (VRX)',
        tsdf: 'EBU TS-DF',
        destination_multicast_mac_address: 'Destination Multicast MAC address',
        destination_multicast_ip_address: 'Destination Multicast IP address',
        unrelated_multicast_addresses: 'Multicast MAC and IP addresses mapping',
        unique_multicast_destination_ip_address: 'Unique destination Multicast IP address',
        ttml_time_base_is_media: 'TTML timeBase is "media"',
        ttml_consistent_sequence_identifier: 'TTML consistent sequence identifier',
        ttml_inconsistent_sequence_identifier: 'TTML inconsistent sequence identifier',
        pkts_per_frame: 'RTP packets per frame/field',
        marker_bit: 'RTP marker bit',
        field_bits: 'Field bits',
        anc_payloads: 'Ancillary payloads',
        mac_address_analysis: "Repeated MAC addresses"
    },
};

export const measurements = {
    C_INST: 'CInst',
    C_INST_RAW: 'CInstRaw',
    C_INST_GROUPED: 'CInstGrouped',
    VRX_IDEAL: 'VrxIdeal',
    VRX_IDEAL_RAW: 'VrxIdealRaw',
    VRX_IDEAL_GROUPED: 'VrxIdealGrouped',
    DELTA_TO_IDEAL_TPR0: 'DeltaToIdealTpr0',
    DELTA_TO_IDEAL_TPR0_RAW: 'DeltaToIdealTpr0Raw',
    DELTA_TO_IDEAL_TPR0_GROUPED: 'DeltaToIdealTpr0Grouped',
    DELTA_RTP_TS_VS_PACKET_TS: 'DeltaRtpTsVsPacketTs',
    DELTA_RTP_TS_VS_PACKET_TS_RAW: 'DeltaRtpTsVsPacketTsRaw',
    DELTA_RTP_TS_VS_PACKET_TS_GROUPED: 'DeltaRtpTsVsPacketTsGrouped',
    DELTA_TO_PREVIOUS_RTP_TS: 'DeltaToPreviousRtpTs',
    DELTA_TO_PREVIOUS_RTP_TS_RAW: 'DeltaToPreviousRtpTsRaw',
    DELTA_TO_PREVIOUS_RTP_TS_GROUPED: 'DeltaToPreviousRtpTsGrouped', //was min max
    DELTA_RTP_VS_NT: 'DeltaRtpVsNt',
    DELTA_RTP_VS_NT_RAW: 'DeltaRtpVsNtRaw',
    DELTA_RTP_VS_NT_TICKS_GROUPED: 'DeltaRtpVsNtGrouped', //was min max
    DELTA_PACKET_TIME_VS_RTP_TIME: 'DeltaPacketTimeVsRtpTime',
    DELTA_PACKET_TIME_VS_RTP_TIME_RAW: 'DeltaPacketTimeVsRtpTimeRaw',
    DELTA_PACKET_TIME_VS_RTP_TIME_GROUPED: 'DeltaPacketTimeVsRtpTimeGrouped',
    AUDIO_PKT_TS_VS_RTP_TS: 'AudioPktTsVsRtpTs',
    AUDIO_PKT_TS_VS_RTP_TS_RAW: 'AudioPktTsVsRtpTsRaw',
    AUDIO_PKT_TS_VS_RTP_TS_GROUPED: 'AudioPktTsVsRtpTsGrouped',
    AUDIO_TIME_STAMPED_DELAY_FACTOR: 'AudioTimeStampedDelayFactor'
};