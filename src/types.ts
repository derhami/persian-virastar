export interface VirastarOptionMeta {
  key: string;
  nameFa: string;
  descriptionFa: string;
  category: 'halfSpace' | 'numbers' | 'punctuation' | 'spacing' | 'cleanup' | 'markdown';
  defaultValue: boolean;
}

export interface VirastarOptions {
  [key: string]: boolean;
}

export type PresetMode = 'default' | 'max' | 'literary' | 'academic' | 'minimal' | 'custom';

export type ThemeStyle = 'swiss' | 'nature';

export interface TextStats {
  chars: number;
  charsNoSpace: number;
  words: number;
  lines: number;
  sentences: number;
  paragraphs: number;
  readingTimeMinutes: number;
}

export interface DiffStats {
  additionsCount: number;
  deletionsCount: number;
  halfSpacesAdded: number;
  digitsConverted: number;
  punctuationsFixed: number;
  changedPercent: number;
}

export type DiffChangeType = 'unchanged' | 'added' | 'removed' | 'halfspace';

export interface DiffToken {
  type: DiffChangeType;
  value: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  title: string;
  inputText: string;
  outputText: string;
  stats: TextStats;
}

export type AiMode = 'proofread' | 'tone' | 'summarize' | 'simplify' | 'custom';

export type AiTone = 'رسمی و اداری' | 'ادبی و فاخر' | 'محاوره‌ای و صمیمی' | 'علمی و دانشگاهی' | 'مطبوعاتی و خبری' | 'کودک و نوجوان';

export interface SampleText {
  id: string;
  title: string;
  description: string;
  category: 'اداری' | 'ادبی' | 'علمی' | 'پر اشکال';
  content: string;
}
