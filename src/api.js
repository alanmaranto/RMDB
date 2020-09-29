import { API_URL, API_KEY } from './config'

export const decideMoviesToShow = (type, loadMore, searchTerm, currentPage) => {

  return `${API_URL}${type}?api_key=${API_KEY}&language=en-US&page=${
    loadMore && currentPage + 1
  }&query=${searchTerm}`;
};
