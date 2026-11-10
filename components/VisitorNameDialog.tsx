'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getVisitorId } from '@/lib/visitor';
import {
  EDIT_VISITOR_NAME_EVENT,
  getSavedDisplayName,
  queueDisplayName,
  resolveNamePrompt,
  syncPendingDisplayName,
  wasNamePromptResolved,
} from '@/lib/visitor-profile';

export default function VisitorNameDialog() {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    try { getVisitorId(); } catch { return; }

    void syncPendingDisplayName();

    const editName = () => {
      setIsEditing(true);
      setName(getSavedDisplayName());
      setError('');
      setOpen(true);
    };
    const syncName = () => { void syncPendingDisplayName(); };
    window.addEventListener(EDIT_VISITOR_NAME_EVENT, editName);
    window.addEventListener('online', syncName);
    return () => {
      window.removeEventListener(EDIT_VISITOR_NAME_EVENT, editName);
      window.removeEventListener('online', syncName);
    };
  }, []);

  useEffect(() => {
    if (!/^\/(?:[a-z]{2}\/)?leaderboard\/?$/.test(pathname || '')) return;
    try { getVisitorId(); } catch { return; }

    if (getSavedDisplayName()) {
      resolveNamePrompt();
      return;
    }
    if (!wasNamePromptResolved()) {
      setIsEditing(false);
      setName('');
      setOpen(true);
    }
  }, [pathname]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const close = () => {
    if (!isEditing) resolveNamePrompt();
    setError('');
    setOpen(false);
  };

  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanName = name.replace(/\s+/g, ' ').trim();
    if (cleanName.length < 1 || cleanName.length > 32) {
      setError('Enter a name between 1 and 32 characters.');
      return;
    }
    if (!queueDisplayName(cleanName)) {
      setError('Your browser could not save this name. Check its storage settings and try again.');
      return;
    }

    resolveNamePrompt();
    setError('');
    setOpen(false);
    void syncPendingDisplayName();
  };

  const useAnonymousName = () => {
    if (!queueDisplayName('')) {
      setError('Your browser could not save this change. Check its storage settings and try again.');
      return;
    }
    resolveNamePrompt();
    setOpen(false);
    void syncPendingDisplayName();
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="visitor-name-title"
      aria-describedby="visitor-name-description"
      onCancel={(event) => { event.preventDefault(); close(); }}
      onClick={(event) => { if (event.target === event.currentTarget) close(); }}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[min(420px,calc(100vw-2rem))] max-w-none overflow-y-auto rounded-2xl border border-white/10 bg-[#111114] p-0 text-white shadow-[0_24px_80px_rgba(0,0,0,0.65)] backdrop:bg-black/75"
    >
      <form onSubmit={save} className="p-5 sm:p-6">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-200/80">Pixelify community</p>
          <h2 id="visitor-name-title" className="mt-2 text-xl font-bold tracking-tight">
            {isEditing ? 'Your leaderboard name' : 'Choose a name'}
          </h2>
          <p id="visitor-name-description" className="mt-2 text-sm leading-5 text-white/55">
            {isEditing ? 'Change how you appear on the leaderboard, or return to an anonymous profile.' : 'Add a name to your leaderboard profile, or skip and stay anonymous. You can change this later in Settings.'}
          </p>
        </div>

        <label htmlFor="visitor-display-name" className="mb-1.5 block text-xs font-medium text-white/70">Display name</label>
        <input
          id="visitor-display-name"
          autoFocus
          type="text"
          value={name}
          onChange={(event) => { setName(event.target.value); setError(''); }}
          maxLength={32}
          autoComplete="nickname"
          placeholder="Enter your name"
          className="h-11 w-full rounded-xl border border-white/15 bg-black/30 px-3 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-sky-200/60 focus:ring-2 focus:ring-sky-200/15"
        />
        <p className={`mt-1.5 min-h-4 text-xs ${error ? 'text-rose-300' : 'text-white/35'}`} aria-live="polite">
          {error || 'Up to 32 characters'}
        </p>

        <div className="mt-5 flex items-center justify-end gap-2">
          {isEditing && <button type="button" onClick={useAnonymousName} className="mr-auto min-h-10 rounded-xl px-2 text-xs font-medium text-white/45 transition-colors hover:bg-white/[0.06] hover:text-white/80">Use anonymous name</button>}
          {!isEditing && <button type="button" onClick={close} className="min-h-10 rounded-xl px-3 text-sm font-medium text-white/65 transition-colors hover:bg-white/[0.06] hover:text-white">Skip</button>}
          {isEditing && <button type="button" onClick={close} className="min-h-10 rounded-xl px-3 text-sm font-medium text-white/65 transition-colors hover:bg-white/[0.06] hover:text-white">Cancel</button>}
          <button type="submit" className="min-h-10 rounded-xl bg-sky-200 px-4 text-sm font-semibold text-[#071016] transition-colors hover:bg-sky-100 active:bg-sky-300">Save name</button>
        </div>
      </form>
    </dialog>
  );
}
