function ImagePopup({ card, isOpen, onClose }) {
  return (
    <div className={`popup popup_hover-black popup_type_image ${isOpen ? 'popup_opened' : ''}`}>
      <div className="popup__image-container">
        <button
          type="button"
          id="close-big-image"
          aria-label="Закрыть"
          className="popup__close-button button"
          onClick={onClose}
        ></button>
        <img className="popup__image" src={card?.link} alt={card?.name} />
        <h2 className="popup__name-image">{card?.name}</h2>
      </div>
    </div>
  );
}
export default ImagePopup;
