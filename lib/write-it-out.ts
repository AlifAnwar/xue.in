import type { VocabItem, WriteItOutMode } from "@/types/vocabulary";

const LEGACY_TONE_MARKS: Record<string, string> = {
  ă: "ǎ",
  Ă: "Ǎ",
  ĭ: "ǐ",
  Ĭ: "Ǐ",
  ŏ: "ǒ",
  Ŏ: "Ǒ",
  ŭ: "ǔ",
  Ŭ: "Ǔ",
};

const TONE_MARKS: Record<string, readonly string[]> = {
  a: ["a", "ā", "á", "ǎ", "à"],
  e: ["e", "ē", "é", "ě", "è"],
  i: ["i", "ī", "í", "ǐ", "ì"],
  o: ["o", "ō", "ó", "ǒ", "ò"],
  u: ["u", "ū", "ú", "ǔ", "ù"],
  ü: ["ü", "ǖ", "ǘ", "ǚ", "ǜ"],
};

const SIMPLIFIED_TO_TRADITIONAL: Record<string, string> = {
  们: "們",
  国: "國",
  湾: "灣",
  话: "話",
  时: "時",
  现: "現",
  岁: "歲",
  个: "個",
  觉: "覺",
  欢: "歡",
  电: "電",
  脑: "腦",
  师: "師",
  买: "買",
  学: "學",
  习: "習",
  么: "麼",
  东: "東",
  车: "車",
  钱: "錢",
  贵: "貴",
  难: "難",
  还: "還",
  过: "過",
  听: "聽",
  写: "寫",
  见: "見",
  里: "裡",
  儿: "兒",
  几: "幾",
  块: "塊",
  请: "請",
  问: "問",
  对: "對",
  书: "書",
  开: "開",
  给: "給",
  后: "後",
  两: "兩",
  点: "點",
  笔: "筆",
  说: "說",
  这: "這",
};

function replaceLegacyToneMarks(value: string): string {
  return Array.from(value, (character) => LEGACY_TONE_MARKS[character] ?? character).join("");
}

function applyToneMark(syllable: string, tone: number): string {
  const normalizedSyllable = syllable
    .toLowerCase()
    .replaceAll("u:", "ü")
    .replaceAll("v", "ü");

  if (tone === 5 || tone === 0) {
    return normalizedSyllable;
  }

  const vowels = Array.from(normalizedSyllable);
  let toneIndex = vowels.findIndex((character) => character === "a");

  if (toneIndex === -1) {
    toneIndex = vowels.findIndex((character) => character === "e");
  }

  if (toneIndex === -1) {
    const ouIndex = normalizedSyllable.indexOf("ou");
    toneIndex = ouIndex >= 0 ? ouIndex : -1;
  }

  if (toneIndex === -1) {
    for (let index = vowels.length - 1; index >= 0; index -= 1) {
      if (TONE_MARKS[vowels[index]]) {
        toneIndex = index;
        break;
      }
    }
  }

  if (toneIndex === -1) {
    return normalizedSyllable;
  }

  const vowel = vowels[toneIndex];
  vowels[toneIndex] = TONE_MARKS[vowel]?.[tone] ?? vowel;
  return vowels.join("");
}

export function numberedPinyinToToneMarks(value: string): string {
  return replaceLegacyToneMarks(value).replace(
    /([a-zA-ZüÜvV:]+)([0-5])/g,
    (_, syllable: string, tone: string) => applyToneMark(syllable, Number(tone)),
  );
}

export function normalizePinyin(value: string): string {
  return numberedPinyinToToneMarks(value)
    .toLowerCase()
    .normalize("NFC")
    .replaceAll("u:", "ü")
    .replaceAll("v", "ü")
    .replace(/[\s'’·-]/g, "");
}

export function displayPinyin(value: string): string {
  return replaceLegacyToneMarks(value).trim();
}

function optionalVariants(value: string): string[] {
  const match = value.match(/^(.*?)\((.*?)\)(.*)$/);
  if (!match) {
    return [value];
  }

  const [, before, optional, after] = match;
  const withoutOptional = `${before}${after}`;
  const variants = [withoutOptional];

  if (optional.trim()) {
    variants.push(`${before}${optional}${after}`);
  }

  return variants;
}

export function getHanziAnswers(item: VocabItem): string[] {
  const answers = item.hanzi
    .split("/")
    .flatMap(optionalVariants)
    .map((answer) => answer.replace(/[^\p{Script=Han}]/gu, ""))
    .filter(Boolean);

  return Array.from(new Set(answers));
}

export function getPinyinAnswers(item: VocabItem): string[] {
  const answers = item.pinyin
    .split("/")
    .flatMap(optionalVariants)
    .map(normalizePinyin)
    .filter(Boolean);

  return Array.from(new Set(answers));
}

export function getAcceptedAnswers(item: VocabItem, mode: WriteItOutMode): string[] {
  return mode === "hanzi-to-pinyin" ? getPinyinAnswers(item) : getHanziAnswers(item);
}

export function isWritingAnswerCorrect(
  answer: string,
  item: VocabItem,
  mode: WriteItOutMode,
): boolean {
  const normalizedAnswer =
    mode === "hanzi-to-pinyin"
      ? normalizePinyin(answer)
      : answer.replace(/\s/g, "");

  return getAcceptedAnswers(item, mode).includes(normalizedAnswer);
}

export function isSimplifiedEquivalent(answer: string, item: VocabItem): boolean {
  const converted = Array.from(answer.replace(/\s/g, ""), (character) => {
    return SIMPLIFIED_TO_TRADITIONAL[character] ?? character;
  }).join("");

  return converted !== answer && getHanziAnswers(item).includes(converted);
}
