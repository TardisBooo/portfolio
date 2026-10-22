import {CACHE_KEY, parseStoredSnapshot, loadStarSnapshot} from './stars.mjs?v=pawr-20261022';

const body = document.body;
const languageButtons = [...document.querySelectorAll('[data-language]')];
const status = document.querySelector('#stars-status');
const statusRow = document.querySelector('.stars-status-row');
const refreshButton = document.querySelector('#refresh-stars');
let language = 'zh';
let snapshot = null;
let state = 'loading';
let inFlight = false;
let lastAttempt = 0;

function showStatus() {
  statusRow.dataset.state = state;
  if (snapshot) {
    const date = new Date(snapshot.updatedAt);
    const locale = language === 'zh' ? 'zh-CN' : 'en';
    const time = new Intl.DateTimeFormat(locale, {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'}).format(date);
    status.textContent = language === 'zh'
      ? `${state === 'live' ? 'GitHub 已更新' : '缓存数据'} · ${time}`
      : `${state === 'live' ? 'Updated from GitHub' : 'Cached data'} · ${time}`;
  } else {
    status.textContent = state === 'unavailable'
      ? (language === 'zh' ? '暂时无法获取 Stars，请在 GitHub 查看。' : 'Stars are unavailable. Check GitHub for current counts.')
      : (language === 'zh' ? '正在读取 GitHub Stars…' : 'Loading GitHub Stars…');
  }
  const label = language === 'zh' ? '刷新 GitHub Stars' : 'Refresh GitHub Stars';
  refreshButton.setAttribute('aria-label', label);
  refreshButton.title = label;
}

function setLanguage(next, updateUrl = true) {
  language = next === 'en' ? 'en' : 'zh';
  body.dataset.lang = language;
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  document.title = language === 'zh' ? 'Tardis · Agent、系统与研究' : 'Tardis · Agents, Systems & Research';
  languageButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === language)));
  document.querySelectorAll('[data-alt-zh]').forEach(image => image.alt = image.dataset[language === 'zh' ? 'altZh' : 'altEn']);
  try { localStorage.setItem('tardis-portfolio-language', language); } catch {}
  if (updateUrl) {
    const url = new URL(location.href);
    url.searchParams.set('lang', language);
    history.replaceState({}, '', url);
  }
  showStatus();
}

function paintStars() {
  const formatter = new Intl.NumberFormat(language === 'zh' ? 'zh-CN' : 'en');
  const counts = new Map(snapshot?.repos.map(repo => [repo.name.toLowerCase(), repo.stars]) || []);
  document.querySelectorAll('[data-repo-stars]').forEach(node => {
    const count = counts.get(node.dataset.repoStars.toLowerCase());
    node.textContent = Number.isSafeInteger(count) ? formatter.format(count) : '—';
    node.closest('a').setAttribute('aria-label', `${node.dataset.repoStars}: ${Number.isSafeInteger(count) ? count : 'unknown'} GitHub Stars`);
  });
  document.querySelector('[data-total-stars]').textContent = snapshot ? formatter.format(snapshot.total) : '—';
  showStatus();
}

async function refreshStars() {
  if (inFlight) return;
  inFlight = true;
  lastAttempt = Date.now();
  refreshButton.disabled = true;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    snapshot = await loadStarSnapshot({signal:controller.signal});
    state = 'live';
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(snapshot)); } catch {}
  } catch {
    state = snapshot ? 'cached' : 'unavailable';
  } finally {
    clearTimeout(timeout);
    inFlight = false;
    refreshButton.disabled = false;
    paintStars();
  }
}

const queryLanguage = new URLSearchParams(location.search).get('lang');
let savedLanguage;
try {
  savedLanguage = localStorage.getItem('tardis-portfolio-language');
  snapshot = parseStoredSnapshot(localStorage.getItem(CACHE_KEY));
} catch {}
if (snapshot) state = 'cached';
setLanguage(queryLanguage || savedLanguage || 'zh', false);
paintStars();
languageButtons.forEach(button => button.addEventListener('click', () => {setLanguage(button.dataset.language); paintStars();}));
refreshButton.addEventListener('click', refreshStars);
document.querySelector('#year').textContent = new Date().getFullYear();
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && Date.now() - lastAttempt > 300000) refreshStars();
});
refreshStars();
