import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Detail from './Detail.js';
import { HashRouter,Route,IndexRoute } from 'react-router-dom';
import Listing from './listing.js';

ReactDOM.render((
   <HashRouter>
      <div>
        <Route exact path="/" component={App} />
        <Route path="/history" component={Listing} />
        <Route path="/detail/:term" component={Detail} />
      </div>
   </HashRouter >
), document.getElementById( 'root' ) )
