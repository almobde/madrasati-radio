// أنواع البيانات للإذاعة المدرسية - School Radio Types

export type Gender = 'boys' | 'girls';
export type EducationLevel = 'primary' | 'middle' | 'secondary';

export interface Topic {
  id: string;
  title: string;
  category: string;
  content: {
    introduction: {
      primary: string;
      middle: string;
      secondary: string;
    };
    quranVerse: {
      text: string;
      reference: string;
    };
    hadith: {
      text: string;
      reference: string;
    };
    didYouKnow: {
      primary: string[];
      middle: string[];
      secondary: string[];
    };
    morningWord: {
      primary: string;
      middle: string;
      secondary: string;
    };
    poetry: {
      primary: string[];
      middle: string[];
      secondary: string[];
    };
    questions: {
      primary: Array<{ question: string; answer: string }>;
      middle: Array<{ question: string; answer: string }>;
      secondary: Array<{ question: string; answer: string }>;
    };
    conclusion?: string;
    radioEnding: string;
  };
}

export interface UserPreferences {
  gender: Gender;
  educationLevel: EducationLevel;
}

export interface AppState {
  preferences: UserPreferences | null;
  currentTopic: Topic | null;
}