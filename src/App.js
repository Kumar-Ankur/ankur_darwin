/**
 * {App} React Component to display Home Page
 * @dependency {Masonry} Node module for Layout Display
 * {React-Spinners} To show spinner when the data is rendered into GUI
 * @function {getResults} Fetch images from MongoDB
 */


import React from "react";
import Listing from "./listing.js";
import { Link } from "react-router-dom";
import "./app.css";
import Masonry from "react-masonry-component";
import { BarLoader } from 'react-spinners';

var masonryOptions = {
  transitionDuration: 0
};

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { value: "", data: "", scrape: [], loading : false};
  }
  getResults() {
    this.setState({loading : true})
    fetch(`http://localhost:3030/search?term=${this.state.value}`)
      .then(data => {
        return data.json();
      })
      .then(data => {
        this.setState({ data: JSON.stringify(data) });
        var images = data.map(image => {
          return image.thumb_url;
        });
        this.setState({ scrape: images , loading : false});
      });
  }

  render() {
    var childElements = this.state.scrape.map((image, key) => {
      return (
        <div className="masonry-layout">
        <div className="masonry-layout__panel">
        <div className="masonry-layout__panel-content">
          <img src={image} key={key} className="image-element-class"/>
          </div>
          </div>
        </div>
      );
    });
    return (
      <div>
        <nav className="navbar navbar-toggleable-md navbar-light bg-faded navClass">
          <Link to="/" className="navbar-brand">
            Google Image
          </Link>
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <span className="nav-link">
                <Link to="/history">
                  RECENT SEARCHES<span className="sr-only">(current)</span>
                </Link>
              </span>
            </li>
          </ul>
          <form className="form-inline my-2 my-lg-0">
            <input
              className="form-control mr-sm-2"
              type="search"
              placeholder="Search"
              onChange={e => {
                this.setState({ value: e.target.value });
              }}
            />
            <button
              className="btn btn-outline-success my-2 my-sm-0"
              type="submit"
              onClick={this.getResults.bind(this)}
            >
              Search
            </button>
          </form>
        </nav>
        {/* <input type="search" onChange={e => {this.setState({value : e.target.value})}}/>
      
      <button onClick={this.getResults.bind(this)}>Submit</button> */}
        {/* <div>
        {this.state.scrape.map((image,key) =>{
          return <img className="img-rounded imgStyle" src= {image} key={key}/>
        })}

      </div> */}

        <BarLoader
          color={'#123abc'} 
          width={1500} 
          loading={this.state.loading} 
        />

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

export default App;
