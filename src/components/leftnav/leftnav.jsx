import React, { Component } from 'react';
import "./leftnav.less"
import logo from "../../pages/login/images/logo.png"
import {Link, withRouter} from 'react-router-dom'
import { Menu} from 'antd';
import menuList from "../../config/menuConfig"
const { SubMenu } = Menu;
class Leftnav extends Component {
    hasAuth=(item)=>{
        const key=item.key
        const isPublic=item.isPublic
        const menus=JSON.parse(localStorage.getItem("user_key")).role.menus
        const username=JSON.parse(localStorage.getItem("user_key")).username
        if(username==='admin'||isPublic||menus.indexOf(key)!==-1)
            return true 
        else if(item.children){
            return !!item.children.find(child=>menus.indexOf(child.key!==-1))
        }
        else{
            return false
        }
    }
    getMenuNodes=(menuList)=>{
        const path=this.props.location.pathname
        
        return menuList.map(item=>{
            if(this.hasAuth(item)){
                if(!item.children){
                    return (
                        <Menu.Item key={item.key} icon={item.icon}>
                            <Link to={item.key}>{item.title}</Link>
                        </Menu.Item>
                    )
                }else{
                    const cItem=item.children.find(cItem=>path.indexOf(cItem.key)===0)
                    if(cItem)
                        this.openKey=item.key
                    
                    return (
                        <SubMenu key={item.key} icon={item.icon} title={item.title}>
                            
                            {this.getMenuNodes(item.children)}
                        </SubMenu>
                    )
                    
                    
                }
            }
            return false
        })
        
    }
    UNSAFE_componentWillMount(){
        this.menuNone=this.getMenuNodes(menuList)
    }
    render() {
        let path=this.props.location.pathname
        if(path.indexOf('/product')===0){
            path='/product'
        }
        this.getMenuNodes(menuList)
        const openKey=this.openKey
        return (
            <div className="leftnav">
                <Link to="/">
                    <header className="top">
                        <img src={logo} alt=""/>
                        <h1>电商后台</h1>
                    </header>
                </Link>
                <Menu mode="inline"theme="dark" selectedKeys={[path]} defaultOpenKeys={[openKey]}>
                    {
                        this.menuNone
                    }
                </Menu>
            </div>
        );
    }
}

export default withRouter(Leftnav);