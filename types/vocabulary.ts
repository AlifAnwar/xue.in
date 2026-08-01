export interface VocabItem {
  id: number
  hanzi: string
  pinyin: string
  partOfSpeech: string
  indonesian: string
}

export type MultipleChoiceMode = "hanzi-to-id" | "id-to-hanzi"

export type WriteItOutMode = "hanzi-to-pinyin" | "pinyin-to-hanzi"

export type TrainingMode = MultipleChoiceMode | WriteItOutMode

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
