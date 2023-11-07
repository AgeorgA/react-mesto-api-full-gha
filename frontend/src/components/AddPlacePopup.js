import PopupWithForm from './PopupWithForm';
import React, { useState, useEffect } from 'react';

function AddPlacePopup({ isOpen, onClose, onAddPlace }) {
  const [name, setName] = useState('');
  const [link, setLink] = useState('');

  useEffect(() => {
    setName('');
    setLink('');
  }, [isOpen]);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleLinkChange(e) {
    setLink(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onAddPlace({
      name,
      link
    });
  }

  return (
    <PopupWithForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Новое место"
      name="add-card"
      buttonText="Создать"
      typeForm="popup__form_type_add-card"
    >
      <input
        name="name"
        id="card-name-input"
        placeholder="Название"
        type="text"
        className="popup__input"
        minLength="2"
        maxLength="30"
        required
        autoComplete="off"
        onChange={handleNameChange}
        value={name || ''}
      />
      <span className="popup__error card-name-input-error"></span>

      <input
        name="link"
        placeholder="Ссылка на картинку"
        id="card-img-input"
        type="url"
        className="popup__input"
        required
        autoComplete="off"
        onChange={handleLinkChange}
        value={link || ''}
      />
      <span className="popup__error card-img-input-error"></span>
    </PopupWithForm>
  );
}

export default AddPlacePopup;
