import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper {
    private _client?: Stan;

    get client () {
        if (!this._client) {
            throw new Error('Cannot access NATS client before connect');
        }
        return this._client;
    }

    connect (clusterID: string, clientID: string, url: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this._client = nats.connect(clusterID, clientID, { url });
            this._client.on('connect', () => {
                resolve();
            });

            this._client.on('error', (err) => {
                reject(err);
            });
        })
    }

    getClient () {
        return this._client;
    }
}

const natsWrapper = new NatsWrapper();
export { natsWrapper };