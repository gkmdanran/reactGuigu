import React, { Component } from 'react';
import {Card,Select,Input,Button,Table,message} from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons';
import LinkButton from "../../components/linkbutton/linkbutton"
import { reqProducts,reqSearchProducts,reqUpdateStatus } from '../../api/index';

const Option=Select.Option
class Producthome extends Component {
    state={
        products:[],
        tota:0,
        loading:false,
        searchName:'',
        searchType:'productName'
    }
    componentDidMount(){
        this.getProducts(1,5)
    }
    getProducts=async (pageNum,pageSize)=>{
        this.pageNum=pageNum
        this.pageSize=pageSize
        this.setState({
            loading:true
        })
        const {searchName,searchType}=this.state
        let res
        if(searchName){
             res=await reqSearchProducts({pageNum,pageSize,searchName,searchType})
        }
        else{
             res=await reqProducts(pageNum,pageSize)
        }
        
        this.setState({
            loading:false
        })
        console.log(res)
        if(res.status===0){
            const {total,list}=res.data
            this.setState({
                total,
                products:list
            })
        }
    }
    changeStauts=async (product)=>{
        let status=product.status===1?2:1
        const res=await reqUpdateStatus(product._id,status)
        if(res.status===0){
            message.success('更新商品状态成功',0.8)
            this.getProducts(this.pageNum,this.pageSize)
        }
        
    }
    render() {
          const {products,total,loading,searchName,searchType}=this.state
          const columns = [
            {
              title: '商品名称',
              dataIndex: 'name',
             
            },
            {
              title: '商品描述',
              dataIndex: 'desc',
            },
            {
              width:100,
              title: '价格',
              dataIndex: 'price',
              render:(price)=>'￥'+price
            },
            {
              width:150,
              title: '状态',
              render:(product)=>{
                  return (
                      <span>
                          <Button type='primary' style={{marginRight:'10px'}} onClick={()=>this.changeStauts(product)}>{product.status===1?'下架':'上架'}</Button>
                          {product.status===1?(<span>在售</span>):(<span>已下架</span>)}
                      </span>
                  )
              }
            },
            {   
                width:150,
                title: '操作',
                render:(product)=>{
                    return (
                        <span>
                            <LinkButton style={{marginRight:'10px'}} onClick={()=>this.props.history.push({pathname:"/product/detail",query:product})}>详情</LinkButton>
                            <LinkButton onClick={()=>this.props.history.push({pathname:"/product/addupdate",query:product})}>修改</LinkButton>
                        </span>
                    )
                }
            },
            
          ]
        const title=(
            <span>
                <Select style={{width:'150px'}} value={searchType} onChange={value=>this.setState({searchType:value})}> 
                    <Option value="productName">按名称搜索</Option>
                    <Option value="productDesc">按描述搜索</Option>
                </Select>
                <Input allowClear placeholder="关键字" style={{width:'200px',marginLeft:'20px',marginRight:'20px'}} value={searchName} onChange={e=>this.setState({searchName:e.target.value})}></Input>
                <Button type="primary" onClick={()=>this.getProducts(1,5)}>搜索</Button>
            </span>
        )
        const extra=(
            <Button type="primary" icon={<PlusCircleOutlined />} onClick={()=>{this.props.history.push('/product/addupdate');sessionStorage.clear()}}>添加商品</Button>
        )
        return (
            <div>
                <Card title={title} extra={extra}>
                    <Table
                    dataSource={products}
                    columns={columns}
                    rowKey='_id'
                    bordered
                    pagination={{
                        current:this.pageNum,
                        total:total,
                        defaultPageSize:5,
                        showQuickJumper:true,
                        showSizeChanger:true,
                        pageSizeOptions:[1,5,8],
                        onChange:(pageNum,pageSize)=>{
                            this.getProducts(pageNum,pageSize)
                        }
                      }}
                      loading={loading}></Table>
                </Card>
            </div>
        );
    }
}

export default Producthome;