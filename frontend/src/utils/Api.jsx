export class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl;
  }

  _getResponseData(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }

  _request(url, options) {
    return fetch(url, options).then(this._getResponseData);
  }

  getInitialCards() {
    const token = localStorage.getItem('jwt');
    return this._request(`${this._baseUrl}/cards`, {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }

  setInitialCards({ name, link }) {
    const token = localStorage.getItem('jwt');
    return this._request(`${this._baseUrl}/cards`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, link })
    });
  }

  getUserInfo() {
    const token = localStorage.getItem('jwt');
    return this._request(`${this._baseUrl}/users/me`, {
      headers: {
        authorization: `Bearer ${token}`
      }
    });
  }

  setUserInfo({ name, about }) {
    const token = localStorage.getItem('jwt');
    return this._request(`${this._baseUrl}/users/me`, {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, about })
    });
  }

  setUserAvatar({ avatar }) {
    const token = localStorage.getItem('jwt');
    return this._request(`${this._baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ avatar })
    });
  }

  toggleLike(cardId, like) {
    const token = localStorage.getItem('jwt');
    return this._request(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: like ? 'PUT' : 'DELETE',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }

  removeCard(cardId) {
    const token = localStorage.getItem('jwt');
    return this._request(`${this._baseUrl}/cards/${cardId}`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${token}`
      }
    });
  }
}

const api = new Api({
  baseUrl: 'https://api.aea.nomoredomainsmonster.ru',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
