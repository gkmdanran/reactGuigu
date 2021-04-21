import React, { Component } from 'react';
import {reqLogin} from "../../api/index"
import './login.less'
import logo from "./images/logo.png"
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import { Form, Input, Button} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { Redirect } from 'react-router-dom';
class Login extends Component {
     onFinish =async values => {
        console.log('Received values of form: ', values);
        const data=await reqLogin(values)  
        console.log(data)
        if(data.status===0){
            message.success("登陆成功",1.5)
            memoryUtils.user=data.data
            storageUtils.saveUser(data.data)
            this.props.history.push('/')
        }
        else{
            message.error(data.msg,0.8)
        }
      };
    render() {
        const user=memoryUtils.user
        if(user&&user._id){
            return <Redirect to="/"/>
        }
        return (
            <div className="login">
                <div className="header">
                    <img src={logo} alt=""/>
                    React后台管理系统
                </div>
                <div className="content">
                    <h2>用户登录</h2>
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={this.onFinish}
                        >
                        <Form.Item
                            name="username"
                            rules={[
                            {
                                required: true,
                                message: '请输入用户名!',
                            },
                            ]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="账号" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                            {
                                validator:(rule,value)=>{
                                    if(!value)
                                        return Promise.reject('密码必须输入');
                                    else if(value.length<4||value.length>16)
                                        return Promise.reject('请输入4-16位密码');
                                    return Promise.resolve();
                                },
                                validateTrigger: 'onSubmit', // 设置进行表单验证的时机为onSubmit
                            },
                            ]}
                        >
                            <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="密码"
                            />
                        </Form.Item>
                       
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                            登录
                            </Button>
                     
                        </Form.Item>
                    </Form>
                </div>
            </div>
        );
    }
}

export default Login;