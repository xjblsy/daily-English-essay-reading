import { describe, it, expect, vi, beforeEach } from 'vitest';
import { parseArxivXml, categorizePaper } from '../../src/utils/apiHelpers';
import type { Paper } from '../../src/types';

describe('apiHelpers', () => {
  describe('parseArxivXml', () => {
    it('应该正确解析有效的 arXiv Atom XML', () => {
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
        <feed xmlns="http://www.w3.org/2005/Atom">
          <entry>
            <title>Attention Is All You Need</title>
            <summary>The Transformer architecture uses attention mechanisms.</summary>
            <published>2024-06-12T00:00:00Z</published>
            <id>https://arxiv.org/abs/1706.03762</id>
            <author><name>Ashish Vaswani</name></author>
            <author><name>Noam Shazeer</name></author>
            <category term="cs.CL" />
          </entry>
        </feed>`;

      const papers = parseArxivXml(xml);

      expect(papers).toHaveLength(1);
      expect(papers[0].title).toBe('Attention Is All You Need');
      expect(papers[0].authors).toContain('Ashish Vaswani');
      expect(papers[0].abstract).toContain('Transformer');
      expect(papers[0].url).toBe('https://arxiv.org/abs/1706.03762');
      expect(papers[0].source).toBe('arxiv');
      expect(papers[0].isTodayNew).toBe(true);
    });

    it('应该处理空的 XML 输入', () => {
      const papers = parseArxivXml('<feed xmlns="http://www.w3.org/2005/Atom"></feed>');
      expect(papers).toHaveLength(0);
    });

    it('应该处理多个 entry', () => {
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
        <feed xmlns="http://www.w3.org/2005/Atom">
          <entry>
            <title>Paper One</title>
            <summary>Abstract one</summary>
            <published>2024-01-01T00:00:00Z</published>
            <id>https://arxiv.org/abs/0001</id>
            <author><name>Author A</name></author>
            <category term="cs.AI" />
          </entry>
          <entry>
            <title>Paper Two</title>
            <summary>Abstract two</summary>
            <published>2024-02-01T00:00:00Z</published>
            <id>https://arxiv.org/abs/0002</id>
            <author><name>Author B</name></author>
            <category term="cs.LG" />
          </entry>
        </feed>`;

      const papers = parseArxivXml(xml);
      expect(papers).toHaveLength(2);
      expect(papers[0].title).toBe('Paper One');
      expect(papers[1].title).toBe('Paper Two');
    });

    it('应该清理摘要中的多余空白字符', () => {
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
        <feed xmlns="http://www.w3.org/2005/Atom">
          <entry>
            <title>Test</title>
            <summary>  Multiple   spaces   and
              newlines   here  </summary>
            <published>2024-01-01T00:00:00Z</published>
            <id>https://arxiv.org/abs/0001</id>
            <author><name>A</name></author>
            <category term="cs.AI" />
          </entry>
        </feed>`;

      const papers = parseArxivXml(xml);
      expect(papers[0].abstract).toBe('Multiple spaces and newlines here');
    });
  });

  describe('categorizePaper', () => {
    it('NLP 相关术语应分类为 nlp', () => {
      expect(categorizePaper('cs.CL')).toBe('nlp');
      expect(categorizePaper('computation and language')).toBe('nlp');
    });

    it('AI/ML 相关术语应分类为 ai', () => {
      expect(categorizePaper('cs.AI')).toBe('ai');
      expect(categorizePaper('neural network learning')).toBe('ai');
    });

    it('其他术语应默认分类为 bigdata', () => {
      expect(categorizePaper('cs.DB')).toBe('bigdata');
      expect(categorizePaper('unknown topic')).toBe('bigdata');
    });
  });
});
