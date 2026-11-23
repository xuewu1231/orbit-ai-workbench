/* ============================================================================
   PRECISION KINETIC SVG ICON SYSTEM — Orbit AI Workbench
   Every icon is multi-layered vector geometry with semantic sub-classes so
   hover, active, and click states animate individual strokes, orbits & morphs.
   ============================================================================ */

export function renderBrandGyro() {
  return `
    <span class="orbit-gyro" aria-hidden="true">
      <svg viewBox="0 0 28 28" width="26" height="26" fill="none">
        <defs>
          <linearGradient id="orbitHousing" x1="2" y1="2" x2="26" y2="26" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#181B24"/>
            <stop offset="100%" stop-color="#090A0F"/>
          </linearGradient>
          <linearGradient id="orbitRingGrad" x1="5" y1="6" x2="23" y2="22" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#60A5FA"/>
            <stop offset="55%" stop-color="#3B82F6"/>
            <stop offset="100%" stop-color="#34D399"/>
          </linearGradient>
        </defs>
        <rect class="gyro-housing" x="1.5" y="1.5" width="25" height="25" rx="7.5" fill="url(#orbitHousing)" stroke="rgba(255,255,255,0.16)" stroke-width="1"/>
        <ellipse class="gyro-ring-a" cx="14" cy="14" rx="8.8" ry="4.1" transform="rotate(-32 14 14)" stroke="rgba(255,255,255,0.34)" stroke-width="1.25"/>
        <ellipse class="gyro-ring-b" cx="14" cy="14" rx="8.8" ry="4.1" transform="rotate(32 14 14)" stroke="url(#orbitRingGrad)" stroke-width="1.45"/>
        <path class="gyro-core" d="M14 9.6C14 12.1 15.9 14 18.4 14C15.9 14 14 15.9 14 18.4C14 15.9 12.1 14 9.6 14C12.1 14 14 12.1 14 9.6Z" fill="#FFFFFF"/>
        <g class="gyro-sat-orbit">
          <circle class="gyro-sat" cx="21.2" cy="9.5" r="2.05" fill="#38BDF8" stroke="#090A0F" stroke-width="0.9"/>
        </g>
      </svg>
    </span>
  `;
}

export function renderNavSvg(kind) {
  switch (kind) {
    case 'workbench':
      return `<span class="nav-ico nav-ico-workbench" aria-hidden="true">
        <svg viewBox="0 0 20 20" width="16" height="16" fill="none">
          <circle class="ni-ring" cx="10" cy="10" r="7.2" stroke="currentColor" stroke-width="1.55" stroke-opacity="0.45"/>
          <ellipse class="ni-orbit" cx="10" cy="10" rx="7.4" ry="3.2" transform="rotate(-28 10 10)" stroke="currentColor" stroke-width="1.55"/>
          <circle class="ni-core" cx="10" cy="10" r="1.9" fill="currentColor"/>
          <circle class="ni-dot" cx="15.4" cy="6.8" r="1.65" fill="var(--blue)"/>
        </svg>
      </span>`;
    case 'vault':
      return `<span class="nav-ico nav-ico-vault" aria-hidden="true">
        <svg viewBox="0 0 20 20" width="16" height="16" fill="none">
          <rect class="ni-tile-a" x="2.6" y="2.6" width="6.4" height="6.4" rx="1.8" stroke="currentColor" stroke-width="1.55"/>
          <rect class="ni-tile-b" x="11" y="2.6" width="6.4" height="6.4" rx="3.2" fill="var(--blue)" fill-opacity="0.18" stroke="var(--blue)" stroke-width="1.55"/>
          <rect class="ni-tile-c" x="2.6" y="11" width="6.4" height="6.4" rx="1.8" stroke="currentColor" stroke-width="1.55" stroke-opacity="0.65"/>
          <path class="ni-spark" d="M14.2 10.6C14.2 12.6 15.6 14 17.6 14C15.6 14 14.2 15.4 14.2 17.4C14.2 15.4 12.8 14 10.8 14C12.8 14 14.2 12.6 14.2 10.6Z" fill="currentColor"/>
        </svg>
      </span>`;
    case 'products':
      return `<span class="nav-ico nav-ico-products" aria-hidden="true">
        <svg viewBox="0 0 20 20" width="16" height="16" fill="none">
          <path class="ni-cube-top" d="M10 2.4L16.8 6.2L10 10L3.2 6.2L10 2.4Z" fill="var(--blue)" fill-opacity="0.16" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
          <path class="ni-cube-body" d="M3.2 6.2V13.8L10 17.6L16.8 13.8V6.2" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
          <path d="M10 10V17.6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <circle class="ni-led" cx="10" cy="6.2" r="1.45" fill="var(--blue)"/>
        </svg>
      </span>`;
    case 'playbook':
      return `<span class="nav-ico nav-ico-playbook" aria-hidden="true">
        <svg viewBox="0 0 20 20" width="16" height="16" fill="none">
          <path class="ni-layer-3" d="M3 13.8L10 17.4L17 13.8" stroke="currentColor" stroke-opacity="0.45" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round"/>
          <path class="ni-layer-2" d="M3 10L10 13.6L17 10" stroke="currentColor" stroke-opacity="0.75" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round"/>
          <path class="ni-layer-1" d="M10 2.6L17 6.2L10 9.8L3 6.2L10 2.6Z" fill="var(--blue)" fill-opacity="0.16" stroke="currentColor" stroke-width="1.55" stroke-linejoin="round"/>
        </svg>
      </span>`;
    case 'curated':
      return `<span class="nav-ico nav-ico-curated" aria-hidden="true">
        <svg viewBox="0 0 20 20" width="16" height="16" fill="none">
          <path class="ni-page-l" d="M10 4.6C8.4 3.5 5.9 3.2 3.2 3.8V15.4C5.9 14.8 8.4 15.1 10 16.2" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round"/>
          <path class="ni-page-r" d="M10 4.6C11.6 3.5 14.1 3.2 16.8 3.8V15.4C14.1 14.8 11.6 15.1 10 16.2" fill="var(--blue)" fill-opacity="0.14" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M10 4.6V16.2" stroke="currentColor" stroke-width="1.45" stroke-linecap="round"/>
        </svg>
      </span>`;
    case 'creator':
      return `<span class="nav-ico nav-ico-creator" aria-hidden="true">
        <svg viewBox="0 0 20 20" width="16" height="16" fill="none">
          <rect class="ni-board" x="2.4" y="3.2" width="15.2" height="11" rx="2.6" fill="var(--blue)" fill-opacity="0.14" stroke="currentColor" stroke-width="1.55"/>
          <path class="ni-play" d="M8.4 6.6L12.6 8.7L8.4 10.8V6.6Z" fill="currentColor"/>
          <path class="ni-stand" d="M6.5 17H13.5M10 14.2V17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <circle class="ni-rec" cx="15" cy="5.6" r="1.35" fill="#EF4444"/>
        </svg>
      </span>`;
    default:
      return '';
  }
}

