## 使用

### example

```
npm install nd-image-viewer@^0.1.0 --save
```

或手工编辑 `package.json`

```
"dependencies": {¬                                                                                                                                                                                           
    "nd-image-viewer": "^0.1.0"¬
}¬
```

完整用法:

```
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

```

### 开发模式运行
```
npm start
```

### 编译
```
npm run build
```

### 测试及覆盖率
```
npm run test
npm run cover
```

### 组件配置说明
1. package.json 里要指明 main
1. webpack/production.config.js 里的输出路径要与 main 匹配
1. webpack/dev.config.js 配置的入口为示例文件的入口而不是 lib 的入口，要注意区分
1. webpack/dev.config.js 配置的入口为示例文件的入口而不是 lib 的入口，要注意区分
1. 注意 webpack 的 output 配置, 加了 `library` 和 `libraryTarget`
