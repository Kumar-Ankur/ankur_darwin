import React from "react";
import { Link } from "react-router-dom";

class Listing extends React.Component {
  constructor(props) {
    super(props);
    this.state = { history: [] };
    this.getListing = this.getListing.bind(this);
    this.getListing();
  }

  getListing() {
    fetch("http://localhost:3030/history")
      .then(data => data.json())
      .then(data => this.setState({ history: data }));
  }
  render() {
    return (
      <div>
        <nav className="navbar navbar-toggleable-md navbar-light bg-faded navClass">
          <Link to="/" className="navbar-brand">
            Google Image
          </Link>
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <li className="nav-link">
                <Link to="/">
                  HOME<span class="sr-only">(current)</span>
                </Link>
              </li>
            </li>
          </ul>
          <span className="badge badge-info">
            CLICK ANY TAG TO RENDER DETAIL SCREEN
          </span>
        </nav>

        <ul className="list-group">
          {this.state.history.map((image, key) => {
            let url = `/detail/${image}`;
            return (
              <li className="list-group-item linkStyle" key={key}>
                <Link to={url}>.{image} </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default Listing;
