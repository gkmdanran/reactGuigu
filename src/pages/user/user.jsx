import React, { Component } from 'react';
import { Card,Button,Table,Modal,Form,Input,Select, message} from 'antd';
import {formateDate} from "../../utils/dateUtils"
import { ExclamationCircleOutlined } from '@ant-design/icons';
import LinkButtom from "../../components/linkbutton/linkbutton"
import {reqUsers,reqDeleteUser,reqAddUsers,reqUpdateUser} from '../../api/index'
const { confirm } = Modal;
const Option=Select.Option
class User extends Component {
    userFormRef = React.createRef(); 
    state={
        users:[],
        roles:[],
        loding:false,
        isShow:false
    }
    user={}
    handleCancel=()=>{
        this.setState({
          isShow:false
        })
    }
    componentDidMount(){
        this.getUsers()
    }
    getUsers=async ()=>{
        this.setState({loading:true})
        const res=await reqUsers()
        if(res.status===0){
            console.log(res)
            this.initRoleNames(res.data.roles)
            this.setState({
                users:res.data.users,
                roles:res.data.roles,
                loading:false
            })
        }
    }
    initRoleNames=(roles)=>{
        const roleNames={}
        for (let x of roles){
            roleNames[x._id]=x.name
        }
        this.roleNames=roleNames
    }
    addupdateUser=async ()=>{
        try {
            var values =await this.userFormRef.current.validateFields();
            if(this.user.username===undefined){
                const res=await reqAddUsers(values)
                console.log(res)
                if(res.status===0){
                    this.setState({isShow:false})
                    this.getUsers()
                    message.success('添加用户成功',0.8)
                }
                else{
                    message.error('添加用户失败',0.8)
                }
            }
            else{
                values._id=this.user._id
                const res=await reqUpdateUser(values)
                console.log(res)
                if(res.status===0){
                    this.setState({isShow:false})
                    this.getUsers()
                    message.success('修改用户成功',0.8)
                }
                else{
                    message.error('修改用户失败',0.8)
                }
            }
           
        } catch (error) {
            
        }
    }
    deleteUser=(user)=>{
        confirm({
            title: '删除用户',
            icon: <ExclamationCircleOutlined />,
            content: '您确定删除'+user.username+'吗?',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk:async ()=> {
                const res=await reqDeleteUser(user._id)
                console.log(res)
                if(res.status===0){
                    message.success("删除用户成功",0.8)
                    this.getUsers()
                }
            },
           
          });
    }
    showAdd=(user)=>{
        this.user=user
        console.log(this.user)
        this.setState({isShow:true},()=>{
            if(this.userFormRef.current){
              this.userFormRef.current.resetFields();
            }
          })
    }
    render() {
        const title=<Button type="primary" onClick={()=>this.showAdd({})}>创建用户</Button>
        const {users,loading,isShow,roles}=this.state
        const columns=[
            {
                title: '用户名',
                dataIndex: 'username',    
            },
            {
                title: '邮箱',
                dataIndex: 'email',    
            },
            {
                title: '电话',
                dataIndex: 'phone',    
            },
            {
                title: '所属角色',
                dataIndex: 'role_id',    
                render:(role_id)=>this.roleNames[role_id]
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',  
                render:formateDate  
            },
            {
                title: '操作',
                width:300,
                render: (user) => {
                    return(
                        <span>
                            <LinkButtom style={{marginRight:'30px'}} onClick={()=>this.showAdd(user)}>修改</LinkButtom>
                            <LinkButtom onClick={()=>this.deleteUser(user)}>删除</LinkButtom>
                        </span>
                    )
                },
            },  
        ]
        return (
            <div>
                <Card title={title} type="primary">
                    <Table dataSource={users} columns={columns} bordered rowKey="_id" loading={loading}
                    pagination={{
                        defaultPageSize:5,
                        showQuickJumper: true,
                        showSizeChanger:true,
                        pageSizeOptions:[1,5,8]
                    }}/>;
                </Card>
                <Modal
                  title={this.user.username===undefined?'添加用户':"修改用户"}
                  visible={isShow}
                  onOk={this.addupdateUser}
                  onCancel={this.handleCancel}
                >
                    <Form ref={this.userFormRef} labelCol={{span: 5,}} wrapperCol={{span:16,}} initialValues={this.user}>
                        <Form.Item name='username' 
                        rules={[{ required: true, message: '请输入用户名称' }]}
                        label="用户名称">
                            <Input></Input>
                        </Form.Item>
                        {
                            this.user.username?null:(
                                <Form.Item name='password'
                                    rules={[{ required: true, message: '请输入密码' }]}
                                    label="密码">
                                        <Input type="password"></Input>
                                </Form.Item>
                            )
                        }
                        <Form.Item name='phone'
                        rules={[{ required: true, message: '请输入手机' }]}
                        label="手机">
                            <Input></Input>
                        </Form.Item>
                        <Form.Item name='email'
                        rules={[{ required: true, message: '请输入邮箱' }]}
                        label="邮箱">
                            <Input></Input>
                        </Form.Item>
                        <Form.Item name='role_id'
                        rules={[{ required: true, message: '请选择角色' }]}
                        label="角色">
                            <Select>
                                {
                                    roles.map(role=><Option key={role._id} value={role._id}>{role.name}</Option>)
                                }
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default User;