import React, { Component } from "react";
import {
  IMAGE_BASE_URL,
  BACKDROP_SIZE,
  POSTER_SIZE,
} from "../../config";
import { decideMoviesToShow } from '../../api.js'
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
    if (localStorage.getItem("HomeState")) {
      const localState = JSON.parse(localStorage.getItem("HomeState"));
      this.setState({ ...localState });
    } else {
      this.setState({ loading: true });
      this.fetchItems(decideMoviesToShow("movie/popular", false, "", this.state.currentPage));
    }
  }

  updateItems = (loadMore, term) => {
    const { movies } = this.state;

    this.setState(
      {
        movies: loadMore ? [...movies] : [],
        loading: true,
        searchTerm: loadMore ? this.state.searchTerm : term,
      },
      () => {
        this.fetchItems(
          !this.state.searchTerm
            ? decideMoviesToShow("movie/popular", loadMore, "", this.state.currentPage)
            : decideMoviesToShow(
                "search/movie",
                loadMore,
                this.state.searchTerm,
                this.state.currentPage
              )
        );
      }
    );
  };

  fetchItems = async (endpoint) => {
    try {
      const { movies, heroImage, searchTerm } = this.state;
      const response = await (await fetch(endpoint)).json();
      this.setState(
        {
          movies: [...movies, ...response.results],
          heroImage: heroImage || response.results[0],
          loading: false,
          currentPage: response.page,
          totalPages: response.total_pages,
        },
        () => {
          if (searchTerm === "") {
            localStorage.setItem("HomeState", JSON.stringify(this.state));
          }
        }
      );
    } catch (error) {
      return error;
    }
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
        {heroImage && !searchTerm ? (
          <div>
            <HeroImage
              image={`${IMAGE_BASE_URL}${BACKDROP_SIZE}/${heroImage.backdrop_path}`}
              title={heroImage.original_title}
              text={heroImage.overview}
            />
          </div>
        ) : null}
        <SearchBar searchItems={this.updateItems} />
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
          {currentPage < totalPages && !loading ? (
            <LoadMoreBtn text="Load More" onClick={this.updateItems} />
          ) : null}
        </div>
      </div>
    );
  }
}

export default Home;
