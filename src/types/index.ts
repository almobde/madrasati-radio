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
    quranVerses: Array<{
      text: string;
      reference: string;
    }>;
    hadiths: Array<{
      text: string;
      reference: string;
    }>;
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
    miscellaneous: {
      primary: Array<{ type: 'story' | 'dua' | 'medical' | 'topic'; title: string; content: string }>;
      middle: Array<{ type: 'story' | 'dua' | 'medical' | 'topic'; title: string; content: string }>;
      secondary: Array<{ type: 'story' | 'dua' | 'medical' | 'topic'; title: string; content: string }>;
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