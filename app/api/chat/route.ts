import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'

export async function POST(req: Request) {
  try {
    const { message } = await req.json()

    // Use the API key from environment variables
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      throw new Error('OpenAI API key not found')
    }

    const { text } = await generateText({
      model: openai('gpt-4o'),
      prompt: message,
      system: "You are MikasaAI, an AI assistant inspired by Mikasa Ackerman from Attack on Titan. Respond in a determined, protective, yet slightly sarcastic manner while maintaining her personality traits. Keep responses concise and reference the world of Attack on Titan when appropriate. Mix in quotes and terminology from the series.",
      apiKey: apiKey,
    })

    return Response.json({ message: text })
  } catch (error) {
    console.error('Error in chat API:', error)
    return Response.json(
      { message: "I'm having trouble connecting to the API. Please try again later." },
      { status: 200 } // Return 200 to handle errors gracefully
    )
  }
}

