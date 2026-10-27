import React, { useState } from 'react';

const isLocal = ['localhost', '127.0.0.1', ''].includes(window.location.hostname);

function fileUrl(folder, file) {
  return `${folder}/${encodeURIComponent(file)}`;
}

function SlideFile({ folder, file, label }) {
  const isPdf = /\.pdf$/i.test(file);
  // PDFs open right away; a .pptx waits for a click (the online viewer is slower).
  const [show, setShow] = useState(isPdf);
  const url = fileUrl(folder, file);
  const absolute = new URL(url, window.location.href).href;
  // Microsoft's free viewer can show a .pptx, but only from a public URL (works on GitHub Pages, not localhost).
  const officeViewer = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(absolute)}`;
  const canEmbed = isPdf || !isLocal;

  return (
    <div className="slide-file">
      <div className="slide-file-row">
        <span className="slide-file-name">{isPdf ? '📄' : '📊'} {label || file}</span>
        <div className="btn-row">
          {canEmbed && (
            <button type="button" className="btn btn-small" onClick={() => setShow((s) => !s)}>
              {show ? 'Hide slides' : 'Show slides here'}
            </button>
          )}
          <a className="btn btn-small btn-ghost" href={url} download>
            Download
          </a>
          {isPdf && (
            <a className="btn btn-small btn-ghost" href={url} target="_blank" rel="noreferrer">
              Open in new tab
            </a>
          )}
        </div>
      </div>
      {!isPdf && isLocal && (
        <p className="hint">On your computer (localhost) a .pptx can only be downloaded. Once the site is on GitHub Pages it can be shown here. Tip: also export a PDF copy — PDFs show everywhere.</p>
      )}
      {show && <iframe className="slide-frame" title={label || file} src={isPdf ? url : officeViewer} allowFullScreen />}
    </div>
  );
}

export default function PowerPointSection({ weekId, powerpoint }) {
  const folder = `powerpoints/${weekId}`;
  // A file can be listed as 'slides.pdf' or as { file: 'slides.pdf', label: 'Wednesday slides' }.
  const files = (powerpoint?.files ?? []).map((f) => (typeof f === 'string' ? { file: f } : f));

  if (!files.length) {
    return (
      <div className="empty-state">
        <p>No slides yet for this week.</p>
        <p className="hint">
          Put the file in <code>static/{folder}/</code> and add its name to <code>files</code> in{' '}
          <code>src/weeks/{weekId}.js</code>. PDFs are shown right here.
        </p>
      </div>
    );
  }

  return (
    <div className="slide-files">
      {files.map((f) => (
        <SlideFile key={f.file} folder={folder} {...f} />
      ))}
    </div>
  );
}
