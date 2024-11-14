import { GoogleGenerativeAI } from '@google/generative-ai'
import { GoogleGenerativeAIStream, StreamingTextResponse } from 'ai'

// Ensure you have GOOGLE_API_KEY in your .env.local file
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '')

export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const geminiStream = await genAI.getGenerativeModel({ model: "gemini-pro" })
    .generateContentStream({
      contents: [{ role: 'user', parts: [{ text: messages[messages.length - 1].content }] }],
    })

  const stream = GoogleGenerativeAIStream(geminiStream)

  return new StreamingTextResponse(stream)
}