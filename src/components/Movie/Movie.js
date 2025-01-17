import React, { Component } from "react";
import { API_URL, API_KEY } from "../../config";
import Navigation from "../elements/Navigation/Navigation";
import MovieInfo from "../elements/MovieInfo/MovieInfo";
import MovieInfoBar from "../elements/MovieInfoBar/MovieInfoBar";
import FourColGrid from "../elements/FourColGrid/FourColGrid";
import Actor from "../elements/Actor/Actor";
import Spinner from "../elements/Spinner/Spinner";
import "./Movie.css";

class Movie extends Component {
  state = {
    movie: "",
    actors: [],
    directors: [],
    loading: false,
  };

  componentDidMount() {
    const { movieId } = this.props.match.params;
    if (localStorage.getItem(`${movieId}`)) {
      const localState = JSON.parse(localStorage.getItem(`${movieId}`));
      this.setState({ ...localState });
    } else {
      this.setState({ loading: true });
      // Fetch the movie
      const endpoint = `${API_URL}movie/${movieId}?api_key=${API_KEY}&language=en-US`;
      this.fetchItems(endpoint);
    }
  }

  fetchItems = async (endpoint) => {
    try {
      const { movieId } = this.props.match.params;
      const result = await (await fetch(endpoint)).json();
      if (result.status_code) {
        this.setState({ loading: false });
      } else {
        this.setState({ movie: result });
        const creditsEndpoint = `${API_URL}movie/${movieId}/credits?api_key=${API_KEY}`;
        const creditsResult = await (await fetch(creditsEndpoint)).json();
        const directors = await creditsResult.crew.filter(
          (member) => member.job === "Director"
        );
        this.setState(
          {
            actors: creditsResult.cast,
            directors,
            loading: false,
          },
          () => {
            localStorage.setItem(`${movieId}`, JSON.stringify(this.state));
          }
        );
      }
    } catch (error) {}
  };

  render() {
    const { movie, directors, loading, actors } = this.state;
    const { location } = this.props;

    return (
      <div className="rmdb-movie">
        {movie ? (
          <div>
            <Navigation movie={location.movieName} />
            <MovieInfo movie={movie} directors={directors} />
            <MovieInfoBar
              time={movie.runtime}
              budget={movie.budget}
              revenue={movie.revenue}
            />
          </div>
        ) : null}
        {actors ? (
          <div className="rmdb-movie-grid">
            <FourColGrid header={"Actors"}>
              {actors.map((actor, index) => {
                return <Actor key={index} actor={actor} />;
              })}
            </FourColGrid>
          </div>
        ) : null}
        {!actors && !loading ? <h1>No Movie Found!</h1> : null}
        {loading ? <Spinner /> : null}
      </div>
    );
  }
}

export default Movie;
