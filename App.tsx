import React, { useState, useEffect } from 'react';
import { ViewState } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/views/Home';
import Archive from './components/views/Archive';
import Bio from './components/views/Bio';
import Locations from './components/views/Locations';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);

  // Ensure page scrolls to top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  const renderView = () => {
    switch (currentView) {
      case ViewState.HOME:
        return <Home setViewState={setCurrentView} />;
      case ViewState.ARCHIVE:
        return <Archive />;
      case ViewState.BIO:
        return <Bio />;
      case ViewState.LOCATIONS:
        return <Locations />;
      default:
        return <Home setViewState={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 bg-vallenato-beige selection:bg-vallenato-mustard selection:text-vallenato-blue">
      <Header currentView={currentView} onNavigate={setCurrentView} />
      
      <main className="flex-grow">
        {renderView()}
      </main>

      <Footer />
    </div>
  );
};

export default App;