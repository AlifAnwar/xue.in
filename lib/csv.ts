import fs from 'fs';
import path from 'path';
import { VocabItem } from '../types/vocabulary';

let cachedVocabItems: VocabItem[] | null = null;

export function getVocabularyItems(): VocabItem[] {
  if (cachedVocabItems) {
    return cachedVocabItems;
  }

  const filePath = path.join(process.cwd(), 'assets', 'data', 'datamandarin.csv');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  
  const lines = fileContent.split('\n');
  const items: VocabItem[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    
    const cols = trimmed.split(',');
    const id = parseInt(cols[0], 10);
    
    // Check if it's a valid data row (starts with a number)
    if (!isNaN(id) && cols.length >= 5) {
      items.push({
        id,
        hanzi: cols[1]?.trim() || '',
        pinyin: cols[2]?.trim() || '',
        partOfSpeech: cols[3]?.trim() || '',
        indonesian: cols.slice(4).join(',').trim() || ''
      });
    }
  }

  cachedVocabItems = items;
  return cachedVocabItems;
}
