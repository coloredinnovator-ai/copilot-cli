// Public Dashboard - Main entry point for public data viewer

import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';

const MapDashboard = dynamic(() => import('../components/MapDashboard'), {
  ssr: false,
});

export default function PublicDashboard() {
  return (
    <div className="dashboard-container">
      <Head>
        <title>GNIS Public Data Viewer</title>
        <meta name="description" content="Geographic Names Information System - Public Data Viewer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="dashboard-header">
        <div className="header-content">
          <h1>GNIS Public Data Viewer</h1>
          <p>Enterprise Geographic Intelligence System</p>
        </div>
        <nav className="dashboard-nav">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/api-docs">API Docs</a>
          <a href="/contact">Contact</a>
        </nav>
      </header>

      <main className="dashboard-main">
        <MapDashboard />
      </main>

      <footer className="dashboard-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>About GNIS</h3>
            <p>Enterprise-grade geospatial intelligence and data infrastructure.</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/docs">Documentation</a></li>
              <li><a href="/api">API Reference</a></li>
              <li><a href="/governance">Governance</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contact</h3>
            <p>Email: info@gnis.enterprise.gov</p>
            <p>Support: support@gnis.enterprise.gov</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 GNIS Enterprise Infrastructure. All rights reserved.</p>
          <p>Status: ✅ Enterprise-Ready • 🔒 Truth-Governed • 🌐 Multi-Cloud</p>
        </div>
      </footer>

      <style jsx>{`
        .dashboard-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .dashboard-header {
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          color: white;
          padding: 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        .header-content h1 {
          margin: 0 0 0.5rem 0;
          font-size: 2rem;
        }
        .header-content p {
          margin: 0;
          opacity: 0.8;
        }
        .dashboard-nav {
          margin-top: 1rem;
          display: flex;
          gap: 2rem;
        }
        .dashboard-nav a {
          color: white;
          text-decoration: none;
          transition: opacity 0.2s;
        }
        .dashboard-nav a:hover {
          opacity: 0.7;
        }
        .dashboard-main {
          flex: 1;
        }
        .dashboard-footer {
          background: #1a1a1a;
          color: white;
          padding: 2rem;
        }
        .footer-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }
        .footer-section h3 {
          margin: 0 0 1rem 0;
          font-size: 1.1rem;
        }
        .footer-section p {
          margin: 0.5rem 0;
          opacity: 0.8;
        }
        .footer-section ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .footer-section li {
          margin: 0.5rem 0;
        }
        .footer-section a {
          color: white;
          text-decoration: none;
          opacity: 0.8;
          transition: opacity 0.2s;
        }
        .footer-section a:hover {
          opacity: 1;
        }
        .footer-bottom {
          text-align: center;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          opacity: 0.6;
        }
        .footer-bottom p {
          margin: 0.5rem 0;
        }
      `}</style>
    </div>
  );
}
