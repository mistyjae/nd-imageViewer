import styles from '../../../styles/draggableDialog.css'
import React from 'react'
import DOM from 'react-dom'
import utils from 'nd-utils'
import classnames from 'classnames'
let { boolean } = utils.typeUtils
let { bind } = utils.bindUtil
let DomUtil = utils.domUtil

/*eslint-disable */
export default class DragDialog extends React.Component {
    constructor(props) {
        super(props)
        let isFullScreen = boolean(this.props.isFullScreen, false)
        this.state = {
            isDragging      : false,
            isResizing      : false,
            width           : isFullScreen ? DomUtil.getWindowSize().width : this.props.width,
            height          : isFullScreen ? DomUtil.getWindowSize().height : this.props.height,
            wWidth          : DomUtil.getWindowSize().width,
            wHeight         : DomUtil.getWindowSize().height,
            resizeClientX   : 0,
            resizeClientY   : 0,
            style           : {},
            dragChangeStyle : false,
            maximized       : false,
            isCloseConfirm  : false,
            showConfirm     : false,
            isShow          : false,
            originalWidth   : this.props.width,
            originalHeight  : this.props.height
        }

        this._resizeWindows = bind(this.resizeWindows, this)
        this._setStyle = bind(this.setStyle, this)
        this._onCancel = bind(this.onCancel, this)
        this._onConfirm = bind(this.onConfirm, this)
        this._onCancelConfirm = bind(this.onCancelConfirm, this)
        this._onMouseMove = bind(this.onMouseMove, this)
        this._onDragStart = bind(this.onDragStart, this)
        this._onDragEnd = bind(this.onDragEnd, this)
        this._onDragging = bind(this.onDragging, this)
        this._onResizeStart = bind(this.onResizeStart, this)
        this._onResizing = bind(this.onResizing, this)
        this._onResizeEnd = bind(this.onResizeEnd, this)
        this._onDoubleClick = bind(this.onDoubleClick, this)
        this._getContentHeight = bind(this.getContentHeight, this)
        this._scroll = bind(this.scroll, this)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._resizeWindows, false)
    }

    componentDidMount() {
        let { isFooterTransparent = false, isShowFooter = true } = this.props
        let winWidth = DomUtil.getWindowSize().width
        let winHeight = DomUtil.getWindowSize().height
        let widthTemp = winWidth < this.state.width?winWidth*0.9 : this.state.width
        let heightTemp = winHeight < this.state.height?winHeight*0.9  : this.state.height
        let footerHeight = this.getFooterHeight()
        
        let style = {
            width   : widthTemp + 'px',
            height  : heightTemp + 'px',
            left    : (this.state.wWidth-widthTemp)/2,
            top     : (this.state.wHeight-heightTemp)/2
        }
        this.setState({
            style         : style,
            width         : style.width,
            height        : style.height,
            footerHeight  : footerHeight,
            contentHeight : this._getContentHeight(style.height, footerHeight)
        })

        window.addEventListener('resize', this._resizeWindows, false)
    }

    getFooterHeight() {
        let { isFooterTransparent = false, isShowFooter = true } = this.props
        let footerHeight = 0
        if(!isFooterTransparent && isShowFooter && this.refs.footer) {
            let heightTemp = DomUtil.getStyle(DOM.findDOMNode(this.refs.footer), 'height')
            let _footerHeight = heightTemp == 'auto' ? DomUtil.getStyle(DOM.findDOMNode(this.refs.footer), 'minHeight') : heightTemp
            footerHeight = parseInt(_footerHeight.slice(0, _footerHeight.length - 2))
        }
        return footerHeight
    }

    resizeWindows() {
        let winWidth = DomUtil.getWindowSize().width
        let winHeight = DomUtil.getWindowSize().height
        let widthResize = (winWidth*0.9) > this.state.originalWidth?this.state.originalWidth : winWidth*0.9
        let heightResize = (winHeight*0.9) > this.state.originalHeight?this.state.originalHeight : winHeight*0.9
        let style = {
            width   : widthResize + 'px',
            height  : heightResize + 'px',
            left    : (winWidth-widthResize)/2,
            top     : (winHeight-heightResize)/2
        }
        this.setState({
            style  : style,
            width  : style.width,
            height : style.height
        })
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.showConfirm != undefined) {
            this.setState({
                showConfirm: nextProps.showConfirm
            })
        }

        //编辑器改变宽高时 调整宽高和位置
        if(nextProps.width != this.props.width || nextProps.height != this.props.height) {
            this.setStyle(nextProps)
        }
    }

    setStyle(props) {
        let style = {
            width   : props.width + 'px',
            height  : props.height + 'px',
            left    : (this.state.wWidth-props.width)/2,
            top     : (this.state.wHeight-props.height)/2
        }
        let footerHeight = this.getFooterHeight()
        this.setState({
            style  : style,
            width  : props.width,
            height : props.height,
            footerHeight: footerHeight,
            contentHeight: this._getContentHeight(props.height, footerHeight)
        })
    }

    onCancel() {
        if (this.props.onCloseCb) {
            if (this.props.isCloseConfirm) {
                this.setState({
                    showConfirm: true
                })
            }else {
                this.props.onCloseCb()
            }
        }
        if(document.getElementsByTagName('body')[0].style.overflow == 'hidden') {
            document.getElementsByTagName('body')[0].setAttribute('style','overflow:visible')
        }
    }

    onConfirm() {
        this.setState({
            showConfirm: false
        })
        this.props.onCloseCb()
    }

    onCancelConfirm() {
        this.setState({
            showConfirm: false
        })
    }

    onMouseMove(e) {
        if(this.props.isDraggable) {
            this._onDragging(e)
        }
        if(this.props.isResizable) {
            this._onResizing(e)
        }
    }

    /**
     * 开始拖拽
     */
    onDragStart(e) {
        e.preventDefault()

        if(this.state.isDragging) {
            return
        }
        this.setState({
            clientX     : e.clientX,
            clientY     : e.clientY,
            isDragging  : true,
            dragChangeStyle  : true
        })
        document.addEventListener('mouseup',this._onDragEnd)
    }

    /**
     * 结束拖拽
     */
    onDragEnd(e) {
        this.setState({
            clientX : 0,
            clientY : 0,
            isDragging : false
        })
        document.removeEventListener('mouseup',this._onDragEnd)
    }

    /**
     * 拖拽中
     */
    onDragging(e) {

        if(!this.state.isDragging) {
            return
        }
        e.preventDefault()

        let client = document.getElementById(this.props.id)

        let position ={
            left : client.offsetLeft,
            top : client.offsetTop
        }
        let diffX =  e.clientX - this.state.clientX
        let diffY = e.clientY - this.state.clientY

        let height = client.offsetHeight
        let width = client.offsetWidth

        position.left += diffX
        position.top += diffY
        let clientX = this.state.clientX
        let clientY = this.state.clientY

        let style = {...this.state.style}
        if(position.left>=0&&(position.left+width) <= this.state.wWidth) {
            style.left = position.left + 'px'
            clientX = e.clientX
        }

        if(position.top >=0 && (position.top+height) <= this.state.wHeight) {
            style.top = position.top + 'px'
            clientY = e.clientY
        }

        this.setState({
            style : style,
            clientX : clientX,
            clientY : clientY
        })
    }

    onResizeStart(e) {
        e.preventDefault()
        if(this.state.isResizing) {
            return
        }

        this.setState({
            resizeClientX       : e.clientX,
            resizeClientY       : e.clientY,
            isResizing          : true
        })
        document.addEventListener('mouseup',this._onResizeEnd)
    }

    onResizing(e) {
        if(!this.state.isResizing) {
            return
        }
        e.preventDefault()
        let client = document.getElementById(this.props.id)

        let tempWidth = e.clientX - client.offsetLeft
        let tempHeight = e.clientY - client.offsetTop
        let style = {...this.state.style}

        if(tempWidth<this.props.minWidth) {
            tempWidth = this.props.minWidth
        }
        style.width = tempWidth + 'px'

        if(tempHeight<this.props.minHeight) {
            tempHeight = this.props.minHeight
        }
        style.height = tempHeight + 'px'
        let footerHeight = this.props.isShowFooter && this.refs.footer ? this.refs.footer.offsetHeight : 0
        this.setState({
            style : style,
            width:tempWidth,
            height:tempHeight,
            footerHeight: footerHeight,
            contentHeight: this._getContentHeight(tempHeight, footerHeight),
            resizeClientX : e.clientX,
            resizeClientY : e.clientY
        })
    }

    onResizeEnd(e) {
        this.state.resizeClientX = 0
        this.state.resizeClientY = 0
        this.state.isResizing = false
        document.removeEventListener('mouseup',this._onResizeEnd)
    }

    onDoubleClick(e) {
        let style = this.state.style
        if(this.state.maximized) {
            style = this.origSize
        } else {
            this.origSize = style
            style = {
                width   : this.state.wWidth + 'px',
                height  : this.state.wHeight + 'px',
                left    : 0,
                top     : 0
            }
        }
        let footerHeight = this.props.isShowFooter && this.refs.footer ? this.refs.footer.offsetHeight : 0
        this.setState({
            style : style,
            footerHeight: footerHeight,
            contentHeight: this._getContentHeight(null, footerHeight),
            maximized : !this.state.maximized
        })
    }

    getContentHeight(height, footerHeight) {
        let dialogHeight = height ? parseFloat(height) : parseFloat(this.state.height)
        let titleHeight = this.refs.title ? parseFloat(DomUtil.getStyle(this.refs.title, 'height')) : 0
        titleHeight = isNaN(titleHeight) ? 49 : titleHeight
        footerHeight = this.props.isShowFooter && isNaN(footerHeight) ? 61 : footerHeight
        let isScrollY = this.props.isScrollableY || this.props.isScrollable
        return dialogHeight - titleHeight - (this.props.isFooterTransparent ? (isScrollY ? footerHeight : 0) : footerHeight)
    }

    scroll(isTop) {
        let content = DOM.findDOMNode(this.refs['content'])
        if(content && this.props.isScrollableY || this.props.isScrollable) {
            if(isTop) {
                content.scrollTop = 0
            } else {
                content.scrollTop = content.scrollHeight
            }
        }
    }

    getThemeClass() {
        let prefixCls = this.props.prefixCls || ''
        // let prefixCls = ''
        return {
            header: classnames({ [styles['dialog-title']]: true, [`${prefixCls}-header`]: prefixCls }),
            closeBtn: classnames({ [styles['close-dialog']]: true, [`${prefixCls}-btn-close`]: prefixCls }),
            footer: classnames({ 
                [styles['dialog-footer']]: true, 
                [styles['clearfix']]: true,
                [`${prefixCls}-footer`]: prefixCls,
                [styles['footerTransparent']]: this.props.isFooterTransparent
            }),
            dialog: classnames({ [styles['dialog']]: true, [`${prefixCls}-dialog`]: prefixCls })
        }
    }

    render() {
        let { prefixCls, getHeaderContainer } = this.props
        let themes = this.getThemeClass()
        let isTitleBar = this.props.isTitleBar == false ? this.props.isTitleBar : true
        let hideStyle = this.props.isShow?'':styles['hide']
        
        let isScrollY = this.props.isScrollableY || this.props.isScrollable
        let footerHeight = this.state.footerHeight ? this.state.footerHeight : 61

        let rootStyle = {
            height: this.state.contentHeight ? this.state.contentHeight : '100%',
            paddingBottom: this.props.isShowFooter && this.props.isFooterTransparent && isScrollY ? footerHeight : 0
        }
        if(this.props.isScrollableX || this.props.isScrollableY) {
            rootStyle['overflowX'] = this.props.isScrollableX ? 'auto' : 'hidden'
            rootStyle['overflowY'] = this.props.isScrollableY ? 'auto' : 'hidden'
        } else {
            rootStyle['overflow'] = this.props.isScrollable ? 'auto' : 'hidden'
        }
        rootStyle = this.props.contentStyle ? Object.assign({}, rootStyle, this.props.contentStyle) : rootStyle

        let titleContent = isTitleBar ? <div ref='title' className={themes.header}
                                             onDoubleClick={this.props.isNotDbClick?null:this._onDoubleClick}
                                             onMouseDown={this.props.isDraggable?this._onDragStart:null}>
                {
                    this.props.showBackIcon ? <i title={this.props.backIconTitle ? this.props.backIconTitle:''} className={styles.icon_back} onClick={this.props.goBack ? this.props.goBack : null}>&lt;{this.props.backTitle?this.props.backTitle:''}</i> : null
                }
                <p className={styles['title-content']} title={this.props.title}>{this.props.title}</p>
                {
                    this.props.isCloseBtn == undefined || this.props.isCloseBtn ?
                        <a href='javascript:' className={themes.closeBtn}
                           onClick={this._onCancel}
                           title={'关闭'}>
                            <i className={styles['closeBtn']} />
                        </a> : null
                }
                {this.props.getHeaderContainer ? this.props.getHeaderContainer() : null}
            </div> : null
        let dialogStyle = Object.assign({}, this.state.style, this.props.dialogStyle)
        return (
            <div className={`${!this.props.noMask ? styles['mask']: ''} ${hideStyle}`}
                 onMouseMove={this._onMouseMove}
                 style={this.props.maskStyle || {}}>
                <div ref='dialog' className={themes.dialog} style={dialogStyle} id={this.props.id}>
                    {titleContent}
                    <div ref='content'
                         id={`${this.props.id}-dialog-content`}
                         className={styles['dialog-content']}
                         style={rootStyle}>
                        {this.props.children}
                    </div>
                    {
                        this.props.isResizable ?
                            <a href='javascript:;'
                               className={styles['btn-resize']}
                               onMouseDown={this.props.isResizing?null:this._onResizeStart}
                            /> : null
                    }
                </div>
                <div className={this.state.showConfirm?styles['mask']:styles['hide']}></div>
                <div className={`${styles['dialog-comfirm-box']} ${this.state.showConfirm?styles['ani']:''}`}>
                    <div className={styles['comfirm-content']}>
                        {this.props.confirmTips}
                    </div>
                    <div className={styles['btn-box']}>
                        <div className={this.props.changeConfirmBtnColor?styles['btn-cancel']:styles['btn-confirm']} onClick={this._onConfirm}>是</div>
                        <div className={this.props.changeConfirmBtnColor?styles['btn-confirm']:styles['btn-cancel']} onClick={this._onCancelConfirm}>否</div>
                    </div>
                </div>
            </div>
        )
    }
}
/*eslint-enable */

