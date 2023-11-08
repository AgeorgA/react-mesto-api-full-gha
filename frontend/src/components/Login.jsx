import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [formValue, setFormValue] = useState({
    email: '',
    password: ''
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormValue({
      ...formValue,
      [name]: value
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onLogin(formValue);
  };

  return (
    <div className="login">
      <h2 className="login__title">Вход</h2>
      <form className="login__form" onSubmit={handleSubmit}>
        <input
          onChange={handleChange}
          value={formValue.email || ''}
          className="login__input"
          id="email"
          minLength="2"
          maxLength="40"
          required
          type="email"
          name="email"
          placeholder="Email"
        />
        <input
          onChange={handleChange}
          value={formValue.password}
          className="login__input"
          id="password"
          minLength="2"
          maxLength="40"
          required
          type="password"
          name="password"
          placeholder="Пароль"
        />
        <button className="login__submit-button" type="submit">
          Войти
        </button>
      </form>
    </div>
  );
};

export default Login;
