import { createRoastPrompt } from '../prompts/roast-prompt.js'
import GeminiProvider from '../providers/gemini.js'

export default class AIService {
  static init() {
    this.provider = new GeminiProvider()
  }

  static chat(prompt) {
    return this.provider.chat(prompt)
  }

  static roastPlayer(playerData) {
    const roastPrompt = createRoastPrompt(playerData)
    return this.chat(roastPrompt)
  }
}
