import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import './Login.css';

interface LoginProps {
  setUser(user: string): void;
  setIsLoaded(isLoaded: boolean): void;
  routerProps: RouteComponentProps;
}

export default function Login(props: LoginProps): JSX.Element {
  const [formData, setFormData] = useState({ userName: '', password: '' });

  const handleChange = (evt: any) => {
    console.log(evt.target.name, evt.target.value);
    const newFormData = { ...formData, [evt.target.name]: evt.target.value };
    if (newFormData.userName === '') newFormData.password = '';
    setFormData(newFormData);
  };

  const handleClick = () => {
    props.setUser(formData.userName ? formData.userName : 'guest');
    props.setIsLoaded(false);
    props.routerProps.history.replace('/');
  };

  return (
    <main className='container Login'>
      <h1>Login</h1>
      <form action=''>
        <label>Username</label>
        <input
          id='userName'
          name='userName'
          value={formData.userName}
          type='text'
          onChange={handleChange}
        />
        <label>Password</label>
        <input
          id='password'
          name='password'
          value={formData.password}
          type='password'
          onChange={handleChange}
        />
      </form>
      <button onClick={handleClick}>
        Continue as {formData.userName ? formData.userName : 'guest'}
      </button>
    </main>
  );
}
