import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import CryptoQuote, { gameType } from './CryptoQuote';
import About from './About';
import Login from './Login';
import Logout from './Logout';

interface RoutesProps {
  user: string;
  setUser(user: string): void;
  setIsLoaded(isLoaded: boolean): void;
  game: gameType;
}

export default function Routes(props: RoutesProps): JSX.Element {
  return (
    <Switch>
      <Route
        exact
        path='/'
        render={() =>
          props.user ? (
            <CryptoQuote game={props.game} />
          ) : (
            <Redirect to='/login' />
          )
        }
      />
      <Route exact path='/about' render={() => <About />} />
      <Route
        exact
        path='/login'
        render={routerProps => (
          <Login
            setUser={props.setUser}
            setIsLoaded={props.setIsLoaded}
            routerProps={routerProps}
          />
        )}
      />
      <Route
        exact
        path='/logout'
        render={routerProps => (
          <Logout setUser={props.setUser} routerProps={routerProps} />
        )}
      />
      <Route render={() => <Redirect to={'/'} />} />
    </Switch>
  );
}
