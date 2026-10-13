(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#primary-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Menüyü kapat' : 'Menüyü aç');
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Menüyü aç');
      });
    });
  }

  const year = document.querySelector('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  // Site-wide page sharing menu
  if (!document.querySelector('.site-share')) {
    const share = document.createElement('div');
    share.className = 'site-share';
    share.innerHTML = `
      <button class="site-share-toggle" type="button" aria-expanded="false" aria-controls="site-share-panel" aria-label="Sayfayı paylaş">+</button>
      <section class="site-share-panel" id="site-share-panel" aria-label="Sayfayı paylaş" hidden>
        <div class="site-share-heading">
          <div><strong>Bu sayfayı paylaş</strong><span>Bağlantıyı sosyal ağlarda gönderin.</span></div>
          <button class="site-share-close" type="button" aria-label="Paylaşım menüsünü kapat">×</button>
        </div>
        <div class="site-share-grid">
          <button type="button" data-share="native"><span class="share-symbol">↗</span><span>Cihazda paylaş</span></button>
          <button type="button" data-share="copy"><span class="share-symbol">▣</span><span>Bağlantıyı kopyala</span></button>
          <a data-platform="WhatsApp" href="#" target="_blank" rel="noopener noreferrer"><span class="share-symbol">WA</span><span>WhatsApp</span></a>
          <a data-platform="Telegram" href="#" target="_blank" rel="noopener noreferrer"><span class="share-symbol">TG</span><span>Telegram</span></a>
          <a data-platform="Facebook" href="#" target="_blank" rel="noopener noreferrer"><span class="share-symbol">f</span><span>Facebook</span></a>
          <a data-platform="X" href="#" target="_blank" rel="noopener noreferrer"><span class="share-symbol">𝕏</span><span>X</span></a>
          <a data-platform="LinkedIn" href="#" target="_blank" rel="noopener noreferrer"><span class="share-symbol">in</span><span>LinkedIn</span></a>
          <a data-platform="Reddit" href="#" target="_blank" rel="noopener noreferrer"><span class="share-symbol">r/</span><span>Reddit</span></a>
          <a data-platform="Pinterest" href="#" target="_blank" rel="noopener noreferrer"><span class="share-symbol">P</span><span>Pinterest</span></a>
          <a data-platform="Tumblr" href="#" target="_blank" rel="noopener noreferrer"><span class="share-symbol">t</span><span>Tumblr</span></a>
          <a data-platform="E-posta" href="#"><span class="share-symbol">✉</span><span>E-posta</span></a>
        </div>
        <div class="site-share-publish">
          <strong>Blog ve yayın platformları</strong>
          <p>Bu seçenekler site bağlantısını otomatik olarak yazı hâlinde yayımlamaz. Hesabınızda oturum açıp içeriği kendiniz oluşturmanız gerekir.</p>
          <div>
            <a href="https://medium.com/" target="_blank" rel="noopener noreferrer">Medium ↗</a>
            <a href="https://www.blogger.com/" target="_blank" rel="noopener noreferrer">Blogger ↗</a>
            <a href="https://wordpress.com/" target="_blank" rel="noopener noreferrer">WordPress.com ↗</a>
          </div>
        </div>
        <p class="site-share-status" aria-live="polite"></p>
      </section>`;
    document.body.appendChild(share);

    const toggleShare = share.querySelector('.site-share-toggle');
    const panel = share.querySelector('.site-share-panel');
    const status = share.querySelector('.site-share-status');
    const close = () => { panel.hidden = true; toggleShare.setAttribute('aria-expanded', 'false'); };
    const pageUrl = () => window.location.href.split('#')[0];
    const pageTitle = () => document.querySelector('h1')?.textContent?.trim() || document.title;
    const encoded = (value) => encodeURIComponent(value);
    const destinations = {
      WhatsApp: () => 'https://wa.me/?text=' + encoded(pageTitle() + ' ' + pageUrl()),
      Telegram: () => 'https://t.me/share/url?url=' + encoded(pageUrl()) + '&text=' + encoded(pageTitle()),
      Facebook: () => 'https://www.facebook.com/sharer/sharer.php?u=' + encoded(pageUrl()),
      X: () => 'https://twitter.com/intent/tweet?url=' + encoded(pageUrl()) + '&text=' + encoded(pageTitle()),
      LinkedIn: () => 'https://www.linkedin.com/sharing/share-offsite/?url=' + encoded(pageUrl()),
      Reddit: () => 'https://www.reddit.com/submit?url=' + encoded(pageUrl()) + '&title=' + encoded(pageTitle()),
      Pinterest: () => 'https://pinterest.com/pin/create/button/?url=' + encoded(pageUrl()) + '&description=' + encoded(pageTitle()),
      Tumblr: () => 'https://www.tumblr.com/widgets/share/tool?canonicalUrl=' + encoded(pageUrl()) + '&title=' + encoded(pageTitle()),
      'E-posta': () => 'mailto:?subject=' + encoded(pageTitle()) + '&body=' + encoded(pageTitle() + '\\n' + pageUrl())
    };

    toggleShare.addEventListener('click', () => {
      const open = panel.hidden;
      panel.hidden = !open;
      toggleShare.setAttribute('aria-expanded', String(open));
    });
    share.querySelector('.site-share-close').addEventListener('click', close);
    share.querySelectorAll('a[data-platform]').forEach((link) => {
      const platform = link.dataset.platform;
      link.href = destinations[platform] ? destinations[platform]() : '#';
      link.addEventListener('click', (event) => {
        if (platform === 'E-posta') return;
        event.preventDefault();
        window.open(destinations[platform](), '_blank', 'noopener,noreferrer');
      });
    });
    share.querySelector('[data-share="copy"]').addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(pageUrl());
        status.textContent = 'Sayfa bağlantısı kopyalandı.';
      } catch (_) {
        const field = document.createElement('textarea');
        field.value = pageUrl();
        field.setAttribute('readonly', '');
        field.style.position = 'fixed';
        field.style.opacity = '0';
        document.body.appendChild(field);
        field.select();
        const copied = document.execCommand('copy');
        field.remove();
        status.textContent = copied ? 'Sayfa bağlantısı kopyalandı.' : 'Bağlantıyı adres çubuğundan kopyalayabilirsiniz.';
      }
    });
    share.querySelector('[data-share="native"]').addEventListener('click', async () => {
      if (navigator.share) {
        try { await navigator.share({ title: pageTitle(), text: pageTitle(), url: pageUrl() }); }
        catch (error) { if (error?.name !== 'AbortError') status.textContent = 'Paylaşım açılamadı. Başka bir seçenek deneyin.'; }
      } else {
        status.textContent = 'Cihazınızın paylaşım menüsü desteklenmiyor. Bağlantıyı kopyalayabilirsiniz.';
      }
    });
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') close(); });
    document.addEventListener('click', (event) => {
      if (!share.contains(event.target)) close();
    });
  }

})();