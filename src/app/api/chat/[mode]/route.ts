import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'
import { getProfile } from '@/lib/profile'
import prisma from '@/lib/prisma'
import { getEmbedding } from '@/lib/embeddings'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '')

export async function POST(req: NextRequest, { params }: { params: { mode: string } }) {
  try {
    const { messages, userPreferences, userId } = await req.json()
    const mode = params.mode as 'study' | 'quiz'

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const profile = await getProfile(userId, mode)

    const chat = model.startChat({
      history: messages.map((m: any) => ({
        role: m.role,
        parts: m.content,
      })),
      generationConfig: {
        maxOutputTokens: 1000,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    })

    const lastMessage = messages[messages.length - 1].content
    const embedding = await getEmbedding(lastMessage)

    const similarMessages = await prisma.vectorEmbedding.findMany({
      where: {
        embedding: {
          vectorSearch: embedding,
        },
      },
      take: 5,
    })

    const context = similarMessages.map(m => m.content).join('\n')

    const prompt = `
      Mode: ${mode}
      User Preferences: ${JSON.stringify(userPreferences)}
      User Profile: ${JSON.stringify(profile)}
      Context: ${context}
      
      Based on the above information, please provide a personalized response to the following message:
      ${lastMessage}
    `

    const result = await chat.sendMessage(prompt)
    const response = await result.response
    const text = response.text()

    // Save the response for future context
    await prisma.vectorEmbedding.create({
      data: {
        content: text,
        embedding: embedding,
      },
    })

    return NextResponse.json({ role: 'assistant', content: text })
  } catch (error) {
    console.error(`Error in ${params.mode} chat:`, error)
    return NextResponse.json({ error: 'An error occurred while processing your request.' }, { status: 500 })
  }
}