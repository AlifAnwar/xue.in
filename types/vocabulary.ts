export interface VocabItem {
  id: number
  hanzi: string
  pinyin: string
  partOfSpeech: string
  indonesian: string
}

export type TrainingMode = "hanzi-to-id" | "id-to-hanzi"

export interface QuizQuestion {
  item: VocabItem
  choices: VocabItem[]
  correctIndex: number
}

export interface QuizConfig {
  mode: TrainingMode
  totalQuestions: number
}

export interface QuizResult {
  question: QuizQuestion
  selectedIndex: number | null
  isCorrect: boolean
}
