import React, { useState } from 'react';
import { log, axios } from '../lib';

const Login = ({
  login
}) => {
  const [
    name,
    setName
  ] = useState('');
  const [
    pass,
    setPass
  ] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    log({
      name, 
      pass
    });
    login(name, pass);
    setName('');
    setPass('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <input
        type="password"
        name="pass"
        value={pass}
        onChange={(e) => {
          setPass(e.target.value);
        }}
      />
      <button>送信</button>
    </form>
  );
};

export default Login;
