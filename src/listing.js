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
        <ul>
          {this.state.history.map((image, key) => {
            let url = `/detail/${image}`
            return (
              <li key={key}>
                <Link to={url}>{image} </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default Listing;
