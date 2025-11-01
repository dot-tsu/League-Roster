import { createRoastPrompt } from '../prompts/language-prompts.js'
import GeminiProvider from '../providers/gemini.js'

export default class AIService {
  static init() {
    this.provider = new GeminiProvider()
  }

  static chat(prompt) {
    return this.provider.chat(prompt)
  }

  static roastPlayer(playerData, language = 'en') {
    const roastPrompt = createRoastPrompt(playerData, language)
    return this.chat(roastPrompt)
  }
}
