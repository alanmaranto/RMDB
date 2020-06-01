import React, { Component } from "react";
import { searchEndpoint, searchTermEndpoint, moviePageEndpoint } from "../../api";
import { API_URL, API_KEY, IMAGE_BASE_URL, BACKDROP_SIZE } from "../../config";
import HeroImage from "../elements/HeroImage/HeroImage";
import SearchBar from "../elements/SearchBar/SearchBar";
import FourColGrid from "../elements/FourColGrid/FourColGrid";
import MovieThumb from "../elements/MovieThumb/MovieThumb";
import LoadMoreBtn from "../elements/LoadMoreBtn/LoadMoreBtn";
import Spinner from "../elements/Spinner/Spinner";
import "./Home.css";

const initialState = {
  movies: [],
  heroImage: null,
  loading: false,
  currentPage: 0,
  totalPages: 0,
  searchTerm: "",
};

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
    this.setState({ loading: true });
    const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=es-ES&page=1`;
    this.fetchItems(endpoint);
  }

  searchItems = searchTerm => {
    console.log(searchTerm)
    let endpoint = '';
    this.setState({
      movies: [],
      loading: true,
      searchTerm,
    })
    if (searchTerm === '') {
      endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=es-ES&page=1`;
    } else {
      endpoint = `${API_URL}search/movie?api_key=${API_KEY}&language=es-ES&query=${searchTerm}`
    }
    this.fetchItems(endpoint)
  }

  loadMoreItems = () => {
    const { searchTerm, currentPage } = this.state;
    let endpoint= '';
    this.setState({ loading: true });

    if (searchTerm === "") {
      endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=es-ES&page=${currentPage + 1}`;
    } else {
      endpoint = `${API_URL}search/movie?api_key=${API_KEY}&language=es-ES&query=${searchTerm}&page=${currentPage + 1}`;
    }
    this.fetchItems(endpoint);
  };

  fetchItems = (endpoint) => {
    const { movies, heroImage } = this.state;
    fetch(endpoint)
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          movies: [...movies, ...response.results],
          heroImage: heroImage || response.results[0],
          loading: false,
          currentPage: response.page,
          totalPages: response.total_pages,
        });
      });
  };

  render() {
    const { heroImage } = this.state;
    return (
      <div className="rmdb-home">
        {heroImage ? (
          <div>
            <HeroImage
              image={`${IMAGE_BASE_URL}${BACKDROP_SIZE}/${heroImage.backdrop_path}`}
              title={heroImage.original_title}
              text={heroImage.overview}
            />
            <SearchBar 
              searchItems={this.searchItems}
            />
          </div>
        ) : null}
        <FourColGrid />
        <Spinner />
        <LoadMoreBtn />
      </div>
    );
  }
}

export default Home;
