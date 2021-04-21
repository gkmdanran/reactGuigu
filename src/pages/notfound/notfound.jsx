import React, { Component } from 'react';
import { Button,} from 'antd';
class Notfound extends Component {
    render() {
        return (
            <div >
                <div >404 NotFound</div>
                <Button type="primary" onClick={()=>{this.props.history.replace("/homepage")}}>回到首页</Button>
            </div>
        );
    }
}

export default Notfound;