import React, { Component } from 'react';
import {Card,Button,Table,Modal,Form,Input, message,Tree} from 'antd'
import {reqRoles,reqAddRole,reqUpdateRole} from '../../api/index'
import {formateDate} from "../../utils/dateUtils"
import menuList from "../../config/menuConfig"
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
class Role extends Component {
    addFormRef = React.createRef(); 
    setFormRef = React.createRef(); 
    state={
        roles:[],
        role:{},
        addVisible:false,
        setVisible:false,
        checkedKeys:[]
    }
    onRow=(role)=>{
        return{
            onClick:event=>{
                this.setState({
                    role,     
                })
            }
        }
    }
    getRoles=async ()=>{
        const res=await reqRoles()
        if(res.status===0){
            this.setState({
                roles:res.data,
            })
        }
    }
    handleCancel=()=>{
        this.setState({
          addVisible:false
        })
    }
    showAdd=()=>{
        this.setState({
            addVisible:true
        },()=>{
            if(this.addFormRef.current){
              this.addFormRef.current.resetFields();
            }
          })
    }
    showSet=()=>{
        this.setState({
            setVisible:true,
            checkedKeys:this.state.role.menus
        },()=>{
            if(this.setFormRef.current){
              this.setFormRef.current.resetFields();
            }
          })
    }
    addRole=async()=>{
        try {
            var values =await this.addFormRef.current.validateFields();
            console.log(values)
            const res=await reqAddRole(values.name)
            console.log(res)
            if(res.status===0){
                this.handleCancel()
                this.setState(state=>({
                    roles:[...state.roles,res.data]
                }))
            }
            else{
                message.error('创角角色失败',0.8)
            }
        } catch (error) {
            
        }
    }
    componentDidMount(){
        this.getRoles()
        this.getRights()
    }
    getRights=()=>{
        this.rights= [{
            title:"所有",
            key:"all",
            children:menuList
        }]
    }
    updateRole=async ()=>{
        let role=JSON.parse(JSON.stringify(this.state.role))
        role.menus=JSON.parse(JSON.stringify(this.state.checkedKeys))
        role.auth_name=JSON.parse(localStorage.getItem('user_key')).username
        
        const res =await reqUpdateRole(role)
        if(res.status===0){
            if(role._id===memoryUtils.user.role_id){
                storageUtils.romoveUser('user_key')
                memoryUtils.user={}
                this.props.history.push('/login')
                message.success('当前用户权限发生改变请重新登录',0.8)
            }else{
                this.setState({
                    setVisible:false,
                    role:res.data
                })
                this.getRoles()
                message.success('分配权限成功',0.8)
            }
        }
        
    }
    onCheck = (checkedKeys) => {
        this.setState({
            checkedKeys,
        })
      };
    render() {
        
        const {roles,role,addVisible,setVisible,checkedKeys}=this.state
        const title=(
            <span>
                <Button type="primary" style={{marginRight:'10px'}} onClick={this.showAdd}>创建角色</Button>
                <Button disabled={!role._id} onClick={this.showSet}>设置角色权限</Button>
            </span>
        )
       
        const columns=[
            {
                title:'角色名称',
                dataIndex:'name'
            },
            {
                title:'创建时间',
                dataIndex:'create_time',
                render:(time)=>formateDate(time)
            },
            {
                title:'授权时间',
                dataIndex:'auth_time',
                render:(time)=>formateDate(time)
            },
            {
                title:'授权人',
                dataIndex:'auth_name'
            }
        ]
        return (
            <div>
                <Card title={title}>
                    <Table 
                        bordered
                        rowKey="_id"
                        dataSource={roles}
                        columns={columns}
                        pagination={{
                            defaultPageSize:5,
                            showQuickJumper:true,
                            showSizeChanger:true,
                            pageSizeOptions:[1,5,8],
                          }}
                        rowSelection={{type:'radio',
                        selectedRowKeys:[role._id],
                        onSelect:(role)=>{
                            this.setState({
                                role,     
                            })
                        }
                        }}
                        onRow={this.onRow}
                    >
                        
                    </Table>
                </Card>
                <Modal
                  title="创建角色"
                  visible={addVisible}
                  onOk={this.addRole}
                  onCancel={this.handleCancel}
                >
                    <Form ref={this.addFormRef} >
                        <Form.Item name='name'
                        rules={[{ required: true, message: '角色名称' }]}
                        label="角色名称">
                            <Input></Input>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                  title="设置角色权限"
                  visible={setVisible}
                  onOk={this.updateRole}
                  onCancel={()=>this.setState({
                      setVisible:false
                  })}
                >
                    <Form ref={this.setFormRef} >
                        <Form.Item name='name'
                        label="角色名称"
                        initialValue={role.name}
                        >
                            <Input disabled></Input>
                        </Form.Item>
                    </Form>
                    <Tree
                        checkable   
                        defaultExpandAll
                        treeData={this.rights}
                        checkedKeys={checkedKeys}
                        onCheck={this.onCheck}
                        />
                </Modal>
            </div>
        );
    }
}

export default Role;