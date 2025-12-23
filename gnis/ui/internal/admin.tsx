// Internal Admin Dashboard

import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';

const DataQualityMonitor = dynamic(() => import('../components/DataQualityMonitor'), {
  ssr: false,
});

export default function InternalDashboard() {
  return (
    <div className="admin-container">
      <Head>
        <title>GNIS Admin Dashboard</title>
        <meta name="description" content="GNIS Internal Administration Dashboard" />
      </Head>

      <header className="admin-header">
        <h1>GNIS Admin Dashboard</h1>
        <div className="admin-user">
          <span>👤 Admin User</span>
          <button>Logout</button>
        </div>
      </header>

      <div className="admin-layout">
        <aside className="admin-sidebar">
          <nav>
            <a href="/admin" className="active">📊 Dashboard</a>
            <a href="/admin/ingestion">📥 Ingestion</a>
            <a href="/admin/governance">🛡️ Governance</a>
            <a href="/admin/users">👥 Users</a>
            <a href="/admin/audit">📋 Audit Logs</a>
            <a href="/admin/settings">⚙️ Settings</a>
          </nav>
        </aside>

        <main className="admin-main">
          <DataQualityMonitor />
        </main>
      </div>

      <style jsx>{`
        .admin-container {
          min-height: 100vh;
          background: #f0f0f0;
        }
        .admin-header {
          background: #1a1a1a;
          color: white;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .admin-header h1 {
          margin: 0;
          font-size: 1.5rem;
        }
        .admin-user {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .admin-user button {
          padding: 0.5rem 1rem;
          border: none;
          background: #f44336;
          color: white;
          border-radius: 4px;
          cursor: pointer;
        }
        .admin-layout {
          display: flex;
          min-height: calc(100vh - 60px);
        }
        .admin-sidebar {
          width: 250px;
          background: #2d2d2d;
          color: white;
        }
        .admin-sidebar nav {
          display: flex;
          flex-direction: column;
        }
        .admin-sidebar a {
          padding: 1rem 1.5rem;
          color: white;
          text-decoration: none;
          transition: background 0.2s;
        }
        .admin-sidebar a:hover,
        .admin-sidebar a.active {
          background: #3d3d3d;
        }
        .admin-main {
          flex: 1;
        }
      `}</style>
    </div>
  );
}
