import { LIST } from '@bisect/ebu-list-sdk';
import { IArgs } from '../../types';
import fs from 'fs';

const doUpload = async (list: LIST, stream: fs.ReadStream): Promise<string> =>
    new Promise(async (resolve, reject) => {
        const wsClient = list.wsClient;
        if (wsClient === undefined) {
            reject(new Error('WebSocket client not connected'));
            return;
        }

        let pcapId: string | undefined = undefined;
        let messages: any[] = [];

        const handleMessage = (msg: any) => {
            messages.push(msg);
            if (pcapId !== undefined) {
                const x = pcapId;
                messages.forEach(msg => processMessage(x, msg));
                messages = [];
            }
        };

        wsClient.on('message', handleMessage);

        const processMessage = (actualPcapId: string, msg: any) => {
            console.log(JSON.stringify(msg));
            if (msg.event === 'PCAP_FILE_PROCESSING_DONE') {
                wsClient.off('message', handleMessage);
                resolve(actualPcapId);
            }
        };

        const uploadResult = await list.pcap.upload('A pcap file', stream);

        console.log('Upload returned');

        pcapId = uploadResult.uuid;

        if (pcapId !== undefined) {
            const x = pcapId;
            messages.forEach(msg => processMessage(x, msg));
            messages = [];
        }
    });

export const run = async (args: IArgs) => {
    if (!args._ || args._.length < 2) {
        throw new Error('No pcap file');
    }

    const pcapFile = args._[1];

    const list = new LIST(args.baseUrl);
    await list.login(args.username, args.password);

    const stream = fs.createReadStream(pcapFile);

    const pcapId = await doUpload(list, stream);

    console.log(`PCAP ID: ${pcapId}`);

    await list.close();
};
