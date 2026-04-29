<template>
  <footer class="noir-footer">
    <div class="footer-inner">
      <span class="footer-left">
        {{ $t('footer.resumeSpy') }}&nbsp;<span class="gold">©</span>&nbsp;{{ new Date().getFullYear() }}
      </span>

      <!-- Desktop: full "Buy me a coffee" button -->
      <a
        href="https://www.buymeacoffee.com/feifeijin"
        target="_blank"
        rel="noopener"
        class="footer-coffee footer-coffee-desktop"
      >
        {{ $t('footer.buyMeCoffee') }}
      </a>

      <!-- Mobile: icon-only coffee link -->
      <a
        href="https://www.buymeacoffee.com/feifeijin"
        target="_blank"
        rel="noopener"
        class="footer-coffee footer-coffee-mobile"
        :title="$t('footer.buyMeCoffee')"
      >
        ☕
      </a>

      <span class="footer-right">{{ $t('footer.author') }}</span>
    </div>
  </footer>
</template>

<style scoped>
.noir-footer {
  position: relative;
  z-index: 10;
  background: #F5F5F5;
  border-top: 1px solid #D4D4D4;
  padding: 1.25rem 2rem;
}

.footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.footer-left,
.footer-right {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.72rem;
  color: #888888;
  letter-spacing: 0.1em;
}

.gold { color: #888888; }

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
  .footer-inner {
    flex-wrap: nowrap;
    gap: 0.5rem;
  }

  .footer-left,
  .footer-right {
    font-size: 0.65rem;
    letter-spacing: 0.05em;
  }

  .footer-coffee-desktop {
    display: none;
  }

  .footer-coffee-mobile {
    display: inline;
  }
}
</style>
