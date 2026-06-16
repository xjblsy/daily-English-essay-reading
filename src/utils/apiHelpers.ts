import type { Paper } from '../types';
import { ARXIV_KEYWORDS, ARXIV_API_BASE, ARXIV_MAX_RESULTS } from '../data/constants';

/**
 * 解析 arXiv Atom XML 响应为 Paper 数组
 */
export function parseArxivXml(xmlText: string): Paper[] {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
  const entries = xmlDoc.getElementsByTagName('entry');

  const papers: Paper[] = [];
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const title = entry.getElementsByTagName('title')[0]?.textContent?.trim() || '';
    const summary = entry.getElementsByTagName('summary')[0]?.textContent?.trim() || '';
    const published = entry.getElementsByTagName('published')[0]?.textContent?.split('T')[0] || '';
    const idLink = entry.getElementsByTagName('id')[0]?.textContent || '';

    const authorElems = entry.getElementsByTagName('author');
    const authors = Array.from(authorElems)
      .map(a => a.getElementsByTagName('name')[0]?.textContent)
      .filter(Boolean)
      .join(', ');

    const category = entry.getElementsByTagName('category')[0];
    const term = category?.getAttribute('term') || '';

    papers.push({
      id: `arxiv-${i}-${Date.now()}`,
      title,
      authors,
      abstract: summary.replace(/\s+/g, ' ').trim(),
      source: 'arxiv',
      category: categorizePaper(term),
      url: idLink,
      publishedDate: published,
      isTodayNew: true,
    });
  }

  return papers;
}

/**
 * 根据论文主题词判断分类
 */
export function categorizePaper(term: string): Paper['category'] {
  const lower = term.toLowerCase();
  if (
    lower.includes('nlp') ||
    lower.includes('computation') ||
    lower.includes('language') ||
    lower.includes('cl')
  )
    return 'nlp';
  if (
    lower.includes('learning') ||
    lower.includes('neural') ||
    lower.includes('ai') ||
    lower.includes('machine') ||
    lower.includes('lg') ||
    lower.includes('cv')
  )
    return 'ai';
  if (
    lower.includes('data') ||
    lower.includes('mining') ||
    lower.includes('distributed')
  )
    return 'bigdata';
  if (
    lower.includes('physics') ||
    lower.includes('quantum') ||
    lower.includes('particle')
  )
    return 'physics';
  if (
    lower.includes('chemistry') ||
    lower.includes('molecule') ||
    lower.includes('reaction')
  )
    return 'chemistry';
  if (
    lower.includes('math') ||
    lower.includes('algebra') ||
    lower.includes('geometry')
  )
    return 'mathematics';
  if (
    lower.includes('philosophy') ||
    lower.includes('history') ||
    lower.includes('humanities')
  )
    return 'humanities';
  if (
    lower.includes('art') ||
    lower.includes('creativity') ||
    lower.includes('music')
  )
    return 'art';
  return 'bigdata';
}

/**
 * 从 arXiv API 获取论文数据
 */
export async function fetchPapersFromArxiv(keyword: string): Promise<Paper[]> {
  try {
    const query = encodeURIComponent(`all:${keyword}`);
    const url = `${ARXIV_API_BASE}?search_query=${query}&start=0&max_results=${ARXIV_MAX_RESULTS}&sortBy=submittedDate&sortOrder=descending`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const xmlText = await response.text();
    return parseArxivXml(xmlText);
  } catch (error) {
    console.warn('Failed to fetch from arXiv:', error);
    return [];
  }
}

/**
 * 使用多个关键词获取论文并去重
 */
export async function fetchAllPapers(): Promise<Paper[]> {
  const allPapers: Paper[] = [];
  const seenIds = new Set<string>();

  for (const keyword of ARXIV_KEYWORDS.primary) {
    const papers = await fetchPapersFromArxiv(keyword);
    for (const paper of papers) {
      if (!seenIds.has(paper.title)) {
        seenIds.add(paper.title);
        allPapers.push(paper);
      }
    }
  }

  return allPapers;
}
