import React from 'react';
import Listing from './listing.js';
import { Link }from 'react-router-dom';

class App extends React.Component{
  constructor(props){
    super(props)

    this.state = {value : '', data : '', scrape : [],name : 'ankur'}
  }
  getResults(){
    fetch(`http://localhost:3030/search?term=${this.state.value}`)
    .then(data => {
      return data.json();
    })
    .then(data => {
      this.setState({data: JSON.stringify(data)})
      var images = data.map(image => {
        return image.thumb_url;
      })
      this.setState({scrape : images})
    })
}

  render(){
    return(
      <div>
        <ul>
          <li><Link to='/history'>Listing Page</Link></li>
        </ul>
      <input type="search" onChange={e => {this.setState({value : e.target.value})}}/>
      
      <button onClick={this.getResults.bind(this)}>Submit</button>
      <div>
        {this.state.scrape.map((image,key) =>{
          return <img src= {image} key={key}/>
        })}

      </div>
      </div>
    )
  }
}

export default App;
