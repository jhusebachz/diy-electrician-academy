import type { TopicResource } from '@/domain/types';

const YOUTUBE_SEARCH_BASE = 'https://www.youtube.com/results?search_query=';

export const suggestedSearchQueries = [
  'home electrical basics beginner',
  'residential electrical safety basics',
  'electrician trade school basics',
  "Ohm's Law explained beginner",
  'voltage current resistance power explained',
  'how a breaker panel works overview no panel work',
  'GFCI outlet explained',
  'AFCI breaker explained',
  'how to use a multimeter safely beginner',
  'non contact voltage tester explained',
  'single pole switch explained',
  'three way switch explained animation',
  'residential wiring basics trade school',
  'electrician apprenticeship math basics',
  'electrical safety for homeowners',
  'how to map breakers to outlets safely',
];

export function youtubeSearchResource(id: string, title: string, query: string): TopicResource {
  return {
    id,
    title,
    providerOrChannel: 'YouTube search',
    url: `${YOUTUBE_SEARCH_BASE}${encodeURIComponent(query)}`,
    type: 'search',
    notes: `Search link for: ${query}. Results are not manually verified.`,
    safetyDisclaimer:
      'Use search results for conceptual learning only. Do not follow instructions for live, panel, service, or permit-required work.',
  };
}

export const safetyInstitutionResources: TopicResource[] = [
  {
    id: 'osha-electrical',
    title: 'OSHA electrical safety topics',
    providerOrChannel: 'OSHA',
    url: 'https://www.osha.gov/electrical',
    type: 'video',
    notes: 'Institutional safety overview and references.',
    safetyDisclaimer:
      'Regulatory guidance is not a substitute for local code, permits, inspections, or licensed electricians.',
  },
  {
    id: 'esfi-home-safety',
    title: 'ESFI home electrical safety',
    providerOrChannel: 'Electrical Safety Foundation International',
    url: 'https://www.esfi.org/',
    type: 'video',
    notes: 'Consumer-focused electrical safety organization.',
    safetyDisclaimer:
      'Use for safety awareness. Stop and call a licensed electrician when hazards or uncertainty appear.',
  },
  {
    id: 'nfpa-electrical',
    title: 'NFPA electrical safety information',
    providerOrChannel: 'NFPA',
    url: 'https://www.nfpa.org/',
    type: 'video',
    notes: 'Public safety and code organization home page.',
    safetyDisclaimer: 'Local adopted code and authority having jurisdiction decide requirements.',
  },
];
