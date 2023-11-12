import React, { useState, useEffect } from 'react';
import Header from './Header.jsx';
import Main from './Main.jsx';
import Footer from './Footer.jsx';
import EditAvatarPopup from './EditAvatarPopup.jsx';
import EditProfilePopup from './EditProfilePopup.jsx';
import AddPlacePopup from './AddPlacePopup.jsx';
import ImagePopup from './ImagePopup.jsx';
import ConfirmDeletePopup from './ConfirmDeletePopup.jsx';
import api from '../utils/Api.jsx';
import { CurrentUserContext } from '../contexts/CurrentUserContext.jsx';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Login from './Login.jsx';
import Register from './Register.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import InfoTooltip from './InfoTooltip.jsx';
import * as auth from '../utils/auth.jsx';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isConfirmDelCardPopupOpen, setIsConfirmDelCardPopupOpen] = useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [selectedCard, setSelectedCard] = useState(null);
  const [cards, setCards] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isSuccessInfoTooltipStatus, setIsSuccessInfoTooltipStatus] = useState(false);
  const [email, setEmail] = useState('');
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (loggedIn) {
      navigate('/', { replace: true });
      return;
    }
    navigate('/signup', { replace: true });
  }, [loggedIn]);

  useEffect(() => {
    handleTokenCheck();
  }, []);

  const handleTokenCheck = () => {
    if (localStorage.getItem('jwt')) {
      const token = localStorage.getItem('jwt');
      auth
        .checkToken(token)
        .then(data => {
          if (data) {
            setLoggedIn(true);
            setEmail(data.email);
            navigate('/', { replace: true });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  const handleLogin = ({ email, password }) => {
    auth
      .authorize(email, password)
      .then(data => {
        if (data.token) {
          localStorage.setItem('jwt', data.token);
          setLoggedIn(true);
          setEmail(email);
          navigate('/', { replace: true });
        }
      })
      .catch(err => {
        handleRegStatusClick(false);
        console.log(err);
      });
  };

  const handleRegister = ({ email, password }) => {
    auth
      .register(email, password)
      .then(data => {
        if (data) {
          handleRegStatusClick(true);
          navigate('/signin', { replace: true });
        }
      })
      .catch(err => {
        handleRegStatusClick(false);
        console.log(err);
      });
  };

  const handleSignOut = () => {
    localStorage.removeItem('jwt');
    setLoggedIn(false);
    setEmail('');
    navigate('/signin', { replace: true });
  };

  useEffect(() => {
    if (loggedIn) {
      navigate('/', { replace: true });
      Promise.all([api.getUserInfo(), api.getInitialCards()])
        .then(([userInfo, initialCards]) => {
          setCurrentUser(userInfo);
          setCards(initialCards);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, [loggedIn]);

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  };

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  };

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  };

  const handleCardClick = card => {
    setIsImagePopupOpen(true);
    setSelectedCard(card);
  };

  const handleConfirmDeleteClick = card => {
    setIsConfirmDelCardPopupOpen(true);
    setSelectedCard(card);
  };

  function handleRegStatusClick(data) {
    setIsInfoTooltipPopupOpen(true);
    setIsSuccessInfoTooltipStatus(data);
  }

  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsConfirmDelCardPopupOpen(false);
    setIsImagePopupOpen(false);
    setSelectedCard(null);
    setIsInfoTooltipPopupOpen(false);
  };

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    api
      .toggleLike(card._id, !isLiked)
      .then(newCard => {
        setCards(state => state.map(c => (c._id === card._id ? newCard : c)));
      })
      .catch(err => {
        console.log(err);
      });
  }

  function handleSubmit(request) {
    request().then(closeAllPopups).catch(console.error);
  }

  function handleCardDelete(card) {
    function makeRequest() {
      return api
        .removeCard(card._id)
        .then(setCards(cards.filter(removedCard => card._id !== removedCard._id)));
    }
    handleSubmit(makeRequest);
  }

  function handleUpdateUser(data) {
    function makeRequest() {
      return api.setUserInfo(data).then(setCurrentUser);
    }
    handleSubmit(makeRequest);
  }

  function handleUpdateAvatar(data) {
    function makeRequest() {
      return api.setUserAvatar(data).then(setCurrentUser);
    }
    handleSubmit(makeRequest);
  }

  function handleAddPlaceSubmit(card) {
    function makeRequest() {
      return api.setInitialCards(card).then(newCard => {
        setCards([newCard, ...cards]);
      });
    }
    handleSubmit(makeRequest);
  }
  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header email={email} onSignOut={handleSignOut} />
        <Routes>
          <Route
            path="/*"
            element={loggedIn ? <Navigate to="/" replace /> : <Navigate to="/signin" replace />}
          />
          <Route
            path="/"
            element={
              <ProtectedRoute
                element={Main}
                cards={cards}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                onCardClick={handleCardClick}
                onCardLike={handleCardLike}
                onConfirmDelete={handleConfirmDeleteClick}
                onCardDelete={handleCardDelete}
                loggedIn={loggedIn}
              />
            }
          />
          <Route path="/signup" element={<Register onRegister={handleRegister} />} />
          <Route path="/signin" element={<Login onLogin={handleLogin} />} />
        </Routes>

        {loggedIn && <Footer />}

        <InfoTooltip
          regStatus={isSuccessInfoTooltipStatus}
          isOpen={isInfoTooltipPopupOpen}
          onClose={closeAllPopups}
        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />
        <ConfirmDeletePopup
          isOpen={isConfirmDelCardPopupOpen}
          onClose={closeAllPopups}
          onCardDelete={handleCardDelete}
          card={selectedCard}
        />
        <ImagePopup isOpen={isImagePopupOpen} onClose={closeAllPopups} card={selectedCard} />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
