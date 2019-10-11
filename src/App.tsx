import React, { useState } from 'react';
import './App.css';

import Navbar from './components/Navbar';
import Routes from './components/Routes';

import { AugmentedData, StringMap } from './components/CryptoQuote';

const INITIAL_GAME_STATE = {
  data: {} as AugmentedData,
  selectedPlainChar: '',
  selectedEncryptedChar: ''
};

const App: React.FC = () => {
  // Game - kept in App to persist even when game component is
  // unmounted, ie, user clicks to other page and back.
  const [gameState, setGameState] = useState(INITIAL_GAME_STATE);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const [undoGameState, setUndoGameState] = useState<
    {
      guessMap: StringMap;
      reverseGuessMap: StringMap;
    }[]
  >([]);
  const [redoGameState, setRedoGameState] = useState<
    {
      guessMap: StringMap;
      reverseGuessMap: StringMap;
    }[]
  >([]);
  //

  const [user, setUser] = useState('');
  const paths = [{ to: '/', text: 'Game' }, { to: '/about', text: 'About' }];
  if (user) {
    paths.push({ to: '/logout', text: 'Logout' });
  } else {
    paths.push({ to: '/login', text: 'Login' });
  }

  return (
    <div className='App'>
      <Navbar user={user} paths={paths} />
      <Routes
        user={user}
        setUser={setUser}
        setIsLoaded={setIsLoaded}
        game={{
          gameState,
          setGameState,
          isLoaded,
          setIsLoaded,
          isWinner,
          setIsWinner,
          undoGameState,
          setUndoGameState,
          redoGameState,
          setRedoGameState
        }}
      />
    </div>
  );
};

export default App;
