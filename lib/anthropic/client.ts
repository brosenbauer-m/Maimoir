import Anthropic from '@anthropic-ai/sdk'

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export const CHAT_MODEL = 'claude-sonnet-4-5'
export const FAST_MODEL = 'claude-haiku-4-5'
