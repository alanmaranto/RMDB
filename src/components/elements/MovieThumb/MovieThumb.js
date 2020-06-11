import React from "react";
import "./MovieThumb.css";

const MovieThumb = ({ image }) => {
  return (
  <div className="rmdb-moviethumb">
    <img src={image} alt="moviethumb"/>
  </div>
  );
};

export default MovieThumb;
