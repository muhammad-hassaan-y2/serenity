import prisma from './prsima'
import { StudyProfile, QuizProfile } from '@prisma/client'

export async function saveProfile(userId: string, profile: StudyProfile | QuizProfile) {
  if ('goals' in profile) {
    return await prisma.studyProfile.upsert({
      where: { userId },
      update: profile,
      create: { ...profile, userId },
    })
  } else {
    return await prisma.quizProfile.upsert({
      where: { userId },
      update: profile,
      create: { ...profile, userId },
    })
  }
}

export async function getProfile(userId: string, mode: 'study' | 'quiz') {
  if (mode === 'study') {
    return await prisma.studyProfile.findUnique({ where: { userId } })
  } else {
    return await prisma.quizProfile.findUnique({ where: { userId } })
  }
}