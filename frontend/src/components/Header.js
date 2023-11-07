import React from 'react';
import headerLogo from '../images/logo.svg';
import { Route, Routes, Link } from 'react-router-dom';

function Header({ email, onSignOut }) {
  return (
    <header className="header">
      <img src={headerLogo} alt="Место Россия" className="header__logo" />
      <Routes>
        <Route
          path="/"
          element={
            <div className="header__navbar">
              <p className="header__email">{email}</p>
              <Link className="header__link header__link_logged" onClick={onSignOut}>
                Выйти
              </Link>
            </div>
          }
        />
        <Route
          path="/sign-in"
          element={
            <Link to="/sign-up" className="header__link">
              Регистрация
            </Link>
          }
        />
        <Route
          path="/sign-up"
          element={
            <Link to="/sign-in" className="header__link">
              Войти
            </Link>
          }
        />
      </Routes>
    </header>
  );
}

export default Header;
