import React from 'react';

import './Navbar.css';
import { NavLink } from 'react-router-dom';

interface NavbarProps {
  paths: { to: string; text: string }[];
  user: string;
}

export default function Navbar(props: NavbarProps): JSX.Element {
  return (
    <header className='Navbar'>
      <div className='Navbar-logo'>EncryptedQuote</div>
      {props.user ? <div>{props.user}</div> : null}
      <nav>
        <ul>
          {props.paths.map(({ to, text }) => (
            <li key={to}>
              <NavLink
                exact
                className='Navbar-link'
                activeClassName='Navbar-active'
                to={to}
              >
                {text}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
