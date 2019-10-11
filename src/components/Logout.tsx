import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

interface LogoutProps {
  setUser(user: string): void;
  routerProps: RouteComponentProps;
}

export default function Logout(props: LogoutProps): JSX.Element {
  props.setUser('');
  props.routerProps.history.replace('/');
  return <React.Fragment />;
}
