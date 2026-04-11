<template>
  <footer class="noir-footer">
    <div class="footer-inner">
      <span class="footer-left">
        RESUME<span class="gold">SPY</span> &nbsp;©&nbsp;{{ new Date().getFullYear() }}
      </span>

      <a
        href="https://www.buymeacoffee.com/feifeijin"
        target="_blank"
        rel="noopener"
        class="footer-coffee"
      >
        ☕ Buy me a coffee
      </a>

      <span class="footer-right">By Fei-Fei Jin</span>
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
  border: 1px solid #D4D4D4;
  padding: 0.4rem 1rem;
  transition: color 0.2s, border-color 0.2s;
}

.footer-coffee:hover {
  color: #121212;
  border-color: #888888;
}
</style>
