import React from 'react';
import './App.css';

import Navbar from './components/Navbar';
import CryptoQuote from './components/CryptoQuote';

const App: React.FC = () => {
  return (
    <div className='App'>
      <Navbar />
      <CryptoQuote count={1} />
    </div>
  );
};

export default App;
