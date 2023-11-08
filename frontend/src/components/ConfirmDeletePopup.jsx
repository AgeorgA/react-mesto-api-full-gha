import React, { useRef } from 'react';

import PopupWithForm from './PopupWithForm.jsx';
function ConfirmDeletePopup({ card, isOpen, onClose, onCardDelete }) {
  function handleSubmit(e) {
    e.preventDefault();
    onCardDelete(card);
  }

  return (
    <PopupWithForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Вы уверены?"
      name="confirm-form"
      buttonText="Да"
      typeForm="popup__form_type_confirm"
    />
  );
}

export default ConfirmDeletePopup;
