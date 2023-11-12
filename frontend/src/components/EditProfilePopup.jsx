import PopupWithForm from './PopupWithForm.jsx';
import React, { useEffect, useContext } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext.jsx';
import { useForm } from '../hooks/useForm.jsx';

function EditProfilePopup({ isOpen, onClose, onUpdateUser }) {
  const currentUser = useContext(CurrentUserContext);
  const { values, handleChange, setValues } = useForm({});

  useEffect(() => {
    setValues({ name: currentUser.name, about: currentUser.about });
  }, [isOpen]);

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateUser({
      name: values.name,
      about: values.about
    });
  }

  return (
    <PopupWithForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Редактировать профиль"
      name="fio-about-form"
      buttonText="Сохранить"
      typeForm="popup__form_type_edit-name"
    >
      <input
        name="name"
        id="name-input"
        type="text"
        className="popup__input"
        placeholder="Введите ФИО"
        minLength="2"
        maxLength="40"
        required
        autoComplete="off"
        onChange={handleChange}
        value={values.name || ''}
      />
      <span className="popup__error name-input-error"></span>

      <input
        name="about"
        id="about-input"
        type="text"
        className="popup__input"
        placeholder="О себе"
        minLength="2"
        maxLength="400"
        required
        autoComplete="off"
        onChange={handleChange}
        value={values.about || ''}
      />
      <span className="popup__error about-input-error "></span>
    </PopupWithForm>
  );
}

export default EditProfilePopup;
