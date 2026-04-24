import React from 'react';
import Badge from '../components/Badge.jsx';

export function EventsPage({ data }) {
  return (
    <section className="table-card">
      <div className="table-header"><p className="eyebrow">Events</p><h3 className="section-title">Recent detections</h3></div>
      <table>
        <thead><tr><th>Time</th><th>Source</th><th>Destination</th><th>Rule</th><th>Action</th><th>Payload</th><th>Evidence</th></tr></thead>
        <tbody>{data.events.map((event) => <tr key={`${event.time}-${event.source}`}><td>{event.time}</td><td>{event.source}</td><td>{event.destination}</td><td>{event.rule}</td><td><Badge action={event.action}>{event.action}</Badge></td><td>{`${event.payloadLength} bytes`}</td><td><div><strong>{event.preview}</strong></div><div className="muted">{event.hash}</div></td></tr>)}</tbody>
      </table>
    </section>
  );
}

export function RulesPage({ data }) {
  return <section className="panel"><p className="eyebrow">Rule Management</p><h3 className="section-title">Profiles and response policy</h3><div className="stack">{data.rules.map((rule) => <article className="rule-card" key={rule.name}><div className="split"><div><strong>{rule.name}</strong><p className="muted">{rule.match}</p></div><Badge action={rule.action}>{rule.action}</Badge></div><p>{rule.note}</p><p className="muted">Status: {rule.status}</p></article>)}</div></section>;
}

export function AuditPage({ data }) {
  return <section className="panel"><p className="eyebrow">Audit Trail</p><h3 className="section-title">Administrative history</h3><div className="stack">{data.audit.map((item) => <article className="audit-card" key={`${item.time}-${item.action}`}><div className="split"><strong>{item.action}</strong><span className="muted">{item.time}</span></div><p>{item.summary}</p><p className="muted">{item.actor} on {item.target}</p></article>)}</div></section>;
}
