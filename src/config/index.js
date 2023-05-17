class Config {
  ELSIE_ADMIN_SERVER_URL
  NODE_ENV
  static instance

  constructor() {
    this.ELSIE_ADMIN_SERVER_URL = process.env.NEXT_PUBLIC_ELISE_ADMIN_SERVER_URL
    this.NODE_ENV = process.env.NODE_ENV
  }

  static getInstance() {
    if (!Config.instance) {
      Config.instance = new Config()
    }
    return Config.instance
  }
}

export const config = new Config()
