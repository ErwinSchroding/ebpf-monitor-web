CREATE TABLE rules (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    enabled INTEGER NOT NULL DEFAULT 1,
    protocol TEXT NOT NULL DEFAULT 'UDP',
    start_marker TEXT NOT NULL,
    end_marker TEXT,
    expected_payload_length INTEGER NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('PASS', 'DROP', 'SAMPLE_ONLY')),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE rule_versions (
    id TEXT PRIMARY KEY,
    rule_id TEXT NOT NULL,
    version INTEGER NOT NULL,
    snapshot_json TEXT NOT NULL,
    created_at TEXT NOT NULL,
    created_by TEXT NOT NULL,
    FOREIGN KEY (rule_id) REFERENCES rules(id)
);

CREATE TABLE events (
    id TEXT PRIMARY KEY,
    observed_at TEXT NOT NULL,
    ifindex INTEGER NOT NULL,
    source_ip TEXT NOT NULL,
    destination_ip TEXT NOT NULL,
    source_port INTEGER NOT NULL,
    destination_port INTEGER NOT NULL,
    protocol TEXT NOT NULL,
    payload_length INTEGER NOT NULL,
    start_marker_hit INTEGER NOT NULL,
    end_marker_hit INTEGER NOT NULL,
    payload_preview TEXT,
    payload_hash TEXT NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('PASS', 'DROP', 'SAMPLE_ONLY')),
    rule_id TEXT,
    FOREIGN KEY (rule_id) REFERENCES rules(id)
);

CREATE TABLE audit_logs (
    id TEXT PRIMARY KEY,
    actor TEXT NOT NULL,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT NOT NULL,
    summary TEXT NOT NULL,
    created_at TEXT NOT NULL
);
