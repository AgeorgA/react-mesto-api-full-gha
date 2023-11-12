import React, { useEffect } from 'react';
import PopupWithForm from './PopupWithForm';
import { useForm } from '../hooks/useForm.jsx';

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar }) {
  const { values, handleChange, setValues } = useForm({});

  useEffect(() => {
    setValues({});
  }, [isOpen]);

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateAvatar({
      avatar: values.avatar
    });
  }

  return (
    <PopupWithForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Обновить аватар"
      name="edit_avatar_form"
      buttonText="Сохранить"
      typeForm="popup__form_type_update-avatar"
    >
      <input
        name="avatar"
        placeholder="Ссылка на аватар"
        id="avatar-input"
        type="url"
        className="popup__input"
        required
        autoComplete="off"
        ref={values.avatar || ''}
      />
      <span className="popup__error avatar-input-error"></span>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;
