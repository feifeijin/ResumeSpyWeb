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
  background: #090807;
  border-top: 1px solid #2e2620;
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
  font-family: 'Special Elite', cursive;
  font-size: 0.75rem;
  color: #3e352a;
  letter-spacing: 0.18em;
}

.gold { color: #7a5f22; }

.footer-coffee {
  font-family: 'Special Elite', cursive;
  font-size: 0.75rem;
  letter-spacing: 0.14em;
  color: #6a5f52;
  text-decoration: none;
  border: 1px solid #2e2620;
  padding: 0.4rem 1rem;
  transition: color 0.3s, border-color 0.3s;
}

.footer-coffee:hover {
  color: #c49a38;
  border-color: #7a5f22;
}
</style>
