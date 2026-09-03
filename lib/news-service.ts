// News service for fetching and processing local news

import { LocalNews } from './bento-types';

export interface NewsFilters {
  municipality?: string;
  state?: string;
  category?: string;
  limit?: number;
  offset?: number;
}

/**
 * Fetch local news
 */
export async function fetchLocalNews(filters: NewsFilters): Promise<LocalNews[]> {
  try {
    const queryParams = new URLSearchParams();

    if (filters.municipality) queryParams.append('municipality', filters.municipality);
    if (filters.state) queryParams.append('state', filters.state);
    if (filters.category) queryParams.append('category', filters.category);

    const response = await fetch(`/api/news/local?${queryParams}`);
    const data = await response.json();

    return data.news || [];
  } catch (error) {
    console.error('Error fetching local news:', error);
    return [];
  }
}

/**
 * Filter news by relevance to cooking session
 */
export function filterNewsByCookingContext(
  news: LocalNews[],
  recipeName: string,
  cookingStep: number,
): LocalNews[] {
  // Keywords related to food policy and legislation
  const foodPolicyKeywords = ['alimento', 'receita', 'segurança', 'mercado', 'restaurante', 'culinária'];

  return news.filter((item) => {
    const fullText = `${item.title} ${item.description}`.toLowerCase();
    return foodPolicyKeywords.some((keyword) => fullText.includes(keyword));
  });
}

/**
 * Calculate news impact level
 */
export function calculateNewsImpact(news: LocalNews): 'high' | 'medium' | 'low' {
  if (news.category === 'legislation') return 'high';
  if (news.category === 'budget') return 'medium';
  return 'low';
}

/**
 * Format news for voice reading
 */
export function formatNewsForVoice(news: LocalNews): string {
  return `Notícia: ${news.title}. ${news.description}`;
}

/**
 * Group news by category
 */
export function groupNewsByCategory(
  news: LocalNews[],
): Record<string, LocalNews[]> {
  const grouped: Record<string, LocalNews[]> = {};

  news.forEach((item) => {
    if (!grouped[item.category]) {
      grouped[item.category] = [];
    }
    grouped[item.category].push(item);
  });

  return grouped;
}

/**
 * Get news relevant to current user
 */
export function getRelevantNews(
  allNews: LocalNews[],
  userMunicipality: string,
  userState: string,
): LocalNews[] {
  return allNews.filter(
    (news) =>
      news.municipality === userMunicipality &&
      news.state === userState,
  );
}

/**
 * Sort news by recency
 */
export function sortNewsByRecency(news: LocalNews[]): LocalNews[] {
  return [...news].sort(
    (a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime(),
  );
}

/**
 * Assign news to cooking steps
 */
export function assignNewsToCookingSteps(
  news: LocalNews[],
  totalSteps: number,
): Map<number, LocalNews[]> {
  const assignment = new Map<number, LocalNews[]>();

  const sortedNews = sortNewsByRecency(news);
  const newsPerStep = Math.ceil(sortedNews.length / totalSteps);

  sortedNews.forEach((newsItem, index) => {
    const stepNumber = Math.min(Math.floor(index / newsPerStep) + 1, totalSteps);
    if (!assignment.has(stepNumber)) {
      assignment.set(stepNumber, []);
    }
    assignment.get(stepNumber)!.push(newsItem);
  });

  return assignment;
}

/**
 * Check if news is breaking/urgent
 */
export function isBreakingNews(news: LocalNews, minutesThreshold: number = 120): boolean {
  const now = new Date().getTime();
  const publishedTime = new Date(news.publishedDate).getTime();
  const diffMinutes = (now - publishedTime) / (1000 * 60);

  return diffMinutes <= minutesThreshold;
}

/**
 * Get most impactful news stories
 */
export function getMostImpactfulNews(news: LocalNews[], limit: number = 3): LocalNews[] {
  return [...news]
    .filter((item) => item.category === 'legislation' || item.category === 'budget')
    .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
    .slice(0, limit);
}
