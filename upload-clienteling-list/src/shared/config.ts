import * as dotenv from 'dotenv'

dotenv.config({ path: `./config/.env.${process.env.STAGE}` })
dotenv.config({ path: `./config/secrets/secrets.env` })

class Config {
    public elsie_server_url?: string
    private static instance: Config

    public constructor() {
        this.elsie_server_url = process.env.ELISE_SERVER_URL
    }

    public static getInstance(): Config {
        if (!Config.instance) {
            Config.instance = new Config();
        }
        return Config.instance;
    }
}

export const config = new Config()
