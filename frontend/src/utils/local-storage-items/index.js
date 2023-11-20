export const encode = (key, data) => {
  localStorage.setItem(key, data);
};

export const decode = (key) => {
  return localStorage.getItem(key);
};

export const remove = (key) => {
  localStorage.removeItem(key);
};
