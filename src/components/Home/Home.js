import React, { Component } from "react";
import { searchEndpoint, moviePageEndpoint } from "../../api";
import { API_URL, API_KEY } from "../../config";
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
    this.fetchItems();
  }

  loadMoreItems = () => {
    const { searchTerm, currentPage } = this.state;

    let endpoint = "";
    this.setState({ loading: true });

    if (searchTerm === "") {
      moviePageEndpoint(API_URL, API_KEY, currentPage + 1);
    } else {
      searchEndpoint(API_URL, API_KEY, searchTerm, currentPage + 1);
    }
    this.fetchItems();
  };

  fetchItems = () => {
    const { movies, heroImage } = this.state;
    fetch(moviePageEndpoint(API_URL, API_KEY, 1))
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
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
    return (
      <div className="rmdb-home">
        <HeroImage />
        <SearchBar />
        <FourColGrid />
        <Spinner />
        <LoadMoreBtn />
      </div>
    );
  }
}

export default Home;
