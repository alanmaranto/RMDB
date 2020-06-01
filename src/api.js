const moviePageEndpoint = (apiUrl, apiKey, pageValue) => {
  return `${apiUrl}movie/popular?api_key=${apiKey}&language=es-ES&page=${pageValue}`;
};

const searchEndpoint = (apiUrl, apiKey, searchTerm, pageValue) => {
  return `${apiUrl}search/movie?api_key=${apiKey}&language=es-ES&query${searchTerm}&page=${pageValue}`;
};

export { moviePageEndpoint, searchEndpoint };
