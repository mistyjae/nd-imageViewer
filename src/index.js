/*
    测试查看运行效果
 */
require('console-polyfill')
import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import utils from 'nd-utils'
// ES6
import ImagePopup from './imgComponent/index'
let { bind } = utils.bindUtil

class ImageListElement extends React.Component {
    static displayName = 'ImageListElement'
    static propTypes = {
    }
    
    constructor(props) {
        super(props)
        this._onImageClick = bind(this.onImageClick, this)
    }

    onImageClick(index, url, e) {
        this.refs.imagePopup.show(0)
    }

    render() {
        const imageData = [
            {
                title: '一只孤独的鲸',
                picUrl: 'https://betacs.101.com/v0.1/download?dentryId=cd478042-815f-42e7-a886-e16d925deff0&size=80',
                originalUrl: 'https://betacs.101.com/v0.1/download?dentryId=cd478042-815f-42e7-a886-e16d925deff0'
            },
            {
                title: '我是猫',
                picUrl: 'https://betacs.101.com/v0.1/download?dentryId=f7423d00-5ef0-4000-b531-fe5c2efae1a3&size=80',
                originalUrl: 'https://betacs.101.com/v0.1/download?dentryId=f7423d00-5ef0-4000-b531-fe5c2efae1a3'
            }
        ]
        return(
            <div>
                <span onClick={this._onImageClick}>click me</span>
                <ImagePopup ref='imagePopup' data={imageData} />
            </div>
        )
    }
}

render(
    <ImageListElement />,
    document.getElementById('root')
)
