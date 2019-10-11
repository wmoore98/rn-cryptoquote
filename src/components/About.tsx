import React from 'react';

import './About.css';

export default function About(): JSX.Element {
  return (
    <main className='container'>
      <h1>About EncryptedQuote</h1>
      <p>
        An famous, inspirational quote and its author are encrypted. One letter
        stands for another; never will a letter stand for itself. For example,
        if 'A' = 'T', 'D' = 'H', and 'P' = 'E', the word, 'THE' would be
        encrypted as 'ADP'.
      </p>
      <p>
        Use your knowledge of the English language and look for clues to help
        you decode the puzzle. For example, if you see a stand-alone character,
        it probably stands for either 'A' or 'I'. Two-letter words will normally
        consist of a vowel and a consonant. Look for other places where the
        letters appear in the puzzle to see where a vowel makes most sense. 'E'
        is the most common English vowel and is often found at the end of words
        as well as in other places. The most common three-letter word in English
        is 'THE'. If you see a three-letter word, check the last letter and see
        where else it appears in the puzzle. If occurs at both the end and other
        places in words, there is a high probability it is an "E". 'T' is also a
        common letter, but 'H' is much less common.
      </p>
    </main>
  );
}
