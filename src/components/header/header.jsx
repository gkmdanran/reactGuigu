import React, { Component } from 'react';
import {formateDate} from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import {reqWeather} from '../../api/index'
import "./header.less"
import { withRouter } from 'react-router-dom';
import  menuList from '../../config/menuConfig'
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import storageUtils from '../../utils/storageUtils'
import Linkbutton from '../../components/linkbutton/linkbutton'
const { confirm } = Modal;
class Header extends Component {
    state={
        currentTime:formateDate(Date.now()),
        dayPictureUrl:'',
        weather:''
    }
    getTime=()=>{
        this.timer=setInterval(()=>{
            const currentTime=formateDate(Date.now())
            this.setState({currentTime})
        },1000)
    }
    getWeather=async ()=>{
        const {dayPictureUrl,weather}=await reqWeather('苏州')
        this.setState({dayPictureUrl,weather})
    }
    getTitle=()=>{
        const path=this.props.location.pathname
        let title
        menuList.forEach(item=>{
            if(item.key===path){
                title=item.title
            }
            else if(item.children){
                const x=item.children.find(x=>path.indexOf(x.key)===0)
                if(x){
                    title=x.title
                }
            }
        })
        return title
    }
    componentDidMount(){
        this.getTime()
        this.getWeather()
    }
    componentWillUnmount(){
        clearInterval(this.timer)
    }
    loginOut=()=>{
        confirm({
            title: '退出登录',
            icon: <ExclamationCircleOutlined />,
            content: '您确定退出当前账号吗?',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk:()=> {
              storageUtils.romoveUser('user_key')
              memoryUtils.user={}
              this.props.history.push('/login')
            },
           
          });
    }
    render() {
        const {currentTime,dayPictureUrl,weather}=this.state
        const user=memoryUtils.user.username
        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎，{user}</span>
                    <Linkbutton onClick={()=>{this.loginOut()}}>退出</Linkbutton>
                </div>
                <div className="header-bottom">
                    <div className="left">{this.getTitle()}</div>
                    <div className="right">
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt=""/>   
                        <span>{weather}</span>
                    </div>  
                </div>
            </div>
        );
    }
}
export default withRouter(Header);