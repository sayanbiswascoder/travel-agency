'use client';

import React from 'react';

export default function ScrollLink({ targetId, children, className }: { targetId: string; children: React.ReactNode; className?: string }) {
  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      // remove hash from URL while keeping path and query
      const url = window.location.pathname + window.location.search;
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', url);
      }
    } catch (err) {
      console.error('ScrollLink error', err);
    }
  };

  return (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <a href={`#${targetId}`} onClick={onClick} className={className}>
      {children}
    </a>
  );
}
