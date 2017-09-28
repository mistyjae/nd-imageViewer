import DragDialog from './draggableDialog'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'

export default class extends Component {
    static displayName = 'dragDialog'

    static propTypes = {
        children: React.PropTypes.node
    }

    appendMaskIntoDoc() {
        //防止页面跳转时parentComponent已不存在时再去渲染
        if(this._reactInternalInstance) {
            ReactDOM.unstable_renderSubtreeIntoContainer(
                this,
                <DragDialog {...this.props}>
                    {this.props.children}
                </DragDialog>,
                this.container
            )
        }
    }

    componentDidMount() {
        if(!this.container) {
            this.container = document.createElement('div')
            document.body.appendChild(this.container)
            this.appendMaskIntoDoc()
        }
    }

    componentDidUpdate() {
        this.appendMaskIntoDoc()
    }

    componentWillUnmount() {
        if(this.container) {
            document.body.removeChild(this.container)
        }
    }

    render() {
        return null
    }
}