export function renderActionSvg(kind) {
  switch (kind) {
    case 'search':
      return `<svg class="act-svg act-search" viewBox="0 0 18 18" width="14" height="14" fill="none" aria-hidden="true">
        <circle class="as-lens" cx="8" cy="8" r="5.2" stroke="currentColor" stroke-width="1.65"/>
        <path class="as-ray" d="M6.2 6.4A2.4 2.4 0 0 1 9.4 5.8" stroke="var(--blue)" stroke-width="1.4" stroke-linecap="round"/>
        <path class="as-handle" d="M12 12L15.6 15.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      </svg>`;
    case 'sound':
      return `<svg class="act-svg act-sound" viewBox="0 0 20 20" width="17" height="17" fill="none" aria-hidden="true">
        <line class="eq-bar eq-b1" x1="4.2" y1="13" x2="4.2" y2="7" stroke="currentColor" stroke-width="1.85" stroke-linecap="round"/>
        <line class="eq-bar eq-b2" x1="8.1" y1="15.2" x2="8.1" y2="4.8" stroke="var(--blue)" stroke-width="1.85" stroke-linecap="round"/>
        <line class="eq-bar eq-b3" x1="12" y1="13.8" x2="12" y2="6.2" stroke="currentColor" stroke-width="1.85" stroke-linecap="round"/>
        <line class="eq-bar eq-b4" x1="15.9" y1="12.2" x2="15.9" y2="7.8" stroke="currentColor" stroke-width="1.85" stroke-linecap="round"/>
        <line class="eq-mute-slash" x1="3.5" y1="16.5" x2="16.5" y2="3.5" stroke="#EF4444" stroke-width="1.85" stroke-linecap="round"/>
      </svg>`;
    case 'lang':
      return `<svg class="act-svg act-lang" viewBox="0 0 18 18" width="14" height="14" fill="none" aria-hidden="true">
        <circle cx="9" cy="9" r="6.6" stroke="currentColor" stroke-width="1.45"/>
        <ellipse class="al-meridian" cx="9" cy="9" rx="3" ry="6.6" stroke="var(--blue)" stroke-width="1.35"/>
        <line x1="2.8" y1="9" x2="15.2" y2="9" stroke="currentColor" stroke-width="1.3"/>
      </svg>`;
    case 'theme':
      return `<svg class="act-svg act-theme" viewBox="0 0 20 20" width="17" height="17" fill="none" aria-hidden="true">
        <g class="th-sun-group">
          <circle cx="10" cy="10" r="4" fill="currentColor" fill-opacity="0.16" stroke="currentColor" stroke-width="1.65"/>
          <path class="th-rays" d="M10 2.2V4.1M10 15.9V17.8M2.2 10H4.1M15.9 10H17.8M4.5 4.5L5.85 5.85M14.15 14.15L15.5 15.5M15.5 4.5L14.15 5.85M5.85 14.15L4.5 15.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
        </g>
        <g class="th-moon-group">
          <path d="M15.8 11.9A6.2 6.2 0 1 1 8.1 4.2A4.9 4.9 0 0 0 15.8 11.9Z" fill="var(--blue)" fill-opacity="0.2" stroke="currentColor" stroke-width="1.65" stroke-linejoin="round"/>
          <circle class="th-star" cx="14.6" cy="5.2" r="1.15" fill="var(--blue)"/>
        </g>
      </svg>`;
    case 'collect':
      return `<svg class="act-svg act-collect" viewBox="0 0 16 16" width="13" height="13" fill="none" aria-hidden="true">
        <path class="ac-plus" d="M8 3.2V12.8M3.2 8H12.8" stroke="currentColor" stroke-width="1.85" stroke-linecap="round"/>
      </svg>`;
    case 'sparkCheck':
      return `<span class="morph-pair" aria-hidden="true">
        <svg class="mp-spark" viewBox="0 0 16 16" width="13" height="13" fill="none">
          <path d="M8 1.5C8 5.1 10.9 8 14.5 8C10.9 8 8 10.9 8 14.5C8 10.9 5.1 8 1.5 8C5.1 8 8 5.1 8 1.5Z" fill="currentColor"/>
        </svg>
        <svg class="mp-check" viewBox="0 0 16 16" width="13" height="13" fill="none">
          <path d="M3 8.4L6.4 11.8L13.2 4.6" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>`;
    case 'promptDoc':
      return `<svg class="act-svg act-doc" viewBox="0 0 16 16" width="12" height="12" fill="none" aria-hidden="true">
        <rect x="2.5" y="2" width="11" height="12" rx="2.4" stroke="currentColor" stroke-width="1.45"/>
        <path d="M5.2 5.6H10.8M5.2 8.2H10.8M5.2 10.8H8.4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
      </svg>`;
    case 'extArrow':
      return `<svg class="act-svg act-ext" viewBox="0 0 16 16" width="13" height="13" fill="none" aria-hidden="true">
        <path d="M4.5 11.5L11.5 4.5M6 4.5H11.5V10" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
    case 'upvoteSpark':
      return `<svg class="act-svg act-upvote" viewBox="0 0 16 16" width="13" height="13" fill="none" aria-hidden="true">
        <path class="au-bolt" d="M8.8 1.8L3.6 9H7.8L7.2 14.2L12.4 7H8.2L8.8 1.8Z" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="1.45" stroke-linejoin="round"/>
      </svg>`;
    case 'stackPlus':
      return `<span class="morph-pair" aria-hidden="true">
        <svg class="mp-spark" viewBox="0 0 16 16" width="12" height="12" fill="none">
          <path d="M8 3V13M3 8H13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
        <svg class="mp-check" viewBox="0 0 16 16" width="12" height="12" fill="none">
          <path d="M3 8.4L6.4 11.8L13.2 4.6" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>`;
    case 'download':
      return `<svg class="act-svg act-download" viewBox="0 0 16 16" width="13" height="13" fill="none" aria-hidden="true">
        <path d="M8 2.4V10.4M5 7.6L8 10.6L11 7.6M3 13.2H13" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
    case 'shareCard':
      return `<svg class="act-svg act-share" viewBox="0 0 16 16" width="13" height="13" fill="none" aria-hidden="true">
        <rect x="2.6" y="2" width="10.8" height="12" rx="2.2" stroke="currentColor" stroke-width="1.45"/>
        <circle cx="6" cy="5.6" r="1.1" fill="currentColor"/>
        <path d="M4.6 11.2L7.2 8.6L9.2 10.4L11.4 7.8" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
    case 'teleprompter':
      return `<svg class="act-svg act-prompter" viewBox="0 0 16 16" width="13" height="13" fill="none" aria-hidden="true">
        <rect x="2" y="2.6" width="12" height="10.8" rx="2.2" stroke="currentColor" stroke-width="1.45"/>
        <path d="M4.5 6.4H11.5M4.5 9.4H9.2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>`;
    default:
      return '';
  }
}

