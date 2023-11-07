import React, { useContext } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Card({ onCardClick, onCardLike, onConfirmDelete, card }) {
  const currentUser = useContext(CurrentUserContext);
  const isOwn = card.owner._id === currentUser._id;
  const isLiked = card.likes.some(i => i._id === currentUser._id);
  const cardLikeButtonClassName = `card__heart ${isLiked ? 'card__heart_active' : ''}`;

  const handleClick = () => {
    onCardClick(card);
  };
  const handleLikeClick = () => {
    onCardLike(card);
  };

  const handleDeleteClick = () => {
    onConfirmDelete(card);
  };

  return (
    <div className="card">
      <div className="card__img-place">
        <img className="card__img" src={card.link} alt={card.name} onClick={handleClick} />
      </div>
      {isOwn && (
        <button
          aria-label="Удаление"
          type="button"
          className="card__trashbox button"
          onClick={handleDeleteClick}
        />
      )}
      <div className="card__division">
        <h2 className="card__name">{card.name}</h2>
        <div className="card__like-container">
          <button
            aria-label="Лайк"
            type="button"
            className={cardLikeButtonClassName}
            onClick={handleLikeClick}
          ></button>
          <span className="card__like-count">{card.likes.length}</span>
        </div>
      </div>
    </div>
  );
}

export default Card;
