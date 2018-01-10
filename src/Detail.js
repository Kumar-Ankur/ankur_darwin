import React from "react";
import { Link } from "react-router-dom";
import Masonry from "react-masonry-component";

var masonryOptions = {
  transitionDuration: 0
};

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
    var childElements = this.state.images.map((image, key) => {
      let url = `${image}`;
      return (
        <li className="image-element-class">
          <img src={url} key={key} />
        </li>
      );
    });
    return (
      <div>
        {/* {this.state.images.map((image, key) => {
            let url = `download/${image}`;
          return <img src={url} key={key} />;
        })} */}

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
        </nav>

        <Masonry
          className={"my-gallery-class"} // default ''
          elementType={"ul"} // default 'div'
          options={masonryOptions} // default {}
          disableImagesLoaded={false} // default false
          updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
        >
          {childElements}
        </Masonry>
      </div>
    );
  }
}

export default Detail;
