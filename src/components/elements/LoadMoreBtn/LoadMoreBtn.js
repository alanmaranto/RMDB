import React from "react";
import "./LoadMoreBtn.css";

const LoadMoreBtn = ({ onClick, text }) => {
  return (
    <div className="rmdb-loadmorebtn" onClick={() => onClick(true)}>
      <p>{text}</p>
    </div>
  );
};

export default LoadMoreBtn;
