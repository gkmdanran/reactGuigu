import ajax from "./ajax"
import jsonp from 'jsonp'
import { message } from 'antd';
export const reqLogin=(login)=>ajax('/login',login,'POST')
export const reqAddUser=(user)=>ajax('/manage/user/add',user,'POST')
export const reqWeather=(city)=>{
    const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
    return new Promise((resolve,reject)=>{
        jsonp(url,{},(err,data)=>{
            if(!err&&data.status==='success'){
                const {dayPictureUrl,weather}=data.results[0].weather_data[0]
                resolve({dayPictureUrl,weather})
            }
            else{
                message.error('获取天气失败')
            }
        })
    })
    
}
export const reqCategory=(parentId)=>ajax('/manage/category/list',{parentId})
export const reqAddCategory=({categoryName,parentId})=>ajax('/manage/category/add',{categoryName,parentId},'POST')
export const reqUpdateCategory = (categoryId, categoryName) => ajax('/manage/category/update', {categoryId, categoryName}, 'POST')
export const reqProducts=(pageNum,pageSize)=>ajax('/manage/product/list',{pageNum,pageSize})
export const reqSearchProducts=({pageNum,pageSize,searchName,searchType})=>ajax('/manage/product/search',{pageNum,pageSize,[searchType]:searchName})
export const reqCate=(categoryId)=>ajax('/manage/category/info',{categoryId})
export const reqUpdateStatus=(productId,status)=>ajax('/manage/product/updateStatus',{productId,status},'POST')
export const reqDeleteImg=(name)=>ajax('/manage/img/delete',{name},'POST')
export const reqAddProduct=(product)=>ajax('/manage/product/'+(product._id?'update':'add'),product,'POST')
export const reqRoles=()=>ajax('/manage/role/list')
export const reqAddRole=(roleName)=>ajax('manage/role/add',{roleName},'POST')
export const reqUpdateRole=(role)=>ajax('/manage/role/update',role,'POST')
export const reqUsers=()=>ajax('/manage/user/list')
export const reqDeleteUser=(userId)=>ajax('/manage/user/delete',{userId},'POST')
export const reqAddUsers=(user)=>ajax('/manage/user/add',user,'POST')
export const reqUpdateUser=(user)=>ajax('/manage/user/update',user,'POST')