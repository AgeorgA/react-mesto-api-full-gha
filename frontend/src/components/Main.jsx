import React, { useContext } from 'react';

import Card from './Card.jsx';
import { CurrentUserContext } from '../contexts/CurrentUserContext.jsx';

function Main({
  onEditProfile,
  onAddPlace,
  onEditAvatar,
  onCardClick,
  onCardLike,
  onCardDelete,
  onConfirmDelete,
  cards
}) {
  const currentUser = useContext(CurrentUserContext);

  return (
    <main className="content">
      <section className="profile content__profile">
        <button
          onClick={onEditAvatar}
          aria-label="Редактировать"
          type="button"
          className="profile__edit-avatar-button button"
        >
          <img src={currentUser.avatar} alt="Аватар" className="profile__avatar" />
        </button>

        <div className="profile__info">
          <h1 className="profile__name">{currentUser.name}</h1>
          <button
            onClick={onEditProfile}
            aria-label="Редактировать"
            type="button"
            className="profile__edit-button button"
          ></button>
          <p className="profile__about-self">{currentUser.about}</p>
        </div>
        <button
          onClick={onAddPlace}
          type="button"
          aria-label="Добавить"
          className="profile__add-button button"
        ></button>
      </section>

      <section className="cards">
        {cards.map(card => (
          <Card
            key={card._id}
            card={card}
            onCardClick={onCardClick}
            onCardLike={onCardLike}
            onCardDelete={onCardDelete}
            onConfirmDelete={onConfirmDelete}
          />
        ))}
      </section>
    </main>
  );
}

export default Main;
