import React, { useState, useEffect, KeyboardEvent, ChangeEvent } from 'react';
import axios, { AxiosResponse } from 'axios';
import Character from './Character';
import Space from './Space';
import Punctuation from './Punctuation';

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
  decryptMap: { [key: string]: string };
  guessMap: { [key: string]: string };
  reverseGuessMap: { [key: string]: string };
};

const INITIAL_STATE = {
  isLoading: true,
  data: {} as AugmentedData,
  selectedPlainChar: '',
  selectedEncryptedChar: ''
};

export default function CryptoQuote(props: CryptoQuoteProps) {
  const [state, setState] = useState(INITIAL_STATE);
  const [isWinner, setIsWinner] = useState(false);

  const augmentData = (data: QuoteData) => {
    const generateCryptoMap = () => {
      const encryptMap = {} as { [key: string]: string };
      const decryptMap = {} as { [key: string]: string };
      const guessMap = {} as { [key: string]: string };
      const reverseGuessMap = {} as { [key: string]: string };
      const keys = Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
      const values = Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
      keys.forEach(key => {
        let index: number;
        let value: string;
        do {
          index = Math.floor(Math.random() * values.length);
          value = values[index];
        } while (key === value);
        encryptMap[key] = value;
        guessMap[key] = '';
        decryptMap[value] = key;
        reverseGuessMap[value] = '';
        values.splice(index, 1);
      });

      return [encryptMap, decryptMap, guessMap, reverseGuessMap];
    };

    const augAuthor = data.author.toUpperCase();
    const augQuote = data.quote.toUpperCase();
    const [
      encryptMap,
      decryptMap,
      guessMap,
      reverseGuessMap
    ] = generateCryptoMap();

    const augmentedData = {
      category: data.category,
      author: augAuthor,
      quote: augQuote,
      encryptMap,
      decryptMap,
      guessMap,
      reverseGuessMap
    };

    return augmentedData;
  };

  useEffect(() => {
    const getRandomQuote = async () => {
      const categories = Object.values(quoteCategory);
      const randomCat = Math.floor(Math.random() * categories.length);
      const category = categories[randomCat];

      const response: AxiosResponse = await axios.get(
        'https://wmoore98-quote.herokuapp.com/api/quotes'
      );

      // const response: AxiosResponse = await axios.get(
      //   'http://localhost:3001/api/quotes'
      // );

      // prevent call to api - limited to 50/ month
      // const response: AxiosResponse = await axios.post(
      //   `https://andruxnet-random-famous-quotes.p.rapidapi.com/?cat=${category}&count=1`,
      //   {},
      //   {
      //     headers: {
      //       'x-rapidapi-host':
      //         'andruxnet-random-famous-quotes.p.rapidapi.com',
      //       'x-rapidapi-key':
      //         '179da4f63fmsh7199f90a6b17cefp1d8281jsnfac455eebacd',
      //       'content-type': 'application/x-www-form-urlencoded'
      //     }
      //   }
      // );

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
      setState({ ...INITIAL_STATE, isLoading: false, data: augmentedData });
    };
    getRandomQuote();
  }, []);

  useEffect(() => {
    const { quote, guessMap, encryptMap } = state.data;
    if (!quote) return;

    const win = quote.split('').every(char => {
      return guessMap[char] === encryptMap[char];
    });

    if (win) setIsWinner(win);
  }, [state.data, isWinner]);

  const updateGuessMap = (plainChar: string, encryptedChar: string): void => {
    const generateReverseMap = (map: {
      [key: string]: string;
    }): { [key: string]: string } => {
      const reverseMap = {} as { [key: string]: string };

      // remove encryptedChar from guessMap - if previously guessed
      const oldGuess = state.data.reverseGuessMap[encryptedChar];
      if (oldGuess) map[oldGuess] = '';

      Object.keys(map).forEach(key => (reverseMap[map[key]] = key));
      return reverseMap;
    };

    const data = { ...state.data };
    const guessMap = { ...data.guessMap };
    guessMap[plainChar] = encryptedChar;
    const reverseGuessMap = generateReverseMap(guessMap);
    data.guessMap = guessMap;
    data.reverseGuessMap = reverseGuessMap;

    setState({
      ...state,
      data,
      selectedPlainChar: '',
      selectedEncryptedChar: ''
    });
  };

  const selectEncryptedChar = (selectedEncryptedChar: string) => {
    setState({ ...state, selectedEncryptedChar });
    if (state.selectedPlainChar) {
      setTimeout(() => {
        updateGuessMap(state.selectedPlainChar, selectedEncryptedChar);
      }, 300);
    }
  };

  const selectPlainChar = (selectedPlainChar: string) => {
    setState({ ...state, selectedPlainChar });
    if (state.selectedEncryptedChar) {
      setTimeout(() => {
        updateGuessMap(selectedPlainChar, state.selectedEncryptedChar);
      }, 300);
    }
  };

  const renderGuessMap = () => {
    const { guessMap } = state.data;
    const result = Object.keys(guessMap).map(key => (
      <Character
        key={key}
        topChar={guessMap[key] ? guessMap[key] : '_'}
        bottomChar={key}
        onClick={selectPlainChar}
        isSelected={key === state.selectedPlainChar}
      />
    ));

    return <div style={{ display: 'inline-block' }}>{result}</div>;
  };

  const renderString = (str: string, type: string) => {
    const { encryptMap, reverseGuessMap } = state.data;
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
                isSelected={encryptedChar === state.selectedEncryptedChar}
              />
            );
          }
        })}
        <Space key={`${type}:space${wordIndex}`} />
      </div>
    ));

    return <>{result}</>;
  };

  const renderQuote = () => {
    const { author, quote, category } = state.data;
    return (
      <div className='CryptoQuote'>
        <div className='CryptoQuote-category'>Category: {category}</div>
        <div className='CryptoQuote-quote'>{renderString(quote, 'quote')}</div>
        <div className='CryptoQuote-author'>
          {renderString(author, 'author')}
        </div>
        <div className='CryptoQuote-guessMap'>{renderGuessMap()}</div>
      </div>
    );
  };

  const handleInputFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    // console.log('onChange', e);
    // console.log(e.target);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    const keyPressed = e.key.toUpperCase();
    if (keyPressed.length === 1 && /[A-Z]{1}/.test(keyPressed)) {
      if (state.selectedPlainChar) selectEncryptedChar(keyPressed);
      else selectPlainChar(keyPressed);
    }
  };

  if (document) {
    const inputField = document.getElementById('inputField');
    if (inputField) inputField.focus();
  }

  return state.isLoading ? (
    <div>Loading...</div>
  ) : isWinner ? (
    <div>Winner!!!</div>
  ) : (
    <div className='container'>
      {renderQuote()}
      <div>
        <input
          id='inputField'
          onKeyPress={handleKeyPress}
          onChange={handleInputFieldChange}
          value={state.selectedEncryptedChar}
          style={{ width: 0, height: 0, border: 'none' }}
        />
        {state.selectedPlainChar} is encrypted as {state.selectedEncryptedChar}
      </div>
    </div>
  );
}
