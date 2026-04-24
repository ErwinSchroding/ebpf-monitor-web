import React from 'react';

export default function UdpSenderPage({ sender, setSender, payload, encodedLength, sendResult, onSubmit }) {
  return (
    <section className="panel sender-panel">
      <div className="table-header"><p className="eyebrow">UDP Sender</p><h3 className="section-title">Compose a fixed-length UDP payload</h3><p className="muted">Password controls the prefix, END is fixed, and the payload is padded to 200 bytes.</p></div>
      <form className="sender-form" onSubmit={onSubmit}>
        <label>Target host<input value={sender.targetHost} onChange={(e) => setSender({ ...sender, targetHost: e.target.value })} /></label>
        <label>Target port<input type="number" value={sender.targetPort} onChange={(e) => setSender({ ...sender, targetPort: e.target.value })} /></label>
        <label>Password<input value={sender.password} onChange={(e) => setSender({ ...sender, password: e.target.value })} /></label>
        <label className="sender-message-field">Message<textarea rows="6" value={sender.message} onChange={(e) => setSender({ ...sender, message: e.target.value })} /></label>
        <div className="sender-actions"><button className="primary-button" type="submit">Send UDP message</button></div>
      </form>
      <div className="preview-grid">
        <article className="preview-card"><p className="eyebrow">Preview</p><pre>{`${payload}\n\nEncoded length: ${encodedLength} bytes\nPadded length: 200 bytes`}</pre></article>
        <article className="preview-card"><p className="eyebrow">Rules</p><ul className="preview-list"><li>Password controls the prefix</li><li>END is fixed</li><li>Payload is padded to 200 bytes</li></ul><div className="muted">{sendResult}</div></article>
      </div>
    </section>
  );
}
