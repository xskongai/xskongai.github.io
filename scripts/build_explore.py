#!/usr/bin/env python3
"""Generate an offline/local Explore index: python3 scripts/build_explore.py."""
import json
from html.parser import HTMLParser
from pathlib import Path

class Title(HTMLParser):
    def __init__(self):
        super().__init__(); self.inside = False; self.parts = []
    def handle_starttag(self, tag, attrs):
        if tag == 'title': self.inside = True
    def handle_endtag(self, tag):
        if tag == 'title': self.inside = False
    def handle_data(self, data):
        if self.inside: self.parts.append(data)

def build(root):
    pages = []
    for p in sorted((root / 'mix').rglob('*')):
        relative = p.relative_to(root)
        if not p.is_file() or p.is_symlink() or p.suffix.lower() not in ('.html', '.htm'):
            continue
        if any(part.startswith('.') for part in relative.parts): continue
        parser = Title(); parser.feed(p.read_text(encoding='utf-8', errors='replace'))
        pages.append({'path': relative.as_posix(), 'title': ''.join(parser.parts).strip() or p.stem.replace('_',' ').replace('-',' ')})
    (root / 'mix/pages.json').write_text(json.dumps(pages, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    return pages

if __name__ == '__main__':
    print(f'Indexed {len(build(Path(__file__).resolve().parents[1]))} pages.')
