import React, { Component } from 'react';
import "./category.less"
import { Card,Button,Table,Modal,Form,Input,Select} from 'antd';
import { PlusCircleOutlined,DoubleRightOutlined } from '@ant-design/icons';
import LinkButtom from "../../components/linkbutton/linkbutton"
import {reqCategory,reqUpdateCategory,reqAddCategory} from "../../api/index"
const { Option } = Select;

class Category extends Component {
  editFormRef = React.createRef(); 
  addFormRef = React.createRef(); 
    state={
         dataSource : [],
         loading:false,
         parentId:'0',
         parentName:'',
         subCategoty:[],
         showStatus:0,
         info:{}
    }
    componentDidMount(){
      this.getCategory()
    }
    getCategory=async ()=>{
      this.setState({loading:true})
      const res=await reqCategory(this.state.parentId)
      this.setState({loading:false})
      
      if(res.status===0){
        if(this.state.parentId==='0'){
          this.setState({
            dataSource:res.data
          })
        }
        else{
          this.setState({
            subCategoty:res.data
          })
        }
         
      }
    }
    showCategorys=(category)=>{
      console.log(category)
      this.setState({
        parentId:category._id,
        parentName:category.name
      },()=>{
        console.log(this.state.parentId)
        this.getCategory()
      })
     
    }
    showCategory=()=>{
      this.setState({
        parentId:'0',
        parentName:'',
        subCategoty:[]
      },()=>{this.getCategory()})
    }
    handleCancel=()=>{
      this.setState({
        showStatus:0
      })
    }
    addCategory=async()=>{
      try {
        var values =await this.addFormRef.current.validateFields();
        let parentId=values.parentId
        let categoryName=values.categoryName
        console.log(parentId,categoryName)
        const res=await reqAddCategory({categoryName,parentId})
        if(res.status===0){
          this.handleCancel()
          if(parentId==='0'){
            this.showCategory()
          }
          else{
            for(let x of this.state.dataSource){
              if(x._id===parentId)
                var parentName=x.name
            }
            this.setState({parentId,parentName},()=>{this.getCategory()})
          }
        }
      } catch (error) {
        
      }
      
    }
    updateCategory=async()=>{
      try {
        var values =await this.editFormRef.current.validateFields();
        var categoryId=this.state.info._id
        let categoryName=values.categoryName
        const res=await reqUpdateCategory(categoryId,categoryName)
        if(res.status===0){
          this.handleCancel()
          this.getCategory()
        }
      } catch (error) {
        
      }
     
    }
    showAdd=()=>{
      this.setState({
        showStatus:1
      },()=>{
        if(this.addFormRef.current){
          this.addFormRef.current.resetFields();
        }
      })
      
    }
    showUpdate=(category)=>{
      this.setState({
        showStatus:2,
        info:category
      },()=>{
        if(this.editFormRef.current){
          this.editFormRef.current.resetFields();
        }
      })
    }
    render() {
      const {dataSource,loading,parentId,subCategoty,parentName,showStatus}=this.state
      const title=parentId==='0'?'一级分类列表':(
          <span>
            <LinkButtom onClick={this.showCategory}>一级分类列表</LinkButtom>
            <DoubleRightOutlined style={{margin:'0 10px'}}/>
            <span>{parentName}</span>
          </span>
      )
      const extra=<Button type="primary" icon={<PlusCircleOutlined />} onClick={this.showAdd}>添加分类</Button>  
      const columns = [
        {
          title: '分类名称',
          dataIndex: 'name',
          
        },
        {
            title: '操作',
            width:300,
            render: (category) => {
                return(
                    <span>
                        <LinkButtom style={{marginRight:'30px'}} onClick={()=>{this.showUpdate(category)}}>修改分类</LinkButtom>
                        {this.state.parentId==='0'?<LinkButtom onClick={()=>{this.showCategorys(category)}}>查看子分类</LinkButtom>:null}
                    </span>
                )
            },
        },  
      ];
      return (
          <div>
              <Card title={title} extra={extra} style={{ width: '100%' }} >
                  <Table dataSource={parentId==='0'?dataSource:subCategoty} columns={columns} bordered rowKey="_id" loading={loading}
                  pagination={{
                    defaultPageSize:5,
                    showQuickJumper: true,
                    showSizeChanger:true,
                    pageSizeOptions:[1,5,8]
                  }}/>;
              </Card>
 
              <Modal
                  title="修改分类"
                  visible={showStatus===2}
                  onOk={this.updateCategory}
                  onCancel={this.handleCancel}
                >
                <Form ref={this.editFormRef} >
                  <Form.Item name='categoryName' initialValue={this.state.info.name}
                   rules={[{ required: true, message: '请输入分类名称' }]}
                   label="分类名称">
                    <Input></Input>
                  </Form.Item>
                </Form>
              </Modal>
              <Modal
                  title="添加分类"
                  visible={showStatus===1}
                  onOk={this.addCategory}
                  onCancel={this.handleCancel}
                >
                <Form ref={this.addFormRef} >
                  <Form.Item name='parentId' 
                    rules={[{ required: true, message: '请选择所属分类' }]}
                    label="所属分类"
                    initialValue={this.state.parentId}>
                    <Select>
                    <Option value="0">一级分类</Option>
                    {this.state.dataSource.map((item)=>{
                      return (
                      <Option value={item._id} key={item._id}>{item.name}</Option>
                      )
                    })}
                    </Select>
                  </Form.Item>
                  <Form.Item name='categoryName' 
                   rules={[{ required: true, message: '请输入分类名称' }]}
                   label="分类名称">
                    <Input></Input>
                  </Form.Item>
                  
                </Form>
              </Modal>
          </div>
      );
    }
}

export default Category;