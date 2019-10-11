import React, { useState, useEffect, KeyboardEvent, ChangeEvent } from 'react';
import axios, { AxiosResponse } from 'axios';
import Character from './Character';
import Space from './Space';
import Punctuation from './Punctuation';

// import '../images/undo-solid.svg'
import './CryptoQuote.css';

interface CryptoQuoteProps {
  count: number;
}

enum quoteCategory {
  Movies = 'movies',
  Famous = 'famous'
}

type QuoteData = {
  author: string;
  category: quoteCategory;
  quote: string;
};

type AugmentedData = {
  author: string;
  category: quoteCategory;
  quote: string;
  encryptMap: { [key: string]: string };
  guessMap: { [key: string]: string };
  reverseGuessMap: { [key: string]: string };
};

type Move = {
  plainChar: string;
  encryptedChar: string;
};

const INITIAL_GAME_STATE = {
  data: {} as AugmentedData,
  selectedPlainChar: '',
  selectedEncryptedChar: ''
};

const alphaArray = Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ');

export default function CryptoQuote(props: CryptoQuoteProps): JSX.Element {
  const [gameState, setGameState] = useState(INITIAL_GAME_STATE);
  const [isLoading, setIsLoading] = useState(true);
  const [isWinner, setIsWinner] = useState(false);
  const [undoGameState, setUndoGameState] = useState<
    {
      guessMap: { [key: string]: string };
      reverseGuessMap: { [key: string]: string };
    }[]
  >([]);
  const [redoGameState, setRedoGameState] = useState<
    {
      guessMap: { [key: string]: string };
      reverseGuessMap: { [key: string]: string };
    }[]
  >([]);

  const augmentData = (data: QuoteData): AugmentedData => {
    const generateCryptoMap = () => {
      const encryptMap = {} as { [key: string]: string };
      const guessMap = {} as { [key: string]: string };
      const reverseGuessMap = {} as { [key: string]: string };
      const keys = [...alphaArray];
      const values = [...alphaArray];
      keys.forEach(key => {
        let index: number;
        let value: string;
        do {
          index = Math.floor(Math.random() * values.length);
          value = values[index];
        } while (key === value);
        encryptMap[key] = value;
        values.splice(index, 1);
      });

      return [encryptMap, guessMap, reverseGuessMap];
    };

    const augAuthor = data.author.toUpperCase();
    const augQuote = data.quote.toUpperCase();
    const [encryptMap, guessMap, reverseGuessMap] = generateCryptoMap();

    const augmentedData = {
      category: data.category,
      author: augAuthor,
      quote: augQuote,
      encryptMap,
      guessMap,
      reverseGuessMap
    };

    return augmentedData;
  };

  useEffect((): void => {
    const getRandomQuote = async () => {
      const categories = Object.values(quoteCategory);
      const randomCat = Math.floor(Math.random() * categories.length);
      const category = categories[randomCat];

      // const response: AxiosResponse = await axios.get(
      //   'https://wmoore98-quote.herokuapp.com/api/quotes'
      // );

      const response: AxiosResponse = await axios.get(
        'http://localhost:3001/api/quotes'
      );

      // const response = {
      //   data: [
      //     {
      //       author: 'Bjarne Stroustrup',
      //       category: 'Famous',
      //       quote:
      //         'C makes it easy to shoot yourself in the foot; C++ makes it harder, but when you do, it blows away your whole leg.'
      //     }
      //   ]
      // };

      console.log(category, response.data);

      const data = response.data[0] as QuoteData;
      const augmentedData: AugmentedData = augmentData(data);
      setGameState({ ...INITIAL_GAME_STATE, data: augmentedData });
      setIsLoading(false);
    };
    getRandomQuote();
  }, []);

  useEffect((): void => {
    const { quote, author, guessMap, encryptMap } = gameState.data;
    if (!quote) return;

    const win = `${quote}${author}`.split('').every(char => {
      return guessMap[char] === encryptMap[char];
    });

    if (win) setIsWinner(win);
  }, [gameState.data, isWinner]);

  const updateGuessMap = ({ plainChar, encryptedChar }: Move): void => {
    const generateReverseMap = (map: {
      [key: string]: string;
    }): { [key: string]: string } => {
      const reverseMap = {} as { [key: string]: string };

      // remove encryptedChar from guessMap - if previously guessed
      const oldGuess = gameState.data.reverseGuessMap[encryptedChar];
      if (oldGuess) map[oldGuess] = '';

      Object.keys(map).forEach(key => {
        if (map[key]) reverseMap[map[key]] = key;
      });
      return reverseMap;
    };

    const data = { ...gameState.data };
    const guessMap = { ...data.guessMap };
    guessMap[plainChar] = encryptedChar;
    const reverseGuessMap = generateReverseMap(guessMap);
    data.guessMap = guessMap;
    data.reverseGuessMap = reverseGuessMap;

    setGameState({
      ...gameState,
      data,
      selectedPlainChar: '',
      selectedEncryptedChar: ''
    });
  };

  const newMove = (move: Move): void => {
    const undoGS = [...undoGameState];
    undoGS.push({
      guessMap: { ...gameState.data.guessMap },
      reverseGuessMap: { ...gameState.data.reverseGuessMap }
    });

    if (redoGameState.length) setRedoGameState([]);
    setUndoGameState(undoGS);
    updateGuessMap(move);
  };

  const undoMove = (): void => {
    const undoGS = [...undoGameState];
    const lastGameState = undoGS.pop();

    if (lastGameState) {
      const data = { ...gameState.data };

      // save current game state for redo
      const redoGS = [...redoGameState];
      redoGS.push({
        guessMap: { ...data.guessMap },
        reverseGuessMap: { ...data.reverseGuessMap }
      });

      data.guessMap = lastGameState.guessMap;
      data.reverseGuessMap = lastGameState.reverseGuessMap;

      setRedoGameState(redoGS);
      setUndoGameState(undoGS);
      setGameState({ ...gameState, data });
    }
  };

  const redoMove = (): void => {
    const redoGS = [...redoGameState];
    const nextGameState = redoGS.pop();
    if (nextGameState) {
      const data = { ...gameState.data };

      // save current game state for undo
      const undoGS = [...undoGameState];
      undoGS.push({
        guessMap: { ...data.guessMap },
        reverseGuessMap: { ...data.reverseGuessMap }
      });

      data.guessMap = nextGameState.guessMap;
      data.reverseGuessMap = nextGameState.reverseGuessMap;

      setUndoGameState(undoGS);
      setRedoGameState(redoGS);
      setGameState({ ...gameState, data });
    }
  };

  const selectEncryptedChar = (selectedEncryptedChar: string): void => {
    setGameState({ ...gameState, selectedEncryptedChar });
    if (gameState.selectedPlainChar) {
      setTimeout(() => {
        newMove({
          plainChar: gameState.selectedPlainChar,
          encryptedChar: selectedEncryptedChar
        });
      }, 300);
    }
  };

  const selectPlainChar = (selectedPlainChar: string): void => {
    setGameState({ ...gameState, selectedPlainChar });
    if (gameState.selectedEncryptedChar) {
      setTimeout(() => {
        newMove({
          plainChar: selectedPlainChar,
          encryptedChar: gameState.selectedEncryptedChar
        });
      }, 300);
    }
  };

  const renderString = (str: string, type: string): JSX.Element => {
    const { encryptMap, reverseGuessMap } = gameState.data;
    const result = str.split(' ').map((word, wordIndex) => (
      <div key={`${type}:w${wordIndex}`} style={{ display: 'inline-block' }}>
        {word.split('').map((char, charIndex) => {
          let encryptedChar = encryptMap[char];
          let guessChar = reverseGuessMap[encryptedChar];
          if (!encryptedChar) {
            encryptedChar = char;
            guessChar = char;
            return (
              <Punctuation
                key={`${type}:w${wordIndex}c${charIndex}`}
                char={char}
              />
            );
          } else {
            if (!guessChar) guessChar = '_';
            return (
              <Character
                key={`${type}:w${wordIndex}c${charIndex}`}
                topChar={guessChar}
                bottomChar={encryptedChar}
                onClick={selectEncryptedChar}
                isSelected={encryptedChar === gameState.selectedEncryptedChar}
              />
            );
          }
        })}
        <Space key={`${type}:space${wordIndex}`} />
      </div>
    ));

    return <>{result}</>;
  };

  const renderControls = (): JSX.Element => {
    return (
      <section className='CryptoQuote-controls'>
        <span className='undoBtn'>
          <button
            className='btn'
            disabled={!undoGameState.length}
            onClick={undoMove}
          >
            <i className='fas fa-undo'></i>
          </button>
        </span>
        <span className='undoBtn'>
          <button
            className='btn'
            disabled={!redoGameState.length}
            onClick={redoMove}
          >
            <i className='fas fa-redo'></i>
          </button>
        </span>
      </section>
    );
  };

  const renderInput = (): JSX.Element => {
    return (
      <section className='CryptoQuote-input'>
        <input
          id='inputField'
          onKeyPress={handleKeyPress}
          onChange={handleInputFieldChange}
          value={gameState.selectedEncryptedChar}
          style={{ width: 0, height: 0, border: 'none' }}
        />
        <span className={gameState.selectedPlainChar ? '' : 'active'}>
          {gameState.selectedPlainChar}
        </span>
        {' is encrypted as '}
        <span className={gameState.selectedPlainChar ? 'active' : ''}>
          {gameState.selectedEncryptedChar}
        </span>
      </section>
    );
  };

  const renderGuessMap = (): JSX.Element => {
    const { guessMap } = gameState.data;
    const result = alphaArray.map(key => (
      <Character
        key={key}
        topChar={guessMap[key] ? guessMap[key] : '_'}
        bottomChar={key}
        onClick={selectPlainChar}
        isSelected={key === gameState.selectedPlainChar}
      />
    ));

    return <section className='CryptoQuote-guessMap'>{result}</section>;
  };

  const renderAuthor = (): JSX.Element => {
    const { author } = gameState.data;
    return (
      <section className='CryptoQuote-author'>
        {renderString(author, 'author')}
      </section>
    );
  };

  const renderQuote = (): JSX.Element => {
    const { quote } = gameState.data;
    return (
      <section className='CryptoQuote-quote'>
        {renderString(quote, 'quote')}
      </section>
    );
  };

  const renderCategory = (): JSX.Element => {
    const { category } = gameState.data;
    return (
      <section className='CryptoQuote-category'>Category: {category}</section>
    );
  };

  const handleInputFieldChange = (e: ChangeEvent<HTMLInputElement>): void => {
    // console.log('onChange', e);
    // console.log(e.target);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
    const keyPressed = e.key.toUpperCase();
    if (keyPressed.length === 1 && /[A-Z]{1}/.test(keyPressed)) {
      if (gameState.selectedPlainChar) selectEncryptedChar(keyPressed);
      else selectPlainChar(keyPressed);
    }
    if (keyPressed === ',') {
      undoMove();
    } else if (keyPressed === '.') {
      redoMove();
    }
  };

  const setFocus = (): void => {
    const inputField = document.getElementById('inputField');
    if (inputField) inputField.focus();
  };

  if (document) {
    setFocus();
  }

  return isLoading ? (
    <main>Loading...</main>
  ) : (
    <main className='container' onClick={setFocus}>
      <div className='CryptoQuote'>
        {renderCategory()}
        {renderQuote()}
        {renderAuthor()}
        {renderGuessMap()}
        {renderInput()}
        {renderControls()}
        {isWinner ? <div>You solved it!!!</div> : null}
      </div>
    </main>
  );
}
