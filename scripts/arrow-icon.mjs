// Fixed vector geometry avoids platform-specific emoji and font substitution.
export function arrowIcon(direction = 'ne') {
  const rotation = { ne: 0, se: 90, right: 45, left: 225, up: -45 }[direction];
  if (rotation === undefined) throw new Error(`Unknown arrow direction: ${direction}`);
  return `<span class="arrow-icon" aria-hidden="true"><svg class="ui-arrow" viewBox="0 0 24 24" fill="none" focusable="false"><path d="M5 19L19 5M5 5H19V19" transform="rotate(${rotation} 12 12)" stroke="currentColor" stroke-width="1.6" stroke-linecap="square" stroke-linejoin="miter"/></svg></span>`;
}
