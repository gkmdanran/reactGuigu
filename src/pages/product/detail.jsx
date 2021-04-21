import React, { Component } from 'react';
import {Card,List} from 'antd'
import {LeftOutlined} from '@ant-design/icons';
import "./detail.less"
import {reqCate} from "../../api/index"
const Item=List.Item
class Detail extends Component {
    state={
        product:{},
        cName1:'',
        cName2:''
    }
    UNSAFE_componentWillMount(){
        console.log(2)
        if(this.props.location.query)
            sessionStorage.setItem("productdetail",JSON.stringify(this.props.location.query))
    }
    async componentDidMount(){
        let product=JSON.parse(sessionStorage.getItem("productdetail"))
        if(product.pCategoryId==='0'){
            const result=await reqCate(product.categoryId)
            console.log(result)
            this.setState({
                cName1:result.data.name,
                cName2:''
            })
        }
        else{
            const results=await Promise.all([reqCate(product.categoryId),reqCate(product.pCategoryId)])
            this.setState({
                cName1:results[1].data.name,
                cName2:results[0].data.name
            })
        }
        
    }
    render() {
        console.log(1)
        let product=JSON.parse(sessionStorage.getItem("productdetail"))
        console.log(product)
        const {desc,name,price,imgs,detail}=product
        const title=(
            <span>
                <LeftOutlined style={{marginRight:'10px'}} onClick={()=>this.props.history.push('/product')}/>
                <span>商品详情</span>
            </span>
        )
        return (
            <div className="productDetail">
                <Card title={title}>
                    <List>
                        <Item>
                            <span className="left">商品名称：</span>
                            {name}
                        </Item>
                        <Item>
                            <span className="left">商品描述：</span>
                            {desc}
                        </Item>
                        <Item>
                            <span className="left">商品价格：</span>
                            ￥{price}
                        </Item>
                        <Item>
                            <span className="left">所属分类：</span>
                            {this.state.cName2===''?this.state.cName1:this.state.cName1+"  >>  "+this.state.cName2}
                        </Item>
                        <Item>
                            <span className="left">商品图片：</span>
                            {imgs.map(item=><img src={'http://localhost:5000/upload/'+item}  className="img" key={item} alt="IMG"></img>)}
                        </Item>
                        
                        <Item>
                            <span className="left">商品详情：</span>
                            <span dangerouslySetInnerHTML={{__html:detail}}></span>
                        </Item>
                    </List>
                </Card>
            </div>
        );
    }
}

export default Detail;