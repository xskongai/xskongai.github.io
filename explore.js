(() => {
  'use strict';
  const list = document.getElementById('explore-list');
  const status = document.getElementById('explore-status');
  const empty = document.getElementById('explore-empty');
  const search = document.getElementById('explore-search');
  let pages = [];
  const valid = path => typeof path === 'string' && path.startsWith('mix/') &&
    !path.split('/').some(part => part === '..' || part.startsWith('.')) && /\.html?$/i.test(path);
  const label = path => path.split('/').pop().replace(/\.html?$/i, '').replace(/[_-]+/g, ' ');
  const href = path => './' + path.split('/').map(encodeURIComponent).join('/');
  function render() {
    const query = search.value.trim().toLocaleLowerCase();
    const shown = pages.filter(p => (p.title + ' ' + p.path).toLocaleLowerCase().includes(query));
    list.replaceChildren();
    for (const page of shown) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = href(page.path);
      const text = document.createElement('span');
      text.className = 'explore-page-title';
      text.textContent = page.title;
      const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      arrow.setAttribute('viewBox', '0 0 16 16');
      arrow.setAttribute('class', 'explore-arrow');
      arrow.setAttribute('aria-hidden', 'true');
      arrow.setAttribute('fill', 'none');
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M3 13 13 3M5 3h8v8');
      path.setAttribute('stroke', 'currentColor');
      path.setAttribute('stroke-width', '1.4');
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('stroke-linejoin', 'round');
      arrow.append(path);
      a.append(text, arrow); li.append(a); list.append(li);
    }
    status.textContent = query ? `${shown.length} / ${pages.length}` : `${pages.length} pages`;
    empty.hidden = shown.length > 0;
    empty.textContent = pages.length ? 'No matching pages.' : 'New explorations will appear here soon.';
  }
  async function json(url) {
    const response = await fetch(url, {signal: AbortSignal.timeout(12000)});
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }
  async function load() {
    let manifest = null;
    try { manifest = await json('./mix/pages.json'); } catch (_) {}
    if (Array.isArray(manifest)) {
      pages = manifest.filter(p => p && valid(p.path)).map(p => ({path:p.path, title:p.title || label(p.path)}));
      render();
    }
    // GitHub Pages does not expose directory listings. Discover committed HTML
    // files via the public repository tree; no token or manual link list needed.
    if (location.hostname !== 'xskongai.github.io') {
      if (manifest === null) throw new Error('Local index unavailable');
      return;
    }
    const repo = 'https://api.github.com/repos/xskongai/xskongai.github.io';
    const metadata = await json(repo);
    const tree = await json(`${repo}/git/trees/${encodeURIComponent(metadata.default_branch)}?recursive=1`);
    if (!Array.isArray(tree.tree) || tree.truncated) throw new Error('Incomplete repository listing');
    const known = new Map(pages.map(p => [p.path,p.title]));
    pages = tree.tree.filter(p => p.type === 'blob' && valid(p.path))
      .map(p => ({path:p.path,title:known.get(p.path) || label(p.path)}))
      .sort((a,b) => a.title.localeCompare(b.title));
    render();
    // Read page titles in bounded batches. Parse as inert HTML; never execute it.
    for (let i = 0; i < pages.length; i += 4) {
      await Promise.all(pages.slice(i,i+4).map(async page => {
        try {
          const response = await fetch(href(page.path), {signal:AbortSignal.timeout(8000)});
          if (!response.ok) return;
          const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
          page.title = doc.querySelector('title')?.textContent.trim() || page.title;
        } catch (_) {}
      }));
      render();
    }
  }
  search.addEventListener('input', render);
  load().catch(() => {
    if (pages.length) return;
    status.textContent = 'Unavailable'; empty.hidden = false;
    empty.textContent = 'The page list could not be loaded. Please refresh in a moment.';
  });
})();
