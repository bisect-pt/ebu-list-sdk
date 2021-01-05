import { LIST } from '@bisect/ebu-list-sdk';
import { IArgs } from '../../types';

export const run = async (args: IArgs) => {
    const list = await LIST.connectWithOptions(args);
    try {
        console.log('Connected');
        const version = await list.info.getVersion();
        console.log(JSON.stringify(version));
    } catch (e) {
        console.log(`Error: ${JSON.stringify(e)}`);
    } finally {
        await list.close();
    }
};
