import React, { Component } from 'react';
import memoryUtils from '../../utils/memoryUtils'
import { Redirect,Route,Switch} from 'react-router-dom';
import { Layout } from 'antd';
import './home.less'
import LeftNav from '../../components/leftnav/leftnav'
import Header from '../../components/header/header'
import Category from '../category/category'
import Homepage from '../homepage/homepage'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import Notfound from "../notfound/notfound"
const {  Footer, Sider, Content } = Layout;

class Home extends Component {
    render() {
        const user=memoryUtils.user
        if(!user||!user._id){
            return <Redirect to="/login"></Redirect>
        }
        return (
            <div className="home">
                <Layout style={{minHeight:'100%'}}>
                    <Sider>
                        <LeftNav></LeftNav>
                    </Sider>
                    <Layout>
                        <Header></Header>
                        <Content style={{backgroundColor:'#fff',margin:'20px'}}>
                            <Switch>
                                <Redirect from="/" to="/homepage" exact></Redirect>
                                <Route path='/category' component={Category}/>
                                <Route path='/homepage' component={Homepage}/>
                                <Route path='/product' component={Product}/>
                                <Route path='/role' component={Role}/>
                                <Route path='/user' component={User}/>
                                <Route  component={Notfound}/>
                            </Switch>
                        </Content>
                        <Footer style={{textAlign:'center',color:'#ccc'}}>推荐使用谷歌浏览器，可以获得更加页面操作体验</Footer>
                    </Layout>
                </Layout>
            </div>
        );
    }
}

export default Home;