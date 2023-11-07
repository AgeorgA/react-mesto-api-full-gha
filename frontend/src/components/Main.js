import React, { useContext } from 'react';

import Card from './Card';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';

function Main(props) {
  const currentUser = useContext(CurrentUserContext);

  return (
    <main className="content">
      <section className="profile content__profile">
        <button
          onClick={props.onEditAvatar}
          aria-label="Редактировать"
          type="button"
          className="profile__edit-avatar-button button"
        >
          <img src={currentUser.avatar} alt="Аватар" className="profile__avatar" />
        </button>

        <div className="profile__info">
          <h1 className="profile__name">{currentUser.name}</h1>
          <button
            onClick={props.onEditProfile}
            aria-label="Редактировать"
            type="button"
            className="profile__edit-button button"
          ></button>
          <p className="profile__about-self">{currentUser.about}</p>
        </div>
        <button
          onClick={props.onAddPlace}
          type="button"
          aria-label="Добавить"
          className="profile__add-button button"
        ></button>
      </section>

      <section className="cards">
        {props.cards.map(item => (
          <Card
            key={item._id}
            card={item}
            onCardClick={props.onCardClick}
            onCardLike={props.onCardLike}
            onCardDelete={props.onCardDelete}
            onConfirmDelete={props.onConfirmDelete}
          />
        ))}
      </section>
    </main>
  );
}

export default Main;
