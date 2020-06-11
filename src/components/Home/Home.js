import React, { Component } from "react";
import {
  API_URL,
  API_KEY,
  IMAGE_BASE_URL,
  BACKDROP_SIZE,
  POSTER_SIZE,
} from "../../config";
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

  searchItems = (searchTerm) => {
    console.log(searchTerm);
    let endpoint = "";
    this.setState({
      movies: [],
      loading: true,
      searchTerm,
    });
    if (searchTerm === "") {
      endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=es-ES&page=1`;
    } else {
      endpoint = `${API_URL}search/movie?api_key=${API_KEY}&language=es-ES&query=${searchTerm}`;
    }
    this.fetchItems(endpoint);
  };

  loadMoreItems = () => {
    const { searchTerm, currentPage } = this.state;
    let endpoint = "";
    this.setState({ loading: true });

    if (searchTerm === "") {
      endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=es-ES&page=${
        currentPage + 1
      }`;
    } else {
      endpoint = `${API_URL}search/movie?api_key=${API_KEY}&language=es-ES&query=${searchTerm}&page=${
        currentPage + 1
      }`;
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
    const {
      heroImage,
      searchTerm,
      loading,
      movies,
      currentPage,
      totalPages,
    } = this.state;
    return (
      <div className="rmdb-home">
        {heroImage ? (
          <div>
            <HeroImage
              image={`${IMAGE_BASE_URL}${BACKDROP_SIZE}/${heroImage.backdrop_path}`}
              title={heroImage.original_title}
              text={heroImage.overview}
            />
            <SearchBar searchItems={this.searchItems} />
          </div>
        ) : null}
        <div className="rmdb-home-grid">
          <FourColGrid
            header={searchTerm ? "Search Result" : "Popular Movies"}
            loading={loading}
          >
            {movies.map((movie, index) => {
              return (
                <MovieThumb
                  key={index}
                  clickable={true}
                  image={
                    movie.poster_path
                      ? `${IMAGE_BASE_URL}${POSTER_SIZE}${movie.poster_path}`
                      : "./images/no_image.jpg"
                  }
                  movieId={movie.id}
                  movieName={movie.original_title}
                />
              );
            })}
          </FourColGrid>
          {loading ? <Spinner /> : null}
          {currentPage && totalPages && !loading ? (
            <LoadMoreBtn text="Load More" onClick={this.loadMoreItems} />
          ) : null}
        </div>
      </div>
    );
  }
}

export default Home;
