export const get = key => {
  try {
    const serializedState = localStorage.getItem(key);
    return serializedState === null ? [] : JSON.parse(serializedState);
  } catch (error) {
    console.error('Get state error: ', error.message);
  }
};

export const set = (key, value) => {
  try {
    const locStorage = get(key);
    const currentFilm = JSON.parse(value);
    const includesFilm = locStorage.find(film => film.id === currentFilm.id);
    if (locStorage.length === 0 || !includesFilm) {
      locStorage.push(currentFilm);
    }

    localStorage.setItem(key, JSON.stringify(locStorage));
  } catch (error) {
    console.log('Set state error: ', error);
  }
};

export const remove = (key, id) => {
  try {

    const locStorage = get(key);

    const restFilms = locStorage.filter(film => film.id !== id);

    localStorage.setItem(key, JSON.stringify(restFilms));

  } catch (error) {
    console.error('Get state error: ', error.message);
  }
};

export const clear = () => {
  localStorage.clear();
};
