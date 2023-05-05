class GlobalConfig {
  public stage: string

  constructor() {
    this.stage = process.env.STAGE || 'development'
  }
}

export const globalConfig = new GlobalConfig()
