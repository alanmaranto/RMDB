import React from "react";
import "./FourColGrid.css";

const FourColGrid = ({ children, header, loading }) => {
  const renderElements = () => {
    const gridElements = children.map((element, index) => {
      return (
        <div key={index} className="rmdb-grid-element">
          {element}
        </div>
      );
    });
    return gridElements;
  };
  return (
    <div className="rmdb-grid">
      {header && !loading ? <h1>{header}</h1> : null}
      <div className="rmdb-grid-content">{renderElements()}</div>
    </div>
  );
};

export default FourColGrid;
