import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = ({ onRegister }) => {
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
    onRegister(formValue);
  };

  return (
    <div className="register">
      <h2 className="register__title">Регистрация</h2>
      <form className="register__form" onSubmit={handleSubmit}>
        <input
          onChange={handleChange}
          value={formValue.email || ''}
          className="register__input"
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
          value={formValue.password || ''}
          className="register__input"
          id="password"
          minLength="2"
          maxLength="40"
          required
          type="password"
          name="password"
          placeholder="Пароль"
        />
        <button className="register__submit-button" type="submit">
          Зарегистрироваться
        </button>
      </form>
      <div className="register__signin">
        <p>Уже зарегистрированы?</p>
        <Link to="/sign-in" className="register__login-link">
          Войти
        </Link>
      </div>
    </div>
  );
};
export default Register;
