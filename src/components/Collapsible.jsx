import React, { useId, useState } from 'react';

export default function Collapsible({ title, icon, meta, defaultOpen = false, className = '', children }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();

  return (
    <section className={`collapsible ${open ? 'open' : ''} ${className}`}>
      <button
        type="button"
        className="collapsible-header"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
      >
        {icon && <span className="collapsible-icon" aria-hidden="true">{icon}</span>}
        <span className="collapsible-title">{title}</span>
        {meta && <span className="collapsible-meta">{meta}</span>}
        <span className="chevron" aria-hidden="true">▾</span>
      </button>
      {open && (
        <div className="collapsible-body" id={id}>
          {children}
        </div>
      )}
    </section>
  );
}
