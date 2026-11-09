import { getVisitorId } from '@/lib/visitor';

const DISPLAY_NAME_KEY = 'pixelify_display_name_v1';
const PENDING_NAME_KEY = 'pixelify_pending_display_name_v1';
const NAME_PROMPT_KEY = 'pixelify_display_name_prompted_v1';
export const EDIT_VISITOR_NAME_EVENT = 'pixelify:edit-visitor-name';
export const VISITOR_PROFILE_UPDATED_EVENT = 'pixelify:visitor-profile-updated';

export function getSavedDisplayName() {
  try { return window.localStorage.getItem(DISPLAY_NAME_KEY) || ''; } catch { return ''; }
}

export function wasNamePromptResolved() {
  try { return window.localStorage.getItem(NAME_PROMPT_KEY) === 'true'; } catch { return true; }
}

export function resolveNamePrompt() {
  try { window.localStorage.setItem(NAME_PROMPT_KEY, 'true'); } catch { /* Keep the current session usable. */ }
}

export function queueDisplayName(name: string) {
  try {
    if (name) window.localStorage.setItem(DISPLAY_NAME_KEY, name);
    else window.localStorage.removeItem(DISPLAY_NAME_KEY);
    window.localStorage.setItem(PENDING_NAME_KEY, name || 'Pixelify User');
    window.dispatchEvent(new Event(VISITOR_PROFILE_UPDATED_EVENT));
    return true;
  } catch {
    return false;
  }
}

export async function syncPendingDisplayName() {
  let name = '';
  try { name = window.localStorage.getItem(PENDING_NAME_KEY) || ''; } catch { return false; }
  if (!name) return true;

  try {
    const response = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ visitorId: getVisitorId(), displayName: name }),
    });
    if (!response.ok) return false;
    if (window.localStorage.getItem(PENDING_NAME_KEY) === name) window.localStorage.removeItem(PENDING_NAME_KEY);
    window.dispatchEvent(new Event(VISITOR_PROFILE_UPDATED_EVENT));
    return true;
  } catch {
    return false;
  }
}

export function requestDisplayNameEdit() {
  window.dispatchEvent(new Event(EDIT_VISITOR_NAME_EVENT));
}
