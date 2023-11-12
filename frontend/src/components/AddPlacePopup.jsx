import PopupWithForm from './PopupWithForm';
import React, { useEffect } from 'react';
import { useForm } from '../hooks/useForm.jsx';

function AddPlacePopup({ isOpen, onClose, onAddPlace }) {
  const { values, handleChange, setValues } = useForm({});

  useEffect(() => {
    setValues({});
  }, [isOpen]);

  function handleSubmit(e) {
    e.preventDefault();
    onAddPlace({
      name: values.name,
      link: values.link
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
        onChange={handleSubmit}
        value={values.name || ''}
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
        onChange={handleSubmit}
        value={values.link || ''}
      />
      <span className="popup__error card-img-input-error"></span>
    </PopupWithForm>
  );
}

export default AddPlacePopup;
