import React, { PropTypes } from 'react'
import styles from '../../../styles/imageSlider.css'
import utils from 'nd-utils'
import MyCarousel from './carousel/mycarousel'
import SubCarousel from './carousel/subcarousel'
let { bind } = utils.bindUtil


export default React.createClass({
    displayName: 'ImageSlider',

    propTypes: {
        index: PropTypes.number.isRequired,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        data: PropTypes.arrayOf(
            PropTypes.shape({
                title: PropTypes.string,
                file_property: PropTypes.object,
                picUrl: PropTypes.string
            })
        ),
        checkedItems: PropTypes.array,
        selectMode: PropTypes.bool,
        previewMode: PropTypes.bool,
        checkPicItem: PropTypes.func
    },

    getInitialState() {
        return {
            index: this.props.index,
            scale: 1,
            translateX: -50,
            translateY: -50,
            translateStartX: -50,
            translateStartY: -50
        }
    },

    componentWillMount() {
        this._checkPicItem = bind(this.checkPicItem, this)
        this._changeImg = bind(this.changeImg, this)
        this._getCurrentIndex = bind(this.getCurrentIndex, this)
        this._onWheelEvent = bind(this.onWheelEvent, this)
        this._onMouseDown = bind(this.onMouseDown, this)
        this.dragData = { isDown: false }
    },
    /*eslint-disable*/
    componentWillReceiveProps(nextProps) {
        if (nextProps.index !== this.props.index) {
            this.setState({
                index: nextProps.index
            })
            this.goToSlide(nextProps.index)
        }
    },
    /*eslint-enable*/
    componentDidMount() {
        this.loadImage(this.state.index)
        this.goToSlide(this.state.index)
    },

    goToSlide(index) {
        this.refs.carousel.goToSlide(index)
    },
    /*eslint-disable */
    loadImage(index) {
        this.resetImg()
        if (index != this.state.index) {
            this.setState({index: index})
        }
    },

    changeImg(index) {
        this.refs.carousel.goToSlide(index)
        this.resetImg()
        if (index != this.state.index) {
            this.setState({index: index})
        }
    },

    getCurrentIndex(key, index) {
        if (key == 'imagePopup') {
            let page = parseInt(index / 5)
            this.refs.carouselThumb.goToSlide(page * 5)
            if (index != this.state.index) {
                this.setState({index: index})
                this.props.gotoIndexCb(index)
            }
        }
    },
    /*eslint-enable */

    checkPicItem(index) {
        if (this.props.checkPicItem) {
            this.props.checkPicItem(index)
        }
    },
    resetImg() {
        /*eslint-disable*/
        this.setState({
            scale: 1,
            translateX: -50,
            translateY: -50,
            translateStartX: -50,
            translateStartY: -50
        })
        /*eslint-enable*/
    },
    onWheelEvent(ev) {
        let newScale = ev.deltaY > 0 ? this.state.scale - 0.1 : this.state.scale + 0.1
        if (newScale < 1) newScale = 1
        if (newScale > 5) newScale = 5
        // 缩小时，translate还原，避免缩到角落去了╮(╯▽╰)╭
        if (ev.deltaY > 0) {
            /*eslint-disable*/
            this.setState({
                translateX: -50,
                translateY: -50,
                translateStartX: -50,
                translateStartY: -50
            })
        }
        this.setState({
            scale: newScale
        })
        /*eslint-enable*/
    },
    onMouseDown(ev) {
        ev.preventDefault()
        this.dragData = { isDown: true, clientX: ev.clientX, clientY: ev.clientY }
        document.onmousemove = (ev) => this.onMouseMove(ev)
        document.onmouseup = (ev) => this.onMouseUp(ev)
        document.onmouseout = (ev) => this.onMouseUp(ev)
    },
    onMouseMove(ev) {
        ev.preventDefault()
        let { isDown, clientX, clientY } = this.dragData
        if (!isDown) {
            return
        }
        let width = ev.target.offsetWidth, height = ev.target.offsetHeight
        //没有超出容器大小，不用拖动
        let disX = width * this.state.scale >= this.props.width ? ev.clientX - clientX : 0
        let disY = height * this.state.scale >= this.props.height * 0.8 ? ev.clientY - clientY : 0
        if (disX === 0 && disY === 0) {
            // 避免拖动到角落缩到原始大小之后拖不回来
            if(this.state.translateX!==-50||this.state.translateY!==-50) {
                /*eslint-disable*/
                this.setState({
                    translateX: -50,
                    translateY: -50
                })
                /*eslint-enable*/
            }
            return
        }

        //移动的区间
        let translateX = this.state.translateStartX + disX / ev.target.offsetWidth * this.state.scale * 100
        let translateY = this.state.translateStartY + disY / ev.target.offsetHeight * this.state.scale * 100

        let translateData = this.edgeDetection(width,height,translateX, translateY,disX,disY)
        /*eslint-disable*/
        this.setState({
            translateX: translateData.x,
            translateY: translateData.y
        })
    },
    onMouseUp(){
        this.dragData.isDown = false
        this.setState({
            translateStartX: this.state.translateX,
            translateStartY: this.state.translateY
        });
        document.onmousemove = null
        document.onmouseup = null
    },
    /*eslint-enable*/
    /**
     * 边界控制
     * @param width
     * @param height
     * @param translateX
     * @param translateY
     * @returns {{x: *, y: *}}
     */
    edgeDetection(width,height,translateX, translateY,disX,disY) {
        let scale = this.state.scale
        let w = (1 - width / this.props.width) * 100
        let h = (1 - height / (this.props.height*0.8)) * 100
        let sideData = {
            left: -50 * scale + w,
            right: 50 * (scale - 2) - w,
            top: -50 * scale + h,
            bottom: 50 * (scale - 2) - h
        }

        let translateData = { x: translateX, y: translateY }
        // 避免校正之后的抖动问题
        if(disX!==0) {
            translateData.x = translateData.x < sideData.left ? sideData.left : translateData.x
            translateData.x = translateData.x > sideData.right ? sideData.right : translateData.x
        }
        if(disY!==0) {
            translateData.y = translateData.y < sideData.top ? sideData.top : translateData.y
            translateData.y = translateData.y > sideData.bottom ? sideData.bottom : translateData.y
        }
        return translateData
    },
    render() {
        let imgStyle = {
            maxWidth: this.props.width * 1 + 'px',
            maxHeight: this.props.height * 0.85 + 'px',
            transform: `translate(${this.state.translateX}%,${this.state.translateY}%) scale(${this.state.scale})`
        }
        let imgWrapStyle = {
            width: this.props.width * 1 + 'px',
            height: this.props.height * 0.85 + 'px',
            position: 'relative',
            overflow: 'hidden'
        }
        let data = this.props.data ? this.props.data.map((data, index) => {
            let slideKey = `slide-${index}`
            let titleInfo = (<div className={styles.img_title}>
                {data.title ? data.title : ''}
            </div>)
            
            let checked = this.props.checkedItems ? (this.props.checkedItems[index] ? 'checked' : null) : null
            return (
                <div key={slideKey} className={styles.big_item}>
                    {titleInfo}
                    {
                        this.props.selectMode ? (<div className={styles.reuse_container}>
                            <input onClick={this._checkPicItem.bindArgs(index)} checked={checked} type='checkbox'
                                   className={styles.checkbox}/>
                            <span onClick={this._checkPicItem.bindArgs(index)}
                                  className={styles.reuse_text}>复用该资源</span>
                        </div>) : null
                    }
                    <div className={styles['big-item-cell']}>
                        <div style={imgWrapStyle}>
                            <img src={data.originalUrl} alt='' onWheel={this._onWheelEvent}
                                 onDoubleClick={this.resetImg}
                                 onMouseDown={this._onMouseDown} style={imgStyle}/>
                        </div>
                    </div>
                </div>
            )
        }) : []

        let icons = this.props.data ? this.props.data.map((data, index) => {
            return (
                <div key={`thumb-${index}`} className={styles['small-item']} style={{
                    width: this.props.height * 0.15,
                    height: this.props.height * 0.15
                }}>
                    <a onClick={this._changeImg.bindArgs(index)}
                       className={this.state.index == index ? styles.active : ''}>
                        <img src={data.picUrl} title={data.title}/>
                    </a>
                </div>
            )
        }) : []
        return (
            <div className={styles.desktop}>
                <MyCarousel ref='carousel'
                            cellAlign='center'
                            height={(this.props.height).toString()}
                            slideWidth={1}
                            picList={data}
                            loadImage={this.loadImage}
                            arrow
                            indexCb={this._getCurrentIndex.bindArgs('imagePopup')}>
                </MyCarousel>
                <SubCarousel ref='carouselThumb'
                             slidesToShow={5}
                             slidesToScroll={5}
                             picList={icons}
                             cellAlign='center'
                             height={this.props.height * 0.15}
                             width='840'
                             framePadding='10'
                             slideWidth={1}
                             arrow>
                </SubCarousel>
            </div>
        )
    }
})
