export type TopicCategory = 'learn' | 'observe' | 'practice-board' | 'pro-only-awareness';

export type TopicDifficulty = 1 | 2 | 3 | 4 | 5;

export type ResourceType = 'video' | 'playlist' | 'search';

export type TopicResource = {
  id: string;
  title: string;
  providerOrChannel?: string;
  url: string;
  type: ResourceType;
  notes: string;
  safetyDisclaimer: string;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  answer: string;
  explanation: string;
};

export type CurriculumModule = {
  id: string;
  title: string;
  order: number;
  summary: string;
};

export type Topic = {
  id: string;
  moduleId: string;
  title: string;
  difficulty: TopicDifficulty;
  category: TopicCategory;
  estimatedMinutes: number;
  summary: string;
  lesson: string;
  learningObjectives: string[];
  checklist: string[];
  safetyNotes: string[];
  callProIf: string[];
  youtubeResources: TopicResource[];
  searchQueries: string[];
  prerequisites: string[];
  quizQuestions?: QuizQuestion[];
  completedAt: string | null;
  unlockedAt: string | null;
  isActive: boolean;
};

export type TopicStatus = 'active' | 'completed' | 'locked' | 'unlocked';
