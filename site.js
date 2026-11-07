(() => {
  const items = [['about','About','index.html'],['research','Research','research.html'],['projects','Projects','projects.html'],['explore','Explore','explore.html'],['contact','Contact','contact.html']];
  const current = document.body.dataset.page;
  const header = document.getElementById('site-header');
  const inner = document.createElement('div'); inner.className = 'shell header-inner';
  const nav = document.createElement('nav'); nav.className='nav'; nav.setAttribute('aria-label','Main navigation');
  for (const [id,title,path] of items) {
    const a=document.createElement('a'); a.href=path; a.textContent=title;
    if(id===current) a.setAttribute('aria-current','page');
    nav.append(a);
  }
  inner.append(nav); header.append(inner);
  if (current === 'about') document.getElementById('site-intro').innerHTML = "    <section class=\"hero\" aria-labelledby=\"hero-title\">\n      <div class=\"hero-art\" aria-hidden=\"true\"><img src=\"assets/hero.png\" alt=\"\"></div>\n      <div class=\"hero-content\">\n        <h1 id=\"hero-title\">Xiaoshuang Kong</h1>\n        <p class=\"hero-subtitle\">Artificial Intelligence \u00b7 Research</p>\n        <span class=\"hero-stroke\" aria-hidden=\"true\"></span>\n        <p class=\"hero-description\">I study the algorithms, patterns, mechanisms, and generalization behind intelligent systems.</p>\n      </div>\n    </section>";
})();
