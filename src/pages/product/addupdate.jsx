import React, { Component } from 'react';
import {Card,Form,Input,Cascader,Upload,Button,Modal,message } from 'antd'
import {LeftOutlined,PlusOutlined} from '@ant-design/icons';
import { reqCategory,reqAddProduct} from "../../api/index";
import {EditorState, convertToRaw, ContentState} from 'draft-js'
import {Editor} from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'


const Item=Form.Item
const {TextArea}=Input
function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
}
class Addupdate extends Component {
    FormRef = React.createRef(); 
    state={
        options:[],
        previewVisible: false,
        previewImage: '',
        previewTitle: '',
        fileList: [],
        editorState:EditorState.createEmpty()
    }
    onEditorStateChange=(editorState)=>{
        this.setState({
            editorState
        })
    }
    getDetail=()=>{
        return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
    }
    uploadImageCallBack = (file) => {
        return new Promise(
          (resolve, reject) => {
            const xhr = new XMLHttpRequest()
            xhr.open('POST', '/manage/img/upload')
            const data = new FormData()
            data.append('image', file)
            xhr.send(data)
            xhr.addEventListener('load', () => {
              const response = JSON.parse(xhr.responseText)
              const url = response.data.url // 得到图片的url
              resolve({data: {link: url}})
            })
            xhr.addEventListener('error', () => {
              const error = JSON.parse(xhr.responseText)
              reject(error)
            })
          }
        )
    }
    UNSAFE_componentWillMount(){
        if(this.props.location.query)
            sessionStorage.setItem("productdetail",JSON.stringify(this.props.location.query))
        this.isUpdate=!!sessionStorage.getItem("productdetail")
        var product=sessionStorage.getItem("productdetail")
        if(product){
            var imgs=JSON.parse(product).imgs
            if(imgs&&imgs.length>0){
                var list=imgs.map((img,index)=>{
                    return {
                        uid:-index,
                        name:img,
                        status:'done',
                        url:'http://localhost:5000/upload/'+img    
                    }
                })
                this.setState({
                    fileList:list
                })
            }
            var detail=JSON.parse(product).detail
            if(detail){
                const contentBlock = htmlToDraft(detail)
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
                const editorState = EditorState.createWithContent(contentState)
                this.setState({editorState})
            }
        }
        
    }
    checkPrice=(rule,value)=>{
        if (value*1>0||value==='') {
            return Promise.resolve();
        }
        return Promise.reject('商品价格格式错误');
          
    }
    getCategorys=async (parentId)=>{
        const res=await reqCategory(parentId)
        if(res.status===0){
            const categorys=res.data
            if(parentId==='0')
                this.initOptions(categorys)
            else{
                return categorys
            }
        }
    }
    loadData=async (selectOption)=>{
        const targetOption=selectOption[0]
        // targetOption.loading=true
       
        const subCategorys=await this.getCategorys(targetOption.value)
        // this.loading=false
        if(subCategorys&&subCategorys.length>0){
            const childoptions=subCategorys.map(c=>{
                return {
                    value:c._id,
                    label:c.name,
                    isLeaf:true
                }
            })
            targetOption.children=childoptions
        }else{
            targetOption.isLeaf=true
        }
        this.setState({
            options:[...this.state.options]
        })
    }
    initOptions=async (categorys)=>{
        const options=categorys.map(c=>{
            return {
                value:c._id,
                label:c.name,
                isLeaf:false
            }
        })
        if(this.isUpdate&&this.product.pCategoryId!=='0'){
            const subCategorys=await this.getCategorys(this.product.pCategoryId)
            const childoptions=subCategorys.map(c=>{
                return {
                    value:c._id,
                    label:c.name,
                    isLeaf:true
                }
            })
            
            const targetOption=options.find(option=>option.value===this.product.pCategoryId)
          
            targetOption.children=childoptions
            
        }
        this.setState({options})
    }
    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
        previewImage: file.url || file.preview,
        previewVisible: true,
        previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    };
    handleChange = async ({ file,fileList }) => {
        
        if(file.status==='done'){
            const res=file.response
            if(res.status===0){
                message.success("上传图片成功",0.8)
                const　{name,url}=res.data
                file=fileList[fileList.length-1]
                file.name=name
                file.url=url
                
            }else{
                message.error("上传图片失败",0.8)
                fileList.pop()
            }
        }
        // else if(file.status==='removed'){
        //     const res=await reqDeleteImg(file.name)
        //     if(res.status===0){
        //         message.success("删除图片成功",0.8)
        //     }else{
        //         message.error("删除图片失败",0.8)
        //     }
        // }
        this.setState({ fileList })
    };
    componentDidMount(){
        this.getCategorys('0')
    }
    submit=async ()=>{
        try {
            var values =await this.FormRef.current.validateFields();
           
            var imgs=this.state.fileList.map(img=>img.name)
            var detail=this.getDetail()
            let pCategoryId,categoryId
            if(values.categoryIds.length===1){
                pCategoryId='0'
                categoryId=values.categoryIds[0]
            }
            else{
                pCategoryId=values.categoryIds[0]
                categoryId=values.categoryIds[1]
            }
            const product={
                name:values.name,
                desc:values.desc,
                price:values.price,
                imgs,
                detail,
                pCategoryId,
                categoryId
            }
            if(this.isUpdate){
                product._id=JSON.parse(sessionStorage.getItem("productdetail"))._id
            }
            console.log(product)
            const res=await reqAddProduct(product)
            if(res.status===0){
                message.success('操作成功',0.8)
                this.props.history.goBack()
            }
                
            else{
                message.error('操作失败',0.8)
            }
        } catch (error) {
            
        }
    }
    render() {
        this.product={}
        var categoryIds=[]
        if(this.isUpdate){
             this.product=JSON.parse(sessionStorage.getItem("productdetail"))
            var {desc,name,price,pCategoryId,categoryId}=this.product
            
            if(pCategoryId==='0'){
                categoryIds.push(categoryId)
            }
            else{
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }
            
        }         
        const title=(
            <span>
                <LeftOutlined style={{marginRight:'10px'}} onClick={()=>this.props.history.push('/product')}/>
                <span>{this.isUpdate?'修改商品':'添加商品'}</span>
            </span>
        )
        const { previewVisible, previewImage, fileList, previewTitle } = this.state;
        const uploadButton = (
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        );
        return (
            <div>
                <Card title={title}>
                    <Form  labelCol={{span: 2,}} wrapperCol={{span:10,}} ref={this.FormRef}>
                        <Item label="商品名称" initialValue={name} name="name" rules={[{ required: true, message: '请输入商品名称' }]}>
                            <Input placeholder="请输入商品名称" ></Input>
                        </Item>
                        <Item label="商品描述" initialValue={desc} name="desc" rules={[{ required: true, message: '请输入商品描述' }]}>
                            <TextArea autoSize={{ minRows: 2, maxRows: 6 }} style={{resize:'none'}}></TextArea>
                        </Item>
                        <Item label="商品价格" name="price" 
                        initialValue={price}
                        rules={[
                            { required: true, message: '请输入商品价格' },
                            {
                                validator:this.checkPrice
                            }
                            ]}>
                            <Input  type="number" suffix="元"></Input>
                        </Item>
                        <Item label="商品分类" initialValue={categoryIds} name="categoryIds" rules={[{ required: true, message: '请选择商品分类' }]}>
                        <Cascader
                            options={this.state.options}
                            loadData={this.loadData}
                        />
                        </Item>
                        <Item label="商品图片">
                            <Upload
                                action="/manage/img/upload"
                                listType="picture-card"
                                accept='image/*'
                                fileList={fileList}
                                onPreview={this.handlePreview}
                                onChange={this.handleChange}
                                name="image"
                            >
                                {fileList.length >= 3 ? null : uploadButton}
                            </Upload>
                            <Modal
                                visible={previewVisible}
                                title={previewTitle}
                                footer={null}
                                onCancel={this.handleCancel}
                                >
                                <img alt="example" style={{ width: '100%' }} src={previewImage} />
                            </Modal>
                        </Item>
                        <Item label="商品详情">
                           <Editor
                                 editorState={this.state.editorState}
                                 editorStyle={{border: '1px solid black', minHeight: 200, paddingLeft: 10}}
                                 onEditorStateChange={this.onEditorStateChange}
                                 toolbar={{
                                   image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
                                 }}
                           />
                        </Item>
                        <Item>
                            <Button type="primary" style={{marginLeft:'100px'}} onClick={this.submit}>提交</Button>
                        </Item>
                    </Form>
                </Card>

            </div>
        );
    }
}

export default Addupdate;