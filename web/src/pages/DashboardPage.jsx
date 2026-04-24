import React from 'react';

export default function DashboardPage({ data }) {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">Overview</p>
        <h3 className="section-title">Observability, UDP sender, and SSH demo in one React app</h3>
        <p>The frontend is now fully React-based while preserving the current telemetry dashboard and message sender behavior.</p>
      </section>
      <div className="metrics">
        <article className="metric-card"><p className="label">Events in 24h</p><p className="value">{data.overview.events24h}</p></article>
        <article className="metric-card"><p className="label">Active rules</p><p className="value">{data.overview.activeRules}</p></article>
        <article className="metric-card"><p className="label">Unique sources</p><p className="value">{data.overview.uniqueSources}</p></article>
        <article className="metric-card"><p className="label">Drop ratio</p><p className="value">{data.overview.dropRatio}</p></article>
      </div>
      <div className="grid-2">
        <section className="panel"><p className="eyebrow">Activity Curve</p><h3 className="section-title">Detection timeline</h3><div className="mini-bars">{data.trend.map((item) => <div className="bar-row" key={item.label}><span>{item.label}</span><div className="bar" style={{ width: `${Math.max(item.value * 2, 8)}px` }} /><strong>{item.value}</strong></div>)}</div></section>
        <section className="panel"><p className="eyebrow">Matched Rules</p><h3 className="section-title">Top profiles</h3><div className="stack">{data.topRules.map((rule) => <div className="rule-card" key={rule.name}><div className="split"><strong>{rule.name}</strong><span className="badge sample">{rule.hits} hits</span></div></div>)}</div></section>
      </div>
    </>
  );
}
