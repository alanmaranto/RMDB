import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import "./SearchBar.css";

const initialState = {
  searchValue: "",
};

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  timeout= null;

  onSearch = (e) => {
    const { searchValue }= this.state;
    const { searchItems } = this.props;
    this.setState({ searchValue: e.target.value });
    clearImmediate(this.timeout);

    this.timeout = setTimeout(() => {
      searchItems(searchValue)
    }, 500);
  };
  render() {
    const { searchValue } = this.state;
    return (
      <div className="rmdb-searchbar">
        <div className="rmdb-searchbar-content">
          <FontAwesome className="rmdb-fa-search" name="search" size="2x" />
          <input
            type="text"
            className="rmdb-searchbar-input"
            placeholder="search"
            onChange={this.onSearch}
            value={searchValue}
          />
        </div>
      </div>
    );
  }
}

export default SearchBar;
