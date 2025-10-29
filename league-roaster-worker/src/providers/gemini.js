import { GoogleGenAI } from '@google/genai'
import { ConfigService } from '../services/config.js'

export class GeminiProvider {
  constructor() {
    const apiKey = ConfigService.get('AI_API_KEY')
    this.googleGenAi = new GoogleGenAI({ apiKey })
  }

  async chat(prompt) {
    const response = await this.googleGenAi.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    })
    return response.text
  }
}
