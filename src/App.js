import React from 'react';
import './App.css';
import {BrowserRouter,Route,Switch} from 'react-router-dom'


import Login from "./pages/login/login"
import Home from "./pages/home/home"
function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Switch>
          <Route path="/login" component={Login}></Route>
          <Route path="/" component={Home} ></Route>
        </Switch>     
      </BrowserRouter>
    </div>
   
  );
}

export default App;
