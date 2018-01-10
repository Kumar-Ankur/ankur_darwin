import React from "react";
import { Link } from "react-router-dom";

class Detail extends React.Component {
  constructor(props) {
    super(props);
    this.state = { images: [] };
    this.getListing = this.getListing.bind(this);
    this.getListing();
  }

  getListing() {
    console.log(this.props);
    fetch(`http://localhost:3030/detail/${this.props.match.params.term}`)
      .then(data => data.json())
      .then(data => this.setState({ images: data.images }));
  }
  render() {
    return (
      <div>
        {this.state.images.map((image, key) => {
            let url = `download/${image}`;
          return <img src={url} key={key} />;
        })}
      </div>
    );
  }
}

export default Detail;
