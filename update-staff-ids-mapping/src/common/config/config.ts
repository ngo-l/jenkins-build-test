class GlobalConfig {
  public stage: string
  public yammerToken: string

  constructor() {
    this.stage = process.env.STAGE || 'development'
    this.yammerToken = process.env.YAMMER_TOKEN
  }
}

export const globalConfig = new GlobalConfig()
