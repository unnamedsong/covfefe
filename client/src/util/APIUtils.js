import {ACCESS_TOKEN, API_BASE_URL, DEFAULT_PAGE_SIZE} from '../constants';

const request = (options) => {
  const headers = new Headers({
    'Content-Type': 'application/json'
  });

  if (localStorage.getItem(ACCESS_TOKEN)) {
    headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN));
  }

  const defaults = {headers: headers};
  options = Object.assign({}, defaults, options);

  return fetch(options.url, options)
    .then(response =>
      response.json().then(json => {
        if (!response.ok) {
          return Promise.reject(json);
        }
        return json;
      })
    );
};

export function login(loginRequest) {
  return request({
    url: API_BASE_URL + "/auth/signin",
    method: 'POST',
    body: JSON.stringify(loginRequest)
  });
}

export function signup(signupRequest) {
  return request({
    url: API_BASE_URL + "/auth/signup",
    method: 'POST',
    body: JSON.stringify(signupRequest)
  });
}

export function checkUsernameAvailability(username) {
  return request({
    url: API_BASE_URL + "/user/checkUsernameAvailability?username=" + username,
    method: 'GET'
  });
}

export function checkEmailAvailability(email) {
  return request({
    url: API_BASE_URL + "/user/checkEmailAvailability?email=" + email,
    method: 'GET'
  });
}

export function getCurrentUser() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/user/me",
    method: 'GET'
  });
}

export function getUserProfile(username) {
  return request({
    url: API_BASE_URL + "/users/" + username,
    method: 'GET'
  });
}

export function searchBooks(username, target, query) {
  return request({
    url: API_BASE_URL + "/books?username=" + username + "&target=" + target + "&query=" + query,
    method: 'GET'
  });
}

export function createBookmark(book) {
  return request({
    url: API_BASE_URL + "/bookmarks",
    method: 'POST',
    body: JSON.stringify(book)
  });
}

export function getUserCreatedBookmark(username, page, size, sortField, sortOrder) {
  page = page || 0;
  size = size || DEFAULT_PAGE_SIZE;

  return request({
    url: API_BASE_URL + "/users/" + username + "/bookmarks?page=" + page + "&size=" + size + "&sort=" + sortField + "," + sortOrder,
    method: 'GET'
  });
}

export function deleteBookmark(username, book_id) {
  return request({
    url: API_BASE_URL + "/users/" + username + "/bookmarks/" + book_id,
    method: 'DELETE'
  });
}

export function getHistoryCreatedBy(username) {
  return request({
    url: API_BASE_URL + "/users/" + username + "/history",
    method: 'GET'
  });
}