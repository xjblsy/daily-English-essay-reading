import type { Paper } from '../types';
import { ARXIV_API_BASE, ARXIV_MAX_RESULTS } from './constants';

// 精选论文数据（fallback 数据，当 API 不可用时使用）
export const fallbackPapers: Paper[] = [
  {
    id: 'paper-001',
    title: 'Attention Is All You Need',
    authors: 'Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Lukasz Kaiser, Illia Polosukhin',
    abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.',
    source: 'arxiv',
    category: 'nlp',
    url: 'https://arxiv.org/abs/1706.03762',
    publishedDate: '2024-06-12',
    isTodayNew: true,
  },
  {
    id: 'paper-002',
    title: 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
    authors: 'Jacob Devlin, Ming-Wei Chang, Kenton Lee, Kristina Toutanova',
    abstract: 'We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers. Unlike recent language representation models, BERT is designed to pre-train deep bidirectional representations by jointly conditioning on both left and right context in all layers.',
    source: 'arxiv',
    category: 'nlp',
    url: 'https://arxiv.org/abs/1810.04805',
    publishedDate: '2024-06-11',
    isTodayNew: true,
  },
  {
    id: 'paper-003',
    title: 'Scaling Laws for Neural Language Models',
    authors: 'Jared Kaplan, Sam McCandlish, Tom Henighan, Tom B. Brown, Benjamin Chess, RChild, et al.',
    abstract: 'We empirically study the scaling properties of language model performance as a function of three factors: compute budget, dataset size, and parameter count. We find that power-law relationships span multiple orders of magnitude, allowing us to predict performance of larger models.',
    source: 'arxiv',
    category: 'ai',
    url: 'https://arxiv.org/abs/2001.08361',
    publishedDate: '2024-06-10',
    isTodayNew: true,
  },
  {
    id: 'paper-004',
    title: 'GPT-4 Technical Report',
    authors: 'OpenAI',
    abstract: 'We report the development of GPT-4, a large-scale multimodal model that accepts image and text inputs and produces text outputs. While less capable than humans in many real-world scenarios, it exhibits human-level performance on various professional and academic benchmarks.',
    source: 'arxiv',
    category: 'ai',
    url: 'https://arxiv.org/abs/2303.08774',
    publishedDate: '2024-06-09',
    isTodayNew: false,
  },
  {
    id: 'paper-005',
    title: 'Efficient Transformers: A Survey',
    authors: 'Yunyang Xiong, Zhanxing Zhu, Vikas Chandra',
    abstract: 'Transformers have achieved state-of-the-art results in a wide range of tasks. However, their quadratic complexity with respect to input length limits their application to long sequences. We survey efficient transformer variants that address this challenge through sparse attention, linear attention, and other techniques.',
    source: 'arxiv',
    category: 'ai',
    url: 'https://arxiv.org/abs/2009.06704',
    publishedDate: '2024-06-08',
    isTodayNew: false,
  },
  {
    id: 'paper-006',
    title: 'Distributed Machine Learning with Approximate Streaming Gradient Descent',
    authors: 'Xiangru Lian, Ce Zhang, Huan Zhang, Cho-Jui Hsieh, Wei Zhang, Ji Liu',
    abstract: 'We present a distributed machine learning framework that uses approximate streaming gradient descent for large-scale optimization. Our method achieves near-linear speedup while maintaining model accuracy comparable to centralized approaches.',
    source: 'arxiv',
    category: 'bigdata',
    url: 'https://arxiv.org/abs/1706.03400',
    publishedDate: '2024-06-07',
    isTodayNew: false,
  },
  {
    id: 'paper-007',
    title: 'Instruction Tuning for Large Language Models',
    authors: 'Victor Sanh, Albert Webson, Colin Raffel, Stephen H. Bach, Lintang Sutawika, et al.',
    abstract: 'We explore instruction tuning — finetuning language models on datasets described via natural language instructions. Instruction tuning enables language models to better follow natural language instructions and generalize to new tasks without explicit training examples.',
    source: 'arxiv',
    category: 'nlp',
    url: 'https://arxiv.org/abs/2204.07705',
    publishedDate: '2024-06-06',
    isTodayNew: false,
  },
  {
    id: 'paper-008',
    title: 'Chain-of-Thought Prompting Elicits Reasoning in Large Language Models',
    authors: 'Jason Wei, Xuezhi Wang, Dale Schuurmans, Maarten Bosma, Brian Ichter, et al.',
    abstract: 'We demonstrate that chain-of-thought prompting improves the reasoning capabilities of large language models. By generating intermediate reasoning steps before producing the final answer, models achieve significant performance gains on arithmetic, commonsense, and symbolic reasoning tasks.',
    source: 'nature',
    category: 'ai',
    url: 'https://www.nature.com/articles/s41586-023-05882-6',
    publishedDate: '2024-06-05',
    isTodayNew: false,
  },
];

/**
 * 从 arXiv API 获取论文数据
 * @param keyword 搜索关键词
 * @returns 论文数组
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
 * 解析 arXiv Atom XML 响应
 */
function parseArxivXml(xmlText: string): Paper[] {
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

    // 提取作者
    const authorElems = entry.getElementsByTagName('author');
    const authors = Array.from(authorElems)
      .map(a => a.getElementsByTagName('name')[0]?.textContent)
      .filter(Boolean)
      .join(', ');

    // 提取分类
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
function categorizePaper(term: string): Paper['category'] {
  const lower = term.toLowerCase();
  if (lower.includes('nlp') || lower.includes('computation') || lower.includes('language')) return 'nlp';
  if (lower.includes('learning') || lower.includes('neural') || lower.includes('ai')) return 'ai';
  return 'bigdata';
}