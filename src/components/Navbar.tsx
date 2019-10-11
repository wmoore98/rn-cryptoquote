import React from 'react';

import './Navbar.css';

// interface NavbarProps {
//   plainChar: string;
//   encryptedChar: string;
// }

export default function Navbar() {
  return (
    <header className='Navbar'>
      <div className='Navbar-logo'>EncryptedQuote</div>
      <nav>
        <ul>
          <li>
            <a className='Navbar-link' href='#'>
              Home
            </a>
          </li>
          <li>
            <a className='Navbar-link' href='#'>
              About
            </a>
          </li>
          <li>
            <a className='Navbar-link' href='#'>
              Contact
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
