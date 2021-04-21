import React, { Component } from 'react';
import {Switch,Route} from "react-router-dom"
import Producthome from "./home"
import Addupdate from "./addupdate"
import Detail from "./detail"
class Product extends Component {
    render() {
        return (
            <div>
               <Switch>
                    <Route path="/product" component={Producthome} exact></Route>
                    <Route path="/product/addupdate" component={Addupdate} exact></Route>
                    <Route path="/product/detail" component={Detail} exact></Route>
               </Switch>
            </div>
        );
    }
}

export default Product;