DragDialog.propTypes = {
    id          : React.PropTypes.string.isRequired,
    title       : React.PropTypes.string,
    isTitleBar  : React.PropTypes.bool,       //是否显示标题栏
    showBackIcon: React.PropTypes.bool,       //是否显示返回箭头
    style       : React.PropTypes.object,
    height      : React.PropTypes.number,
    width       : React.PropTypes.number,
    minHeight   : React.PropTypes.number,
    minWidth    : React.PropTypes.number,
    isDraggable : React.PropTypes.bool,
    isResizable : React.PropTypes.bool,
    isNotDbClick: React.PropTypes.bool,  //禁止双击全屏
    isShow      : React.PropTypes.bool,
    isCloseConfirm : React.PropTypes.bool,
    isCloseBtn  : React.PropTypes.bool, //是否需要关闭按钮
    onCloseCb   : React.PropTypes.func,
    isShowFooter: React.PropTypes.bool, //是否需要底部
    isResizing  : React.PropTypes.bool, //是否可调整大小
    confirmTips : React.PropTypes.string, //确认提示
    handlerButtons: React.PropTypes.arrayOf({  //底部配置     //按钮类型的配置参看公共组件button
        type          : React.PropTypes.string,   //元素类型   button/text/custom
        position      : React.PropTypes.string,   //位置  left/center/right
        class         : React.PropTypes.string,   //自定义样式 通过类名传递
        rootStyle     : React.PropTypes.object,   //自定义样式 通过行内样式传递
        value         : React.PropTypes.string,   //文字内容
        customElement : React.PropTypes.node,     //自定义元素
        theme         : React.PropTypes.string,   //按钮主题名字
        size          : React.PropTypes.string,   //按钮尺寸 small/large/middle(default)
        icon          : React.PropTypes.object,   //icon className
        iconType      : React.PropTypes.string,   //icon type
        borderRadius  : React.PropTypes.number,   //按钮圆角角度disabled: PropTypes.bool, //是否禁止点击
        onClick       : React.PropTypes.func,     //点击事件函数回调
        onMouseDownCb : React.PropTypes.func,
        title         : React.PropTypes.string    //按钮title
    }),
    isFullScreen      : React.PropTypes.bool,     //初始是否显示全屏
    isScrollable      : React.PropTypes.bool,     //content是否显示滚动条
    isScrollableX     : React.PropTypes.bool,     //水平滚动条
    isScrollableY     : React.PropTypes.bool,     //垂直滚动条
    //同时存在isScrollable和isScrollableX或isScrollableY将以isScrollableX、isScrollableY为主
    contentStyle      : React.PropTypes.object,   //dialog .content自定义样式
    maskStyle         : React.PropTypes.object,   //.mask 自定义样式
    dialogStyle       : React.PropTypes.object,   //.dialog 自定义样式
    goBack            : React.PropTypes.func,     //后退
    backIconTitle     : React.PropTypes.string,   //后退标题
    backTitle         : React.PropTypes.string,   //后退标题
    children          : React.PropTypes.node,
    changeConfirmBtnColor : React.PropTypes.bool,
    isFooterTransparent: React.PropTypes.bool     //底部是否是透明背景
}
