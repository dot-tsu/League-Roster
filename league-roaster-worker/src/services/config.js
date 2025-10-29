import { env } from 'hono/adapter'

export class ConfigService {
  static init(context) {
    this.context = context
  }

  static get(key) {
    const envVars = env(this.context)
    return envVars[key]
  }

  static getAll() {
    return env(this.context)
  }
}
