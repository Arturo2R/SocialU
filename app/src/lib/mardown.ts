// lib/markdown.js

import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm'

export default async function markdownToHtml(markdown:string):Promise<string> {
  const result = await remark()
    // https://github.com/sergioramos/remark-prism/issues/265
    .use(html, { sanitize: true })
    .use(remarkGfm)
    .process(markdown);
  return result.toString();
}