export function renderDockSvg(id) {
  const map = {
    'products-sec': `<svg viewBox="0 0 20 20" width="17" height="17" fill="none"><path d="M10 2.5L16.6 6.2L10 9.9L3.4 6.2L10 2.5Z" fill="currentColor" fill-opacity="0.16" stroke="currentColor" stroke-width="1.55" stroke-linejoin="round"/><path d="M3.4 6.2V13.8L10 17.5L16.6 13.8V6.2M10 9.9V17.5" stroke="currentColor" stroke-width="1.55" stroke-linejoin="round"/></svg>`,
    'depot-pillars': `<svg viewBox="0 0 20 20" width="17" height="17" fill="none"><path d="M10 2.5L17 6V10.5C17 14.5 13.9 17.1 10 18.2C6.1 17.1 3 14.5 3 10.5V6L10 2.5Z" fill="currentColor" fill-opacity="0.16" stroke="currentColor" stroke-width="1.55" stroke-linejoin="round"/><circle cx="10" cy="10" r="2.2" fill="currentColor"/></svg>`,
    'orbit-console': `<svg viewBox="0 0 20 20" width="17" height="17" fill="none"><rect x="2.5" y="3.5" width="15" height="13" rx="3.2" stroke="currentColor" stroke-width="1.55"/><path d="M6.5 8L9.2 10.2L6.5 12.4M10.8 12.4H13.6" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    'dual-readable': `<svg viewBox="0 0 20 20" width="17" height="17" fill="none"><circle cx="7.5" cy="10" r="4.8" stroke="currentColor" stroke-width="1.55"/><circle cx="12.5" cy="10" r="4.8" fill="currentColor" fill-opacity="0.14" stroke="currentColor" stroke-width="1.55"/></svg>`,
    'shelf-design': `<svg viewBox="0 0 20 20" width="17" height="17" fill="none"><rect x="2.8" y="2.8" width="6.2" height="6.2" rx="1.8" stroke="currentColor" stroke-width="1.55"/><rect x="11" y="2.8" width="6.2" height="6.2" rx="3.1" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-width="1.55"/><rect x="2.8" y="11" width="6.2" height="6.2" rx="1.8" stroke="currentColor" stroke-width="1.55"/><path d="M14.1 10.8L15.2 13L17.4 14.1L15.2 15.2L14.1 17.4L13 15.2L10.8 14.1L13 13L14.1 10.8Z" fill="currentColor"/></svg>`,
    'playbook-sec': `<svg viewBox="0 0 20 20" width="17" height="17" fill="none"><path d="M10 4.5C8.3 3.4 5.8 3.2 3.2 3.8V15.4C5.8 14.8 8.3 15 10 16.1M10 4.5C11.7 3.4 14.2 3.2 16.8 3.8V15.4C14.2 14.8 11.7 15 10 16.1M10 4.5V16.1" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  };
  return map[id] || map['orbit-console'];
}

