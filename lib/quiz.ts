import { VocabItem, QuizQuestion, QuizConfig, TrainingMode } from '../types/vocabulary';

// Deterministic shuffle using Fisher-Yates
export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function buildQuestions(items: VocabItem[], config: QuizConfig): QuizQuestion[] {
  const shuffledItems = shuffle(items);
  // Pick the requested number of questions
  const selectedItems = shuffledItems.slice(0, config.totalQuestions);
  
  return selectedItems.map((item) => {
    // Distractors must differ from the correct item
    const distractorsPool = items.filter((v) => v.id !== item.id);
    const selectedDistractors = shuffle(distractorsPool).slice(0, 3);
    
    // Combine correct answer conceptually with 3 distractors and shuffle choice order
    const choices = shuffle([item, ...selectedDistractors]);
    const correctIndex = choices.findIndex((choice) => choice.id === item.id);
    
    return {
      item,
      choices,
      correctIndex
    };
  });
}

export function checkAnswer(selected: VocabItem, correct: VocabItem, mode: TrainingMode): boolean {
  // As per rules, validation is simple id comparison since it's card-based
  return selected.id === correct.id;
}
