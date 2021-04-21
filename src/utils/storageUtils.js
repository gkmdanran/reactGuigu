export default{
    saveUser(user){
        localStorage.setItem("user_key",JSON.stringify(user))
    },
    getUser(){
        return JSON.parse(localStorage.getItem("user_key")||'{}')
    },
    romoveUser(){
        localStorage.removeItem("user_key")
    }
}