export function renderKindSvg(kind) {
  switch (kind) {
    case 'agent-ui':
      return `<svg viewBox="0 0 20 20" width="17" height="17" fill="none"><rect x="2.4" y="3" width="15.2" height="10.8" rx="2.8" fill="currentColor" fill-opacity="0.14" stroke="currentColor" stroke-width="1.55"/><path d="M6.4 8.4H9.6M6.4 11H11.8" stroke="currentColor" stroke-width="1.45" stroke-linecap="round"/><path d="M13.6 5.4L14.4 7L16 7.8L14.4 8.6L13.6 10.2L12.8 8.6L11.2 7.8L12.8 7L13.6 5.4Z" fill="currentColor"/><path d="M7.5 13.8L5.4 16.8V13.8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    case 'ui-lib':
      return `<svg viewBox="0 0 20 20" width="17" height="17" fill="none"><rect x="2.5" y="3" width="15" height="5.5" rx="2" fill="currentColor" fill-opacity="0.16" stroke="currentColor" stroke-width="1.55"/><rect x="2.5" y="11.2" width="6.6" height="5.8" rx="2" stroke="currentColor" stroke-width="1.55"/><rect x="10.9" y="11.2" width="6.6" height="5.8" rx="2" stroke="currentColor" stroke-width="1.55"/><circle cx="5.5" cy="5.75" r="1" fill="currentColor"/></svg>`;
    case 'motion':
      return `<svg viewBox="0 0 20 20" width="17" height="17" fill="none"><circle cx="6" cy="12.5" r="3.2" stroke="currentColor" stroke-opacity="0.4" stroke-width="1.4" stroke-dasharray="2 2"/><circle cx="10.2" cy="9.8" r="3.5" stroke="currentColor" stroke-opacity="0.68" stroke-width="1.45"/><circle cx="14.2" cy="7.2" r="3.8" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-width="1.6"/></svg>`;
    case 'icons':
      return `<svg viewBox="0 0 20 20" width="17" height="17" fill="none"><rect x="3" y="3" width="5.8" height="5.8" rx="1.6" stroke="currentColor" stroke-width="1.5"/><circle cx="14.1" cy="5.9" r="2.9" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-width="1.5"/><polygon points="5.9 11.4 9 16.8 2.8 16.8" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M12 14.1H16.4M14.2 11.9V16.3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`;
    case 'loader':
      return `<svg viewBox="0 0 20 20" width="17" height="17" fill="none"><circle cx="10" cy="10" r="6.8" stroke="currentColor" stroke-opacity="0.25" stroke-width="1.6"/><path d="M10 3.2A6.8 6.8 0 0 1 16.8 10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="10" cy="10" r="2.2" fill="currentColor"/></svg>`;
    case 'webgl-3d':
      return `<svg viewBox="0 0 20 20" width="17" height="17" fill="none"><circle cx="10" cy="10" r="7" fill="currentColor" fill-opacity="0.12" stroke="currentColor" stroke-width="1.55"/><ellipse cx="10" cy="10" rx="3.2" ry="7" stroke="currentColor" stroke-width="1.35"/><ellipse cx="10" cy="10" rx="7" ry="2.8" stroke="currentColor" stroke-width="1.35"/></svg>`;
    case 'personal':
      return `<svg viewBox="0 0 20 20" width="17" height="17" fill="none"><rect x="2.8" y="3" width="14.4" height="14" rx="3.4" stroke="currentColor" stroke-width="1.55"/><circle cx="10" cy="8.2" r="2.3" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-width="1.45"/><path d="M5.8 14.5C6.8 12.6 8.2 11.8 10 11.8C11.8 11.8 13.2 12.6 14.2 14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;
    case 'landing':
    case 'design-site':
      return `<svg viewBox="0 0 20 20" width="17" height="17" fill="none"><rect x="2.4" y="3.2" width="15.2" height="13.6" rx="3" stroke="currentColor" stroke-width="1.55"/><line x1="2.4" y1="7" x2="17.6" y2="7" stroke="currentColor" stroke-width="1.35"/><circle cx="5" cy="5.1" r="0.8" fill="currentColor"/><circle cx="7.3" cy="5.1" r="0.8" fill="currentColor"/><rect x="5" y="9.4" width="10" height="4.8" rx="1.4" fill="currentColor" fill-opacity="0.16"/></svg>`;
    case 'bento-data':
      return `<svg viewBox="0 0 20 20" width="17" height="17" fill="none"><rect x="2.6" y="3" width="8.6" height="6.4" rx="1.8" fill="currentColor" fill-opacity="0.16" stroke="currentColor" stroke-width="1.5"/><rect x="13" y="3" width="4.4" height="14" rx="1.8" stroke="currentColor" stroke-width="1.5"/><rect x="2.6" y="11.2" width="8.6" height="5.8" rx="1.8" stroke="currentColor" stroke-width="1.5"/><path d="M4.6 15L6.4 13.2L7.8 14.2L9.4 12.4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    case 'style':
      return `<svg viewBox="0 0 20 20" width="17" height="17" fill="none"><circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.55"/><path d="M10 3A7 7 0 0 1 10 17V3Z" fill="currentColor" fill-opacity="0.24"/><circle cx="10" cy="10" r="2.2" fill="currentColor"/></svg>`;
    case 'gallery':
      return `<svg viewBox="0 0 20 20" width="17" height="17" fill="none"><rect x="3" y="4.2" width="11.5" height="11.6" rx="2.2" fill="currentColor" fill-opacity="0.14" stroke="currentColor" stroke-width="1.5"/><path d="M6.2 4.2V3.2A1.4 1.4 0 0 1 7.6 1.8H15.8A1.4 1.4 0 0 1 17.2 3.2V12.8A1.4 1.4 0 0 1 15.8 14.2H14.5" stroke="currentColor" stroke-width="1.4"/><circle cx="6.6" cy="8" r="1.2" fill="currentColor"/><path d="M4.8 13.4L7.8 10.4L10 12.4L12.4 9.8" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    case 'prompt-hub':
      return `<svg viewBox="0 0 20 20" width="17" height="17" fill="none"><path d="M3.2 5.4A2.4 2.4 0 0 1 5.6 3H14.4A2.4 2.4 0 0 1 16.8 5.4V12A2.4 2.4 0 0 1 14.4 14.4H8.2L4.5 17V14.4H5.6A2.4 2.4 0 0 1 3.2 12V5.4Z" fill="currentColor" fill-opacity="0.14" stroke="currentColor" stroke-width="1.55" stroke-linejoin="round"/><path d="M7 7.4H13M7 10.2H11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;
    case 'guide':
      return `<svg viewBox="0 0 20 20" width="17" height="17" fill="none"><rect x="3.4" y="2.6" width="13.2" height="14.8" rx="2.6" fill="currentColor" fill-opacity="0.12" stroke="currentColor" stroke-width="1.55"/><path d="M6.6 6.6H13.4M6.6 10H13.4M6.6 13.4H10.6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;
    case 'skill':
      return `<svg viewBox="0 0 20 20" width="17" height="17" fill="none"><rect x="2.6" y="3.4" width="14.8" height="13.2" rx="3" fill="currentColor" fill-opacity="0.14" stroke="currentColor" stroke-width="1.55"/><path d="M6.4 8L9.2 10.3L6.4 12.6M10.6 12.6H13.6" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    case 'workflow':
      return `<svg viewBox="0 0 20 20" width="17" height="17" fill="none"><circle cx="5" cy="5.5" r="2.3" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="1.5"/><circle cx="15" cy="10" r="2.3" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="1.5"/><circle cx="5" cy="14.5" r="2.3" stroke="currentColor" stroke-width="1.5"/><path d="M7.3 6.2L12.7 9.1M12.7 10.9L7.3 13.8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;
    case 'ai-tool':
    default:
      return `<svg viewBox="0 0 20 20" width="17" height="17" fill="none"><path d="M10.8 2.4L4.4 11H9.6L9 17.6L15.6 9H10.4L10.8 2.4Z" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-width="1.55" stroke-linejoin="round"/></svg>`;
  }
}

export function renderProductSvg(id) {
  switch (id) {
    case 'framescript':
      return `<svg class="prod-svg" viewBox="0 0 24 24" width="20" height="20" fill="none">
        <rect x="2.5" y="3.5" width="19" height="13.5" rx="3.2" fill="currentColor" fill-opacity="0.14" stroke="currentColor" stroke-width="1.65"/>
        <path d="M10.2 8L15 10.4L10.2 12.8V8Z" fill="currentColor"/>
        <path d="M3.5 20.2H20.5" stroke="currentColor" stroke-width="1.65" stroke-linecap="round"/>
        <circle class="ps-node" cx="9" cy="20.2" r="1.8" fill="var(--blue)" stroke="var(--bg-card)" stroke-width="1"/>
        <path d="M6.2 7.8L4.6 10.2L6.2 12.6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" opacity="0.7"/>
      </svg>`;
    case 'taste-clipper':
      return `<svg class="prod-svg" viewBox="0 0 24 24" width="20" height="20" fill="none">
        <path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4H18.5A1.5 1.5 0 0 1 20 5.5V8M20 16V18.5A1.5 1.5 0 0 1 18.5 20H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
        <rect x="7.5" y="7.5" width="9" height="9" rx="2.2" fill="currentColor" fill-opacity="0.16" stroke="currentColor" stroke-width="1.6"/>
        <circle cx="12" cy="12" r="1.8" fill="currentColor"/>
      </svg>`;
    case 'orbit-mcp':
      return `<svg class="prod-svg" viewBox="0 0 24 24" width="20" height="20" fill="none">
        <circle cx="12" cy="12" r="3.4" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="1.65"/>
        <circle cx="5" cy="7" r="2" stroke="currentColor" stroke-width="1.55"/>
        <circle cx="19" cy="7" r="2" stroke="currentColor" stroke-width="1.55"/>
        <circle cx="12" cy="20" r="2" stroke="currentColor" stroke-width="1.55"/>
        <path d="M6.8 8.2L9.4 10.1M17.2 8.2L14.6 10.1M12 15.4V18" stroke="currentColor" stroke-width="1.55" stroke-linecap="round"/>
      </svg>`;
    case 'prompt-pocket':
      return `<svg class="prod-svg" viewBox="0 0 24 24" width="20" height="20" fill="none">
        <rect x="3" y="4" width="18" height="16" rx="4" fill="currentColor" fill-opacity="0.14" stroke="currentColor" stroke-width="1.65"/>
        <rect x="6.5" y="7.5" width="5" height="4" rx="1.2" stroke="currentColor" stroke-width="1.45"/>
        <path d="M14 9.5H17.5M6.5 15.2H17.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
      </svg>`;
    case 'style-dna':
      return `<svg class="prod-svg" viewBox="0 0 24 24" width="20" height="20" fill="none">
        <circle cx="9.5" cy="10.5" r="5" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-width="1.6"/>
        <circle cx="14.8" cy="10.5" r="5" stroke="currentColor" stroke-width="1.6"/>
        <circle cx="12.2" cy="15" r="5" stroke="currentColor" stroke-width="1.6"/>
      </svg>`;
    case 'motion-spec':
      return `<svg class="prod-svg" viewBox="0 0 24 24" width="20" height="20" fill="none">
        <path d="M3.5 16.5C7 16.5 7.5 6.5 11.5 6.5C15.5 6.5 14.5 14.5 17.5 14.5C19.2 14.5 19.8 10.5 21 10.5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
        <circle cx="11.5" cy="6.5" r="2.2" fill="currentColor"/>
        <circle cx="3.5" cy="16.5" r="1.6" fill="currentColor" fill-opacity="0.45"/>
      </svg>`;
    case 'eval-arena':
      return `<svg class="prod-svg" viewBox="0 0 24 24" width="20" height="20" fill="none">
        <rect x="3" y="4" width="7.8" height="16" rx="2.4" fill="currentColor" fill-opacity="0.15" stroke="currentColor" stroke-width="1.6"/>
        <rect x="13.2" y="4" width="7.8" height="16" rx="2.4" stroke="currentColor" stroke-width="1.6"/>
        <path d="M5.4 10.5L6.8 12L9 9.2M15.5 9.5H18.6M15.5 13H17.6" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
    case 'handoff-keeper':
      return `<svg class="prod-svg" viewBox="0 0 24 24" width="20" height="20" fill="none">
        <rect x="3" y="5" width="8" height="14" rx="2.2" stroke="currentColor" stroke-width="1.6"/>
        <rect x="13" y="5" width="8" height="14" rx="2.2" fill="currentColor" fill-opacity="0.16" stroke="currentColor" stroke-width="1.6"/>
        <path d="M9.5 12H14.5M12.8 9.8L15 12L12.8 14.2" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
    case 'squad-builder':
      return `<svg class="prod-svg" viewBox="0 0 24 24" width="20" height="20" fill="none">
        <rect x="8.5" y="3" width="7" height="5" rx="1.6" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="1.55"/>
        <rect x="3" y="15" width="7" height="5" rx="1.6" stroke="currentColor" stroke-width="1.55"/>
        <rect x="14" y="15" width="7" height="5" rx="1.6" stroke="currentColor" stroke-width="1.55"/>
        <path d="M12 8V11.5M12 11.5H6.5V15M12 11.5H17.5V15" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
    case 'ai-native-visualizer':
      return `<svg class="prod-svg" viewBox="0 0 24 24" width="20" height="20" fill="none">
        <polygon points="12 3.2 20.5 8 12 12.8 3.5 8 12 3.2" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
        <polyline points="3.5 12.5 12 17.2 20.5 12.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
        <polyline points="6.5 16.8 12 20 17.5 16.8" stroke="currentColor" stroke-opacity="0.6" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
    case 'signal-radar':
      return `<svg class="prod-svg" viewBox="0 0 24 24" width="20" height="20" fill="none">
        <circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.55"/>
        <circle cx="12" cy="12" r="4.8" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.4"/>
        <path d="M12 12L17.8 6.2" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
        <circle cx="15.8" cy="8.2" r="1.8" fill="currentColor"/>
      </svg>`;
    case 'folio-press':
      return `<svg class="prod-svg" viewBox="0 0 24 24" width="20" height="20" fill="none">
        <rect x="4" y="3.5" width="16" height="17" rx="2.6" fill="currentColor" fill-opacity="0.14" stroke="currentColor" stroke-width="1.6"/>
        <line x1="8.5" y1="3.5" x2="8.5" y2="20.5" stroke="currentColor" stroke-width="1.45"/>
        <path d="M11.5 8.2H16.8M11.5 11.8H16.8M11.5 15.4H14.8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>`;
    case 'deplastic':
      return `<svg class="prod-svg" viewBox="0 0 24 24" width="20" height="20" fill="none">
        <path d="M4 6H20L14.2 12.6V18.2L9.8 20V12.6L4 6Z" fill="currentColor" fill-opacity="0.16" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
      </svg>`;
    case 'proof-frame':
      return `<svg class="prod-svg" viewBox="0 0 24 24" width="20" height="20" fill="none">
        <rect x="3" y="4.5" width="14" height="11" rx="2.2" stroke="currentColor" stroke-width="1.6"/>
        <rect x="14" y="9.5" width="7" height="10" rx="1.8" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-width="1.6"/>
        <path d="M6.5 10.2L8.4 12L11.5 8.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
    case 'night-slip':
    default:
      return `<svg class="prod-svg" viewBox="0 0 24 24" width="20" height="20" fill="none">
        <rect x="4" y="4" width="16" height="16" rx="3.2" fill="currentColor" fill-opacity="0.14" stroke="currentColor" stroke-width="1.6"/>
        <path d="M8 9H16M8 12.5H16M8 16H12.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
        <circle cx="16.2" cy="16" r="1.4" fill="currentColor"/>
      </svg>`;
  }
}

export function renderMonographSvg(index) {
  const idx = index % 4;
  if (idx === 0) {
    // Compounding flywheel diagram
    return `<svg class="mono-blueprint" viewBox="0 0 180 112" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="178" height="110" rx="14" fill="var(--bg-shell)" stroke="var(--border-subtle)"/>
      <circle cx="56" cy="56" r="28" stroke="var(--blue)" stroke-width="1.5" stroke-dasharray="3 3"/>
      <circle cx="56" cy="56" r="12" fill="var(--blue)" fill-opacity="0.15" stroke="var(--blue)" stroke-width="1.5"/>
      <circle class="mb-orbit-dot" cx="56" cy="28" r="3.5" fill="var(--blue)"/>
      <path d="M92 34H156M92 56H148M92 78H160" stroke="currentColor" stroke-opacity="0.28" stroke-width="2" stroke-linecap="round"/>
      <circle cx="92" cy="34" r="3" fill="#10B981"/>
      <circle cx="92" cy="56" r="3" fill="var(--blue)"/>
      <circle cx="92" cy="78" r="3" fill="#F59E0B"/>
    </svg>`;
  }
  if (idx === 1) {
    // Agent harness + on-demand skills
    return `<svg class="mono-blueprint" viewBox="0 0 180 112" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="178" height="110" rx="14" fill="var(--bg-shell)" stroke="var(--border-subtle)"/>
      <rect x="18" y="22" width="62" height="68" rx="9" fill="var(--bg-card)" stroke="var(--blue)" stroke-width="1.5"/>
      <path d="M30 44L38 51L30 58M44 58H58" stroke="var(--blue)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="102" y="22" width="60" height="18" rx="6" fill="var(--bg-card)" stroke="var(--border-strong)"/>
      <rect x="102" y="47" width="60" height="18" rx="6" fill="var(--blue)" fill-opacity="0.14" stroke="var(--blue)"/>
      <rect x="102" y="72" width="60" height="18" rx="6" fill="var(--bg-card)" stroke="var(--border-strong)"/>
      <path d="M80 56H102" stroke="var(--blue)" stroke-width="1.6" stroke-dasharray="3 2"/>
    </svg>`;
  }
  if (idx === 2) {
    // Card-in-Card clean UI geometry
    return `<svg class="mono-blueprint" viewBox="0 0 180 112" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="178" height="110" rx="14" fill="var(--bg-shell)" stroke="var(--border-subtle)"/>
      <rect x="22" y="18" width="136" height="76" rx="14" fill="var(--bg-subtle)" stroke="var(--border-strong)"/>
      <rect x="30" y="26" width="120" height="60" rx="10" fill="var(--bg-card)" stroke="var(--border-subtle)"/>
      <circle cx="46" cy="44" r="6" fill="var(--blue)"/>
      <rect x="58" y="40" width="54" height="5" rx="2.5" fill="currentColor" fill-opacity="0.7"/>
      <rect x="40" y="58" width="96" height="4" rx="2" fill="currentColor" fill-opacity="0.22"/>
      <rect x="40" y="68" width="68" height="4" rx="2" fill="currentColor" fill-opacity="0.22"/>
    </svg>`;
  }
  // Pyramid 4-pillar mental model
  return `<svg class="mono-blueprint" viewBox="0 0 180 112" fill="none" aria-hidden="true">
    <rect x="1" y="1" width="178" height="110" rx="14" fill="var(--bg-shell)" stroke="var(--border-subtle)"/>
    <polygon points="90 20 148 88 32 88" fill="var(--blue)" fill-opacity="0.1" stroke="var(--blue)" stroke-width="1.5" stroke-linejoin="round"/>
    <line x1="68" y1="46" x2="112" y2="46" stroke="var(--blue)" stroke-width="1.3"/>
    <line x1="50" y1="67" x2="130" y2="67" stroke="var(--blue)" stroke-width="1.3"/>
    <circle cx="90" cy="20" r="3.5" fill="var(--blue)"/>
  </svg>`;
}
