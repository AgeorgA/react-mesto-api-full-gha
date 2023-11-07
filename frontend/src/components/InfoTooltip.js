import React from 'react';
import noIcon from '../images/fail.svg';
import yesIcon from '../images/success.svg';

function InfoTooltip({ regStatus, isOpen, onClose }) {
  return (
    <div className={`popup ${isOpen ? 'popup_opened' : ''}`}>
      <div className="popup__container">
        <button
          onClick={onClose}
          className="popup__close-button"
          type="button"
          aria-label="Закрыть"
        />
        <img className="popup__icon" src={regStatus ? yesIcon : noIcon} alt="статус регистрации" />
        <h2 className="popup__title">
          {regStatus
            ? 'Вы успешно зарегистрировались!'
            : 'Что-то пошло не так! Попробуйте еще раз.'}
        </h2>
      </div>
    </div>
  );
}

export default InfoTooltip;
