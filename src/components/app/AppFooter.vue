<template>
  <footer class="noir-footer">
    <div class="footer-inner">
      <!-- Left cluster: brand + legal links -->
      <div class="footer-left">
        <span class="footer-brand">
          {{ $t('footer.resumeSpy') }}&nbsp;<span class="gold">©</span>&nbsp;{{ new Date().getFullYear() }}
        </span>
        <span class="footer-sep">·</span>
        <router-link to="/articles" class="footer-legal-link">{{ $t('footer.articles') }}</router-link>
        <span class="footer-sep">·</span>
        <router-link to="/faq" class="footer-legal-link">{{ $t('footer.faq') }}</router-link>
        <span class="footer-sep">·</span>
        <router-link to="/privacy" class="footer-legal-link">{{ $t('footer.privacy') }}</router-link>
        <span class="footer-sep">·</span>
        <router-link to="/terms" class="footer-legal-link">{{ $t('footer.terms') }}</router-link>
        <span class="footer-sep">·</span>
        <router-link to="/commercial-transactions" class="footer-legal-link">{{ $t('footer.commercial') }}</router-link>
      </div>

      <!-- Right cluster: coffee + author -->
      <div class="footer-right">
        <a
          href="https://www.buymeacoffee.com/feifeijin"
          target="_blank"
          rel="noopener"
          class="footer-coffee footer-coffee-desktop"
        >
          {{ $t('footer.buyMeCoffee') }}
        </a>
        <a
          href="https://www.buymeacoffee.com/feifeijin"
          target="_blank"
          rel="noopener"
          class="footer-coffee footer-coffee-mobile"
          :title="$t('footer.buyMeCoffee')"
        >
          ☕
        </a>
        <span class="footer-author">{{ $t('footer.author') }}</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.noir-footer {
  position: relative;
  z-index: 10;
  background: #F5F5F5;
  border-top: 1px solid #D4D4D4;
  padding: 1rem 2rem;
}

.footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
}

/* Left cluster */
.footer-left {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.4rem 0.5rem;
}

.footer-brand {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.72rem;
  color: #888888;
  letter-spacing: 0.1em;
  white-space: nowrap;
}

.gold { color: #888888; }

.footer-sep {
  font-size: 0.65rem;
  color: #CCCCCC;
}

.footer-legal-link {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.08em;
  color: #AAAAAA;
  text-decoration: none;
  transition: color 0.2s;
  white-space: nowrap;
}

.footer-legal-link:hover { color: #121212; }

/* Right cluster */
.footer-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.footer-author {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.72rem;
  color: #888888;
  letter-spacing: 0.1em;
}

.footer-coffee {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  color: #888888;
  text-decoration: none;
  transition: color 0.2s, border-color 0.2s;
}

.footer-coffee-desktop {
  border: 1px solid #D4D4D4;
  padding: 0.4rem 1rem;
}

.footer-coffee-mobile {
  display: none;
  font-size: 1rem;
  line-height: 1;
}

.footer-coffee:hover {
  color: #121212;
  border-color: #888888;
}

@media (max-width: 640px) {
  .footer-coffee-desktop { display: none; }
  .footer-coffee-mobile  { display: inline; }
}
</style>
