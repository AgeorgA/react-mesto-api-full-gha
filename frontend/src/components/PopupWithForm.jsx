import React, { useRef } from 'react';

function PopupWithForm({ title, name, children, isOpen, onClose, onSubmit, typeForm, buttonText }) {
  return (
    <div className={`popup popup_type_${name} ${isOpen ? 'popup_opened' : ''}`}>
      <div className="popup__container">
        <form className={`popup__form ${typeForm}`} name={`${name}`} onSubmit={onSubmit}>
          <h2 className="popup__title">{title}</h2>
          {children}
          <button type="submit" className="popup__button button">
            {buttonText}
          </button>
        </form>
        <button
          aria-label="Закрыть"
          type="button"
          className="popup__close-button button"
          onClick={onClose}
        ></button>
      </div>
    </div>
  );
}

export default PopupWithForm;
