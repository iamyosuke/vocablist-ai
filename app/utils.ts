export function getFirstParagraph(markdown: string): string {
  const paragraphs = markdown.split('\n').filter(p => p.trim());
  if (paragraphs.length === 0) return '';
  
  let firstParagraph = paragraphs[0]
    .replace(/^#+\s+/, '')
    .replace(/[*_`]/g, '');

  if (firstParagraph.length > 100) {
    firstParagraph = firstParagraph.substring(0, 100) + '...';
  }

  return firstParagraph;
} 