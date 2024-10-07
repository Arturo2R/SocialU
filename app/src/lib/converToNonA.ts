export default function convertAllAToSpan(html: string) {
  return html.replace(
    /<a\s+([^>]*)href="([^"]+)"([^>]*)>([^<]*)<\/a>/g,
    (match, beforeHref, href, afterHref, content) => {
      const styleAttr = (beforeHref + afterHref).match(/style="([^"]+)"/);
      const classAttr = (beforeHref + afterHref).match(/class="([^"]+)"/);
      const dataWithBorder = (beforeHref + afterHref).match(/data-with-border="([^"]+)"/);

      let result = '<span ';
      result += `onClick={(e) => {
        e.stopPropagation();
        window.location.href = '${href}';
      }} `;

      if (styleAttr) {
        result += `style={{${styleAttr[1]
          .split(';')
          .map(s => s.trim())
          .filter(s => s)
          .map(s => `'${s.replace(':', '\': \'')}'`)
          .join(', ')}, cursor: 'pointer'}} `;
      } else {
        result += `style={{cursor: 'pointer'}} `;
      }

      if (classAttr) {
        result += `className="${classAttr[1]}" `;
      }

      if (dataWithBorder) {
        result += `data-with-border="${dataWithBorder[1]}" `;
      }

      result += '>\n  ';
      result += content || 'Link';  // Use original content if available, otherwise default to 'Link'
      result += '\n</span>';

      return result;
    }
  );
}
