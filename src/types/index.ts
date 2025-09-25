// أنواع البيانات للإذاعة المدرسية - School Radio Types

export type Gender = 'boys' | 'girls';
export type EducationLevel = 'primary' | 'middle' | 'secondary';

export interface Topic {
  id: string;
  title: string;
  category: string;
  content: {
    introduction: string;
    quranVerse: {
      text: string;
      reference: string;
    };
    hadith: {
      text: string;
      reference: string;
    };
    didYouKnow: string;
    morningWord: string;
    poetry: string[];
    questions: {
      question: string;
      answer: string;
    }[];
    conclusion?: string;
    radioEnding: string;
  };
  adaptedContent?: {
    [key in EducationLevel]: {
      [key in Gender]: Partial<Topic['content']>;
    };
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