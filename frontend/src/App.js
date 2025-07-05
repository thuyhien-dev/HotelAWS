import React from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div className="app-wrapper">
      <Header />
      <Sidebar />
      <main className="app-main">
        <Dashboard />
      </main>
      <Footer />
    </div>
  );
}

export default App;
