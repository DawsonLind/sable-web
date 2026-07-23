import Dashboard from "./dashboard";

export default function Home() {
  return (
    <main className="container">
      <header className="header">
        <div className="brand">
          <div className="logo">S</div>
          <div>
            <h1>Sable CRM</h1>
            <div className="subtitle">Lightweight B2B sales pipeline</div>
          </div>
        </div>
      </header>
      <Dashboard />
    </main>
  );
}
