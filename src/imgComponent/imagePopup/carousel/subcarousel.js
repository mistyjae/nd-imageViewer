'use strict'

import React from 'react'
import decorators from './decorators'
import assign from 'object-assign'

const SubCarousel = React.createClass({
    displayName: 'SubCarousel',

    getInitialState() {
        return {
            currentSlide: 0,
            frameWidth: 0,
            left: 0,
            top: 0,
            slideCount: this.props.picList.length,
            slideWidth: 0,
            slidesToScroll: this.props.slidesToScroll
        }
    },

    propTypes: {
        cellAlign: React.PropTypes.oneOf([ 'left', 'center', 'right' ]),
        cellSpacing: React.PropTypes.number,
        data: React.PropTypes.func,
        decorators: React.PropTypes.array,
        dragging: React.PropTypes.bool,
        easing: React.PropTypes.string,
        edgeEasing: React.PropTypes.string,
        framePadding: React.PropTypes.string,
        initialSlideHeight: React.PropTypes.number,
        initialSlideWidth: React.PropTypes.number,
        slidesToShow: React.PropTypes.number,
        slidesToScroll: React.PropTypes.oneOfType([
            React.PropTypes.number,
            React.PropTypes.oneOf([ 'auto' ])
        ]),
        slideWidth: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number
        ]),
        speed: React.PropTypes.number,
        vertical: React.PropTypes.bool,
        width: React.PropTypes.string,
        height: React.PropTypes.string,
        picList: React.PropTypes.array,
        indexCb: React.PropTypes.func
    },
    getDefaultProps() {
        return {
            cellAlign: 'left',
            cellSpacing: 0,
            data: function () {
            },
            decorators: decorators,
            dragging: true,
            easing: 'easeOutCirc',
            edgeEasing: 'easeOutElastic',
            framePadding: '0px',
            slidesToShow: 1,
            slidesToScroll: 1,
            slideWidth: 1,
            speed: 500,
            vertical: false,
            width: '100%',
            height: '100%'
        }
    },

    componentWillMount() {

    },

    componentDidMount() {

    },

    componentWillReceiveProps(nextProps) {
        if(nextProps.picList !== this.props.picList) {
            this.setState({
                slideCount: nextProps.picList.length
            })
        }
    },

    getButtonStyles(disabled) {
        return {
            border: 0,
            background: '#4d4d4d',
            color: '#ffffff',
            opacity: disabled ? .25 : 1,
            outline: 0,
            cursor: 'pointer',
            width: 30,
            height: this.props.height,
            lingHeight: this.props.height,
            margin: '0 12px',
            textAlign: 'center'
        }
    },


    render() {
        let self = this
        let hide = {
            display: 'none'
        }
        let show = {
            height: this.props.height + 'px',
            float: 'left'
        }
        let pageStart = parseInt(this.state.currentSlide / this.props.slidesToShow) * this.props.slidesToShow
        let pageEnd = pageStart + this.props.slidesToShow - 1
        let icons = this.props.picList.map((data, index) => {
            return (
                <div key={`sub_${index}`} style={{ display: 'inline-block', height: this.props.height }}>
                    <div style={(index>=pageStart && index<=pageEnd)?show :hide}>{data}</div>
                </div>
            )
        })
        return (
            <div ref='slider' style={{ position: 'relative', margin: '0 auto', width: 'auto', textAlign: 'center' }}>
                {icons}
                {this.props.decorators.map((Decorator, index) => {
                    return (
                        <div
                            style={assign(self.getDecoratorStyles(Decorator.position), Decorator.style || {})}
                            className={'slider-decorator-' + index}
                            key={index}>
                            <Decorator.component
                                dot={false}
                                getButtonStyles={self.getButtonStyles}
                                currentSlide={self.state.currentSlide}
                                slideCount={self.state.slideCount}
                                frameWidth={self.state.frameWidth}
                                slideWidth={self.state.slideWidth}
                                slidesToScroll={self.props.slidesToScroll}
                                cellSpacing={self.props.cellSpacing}
                                slidesToShow={self.props.slidesToShow}
                                nextSlide={self.nextSlide}
                                previousSlide={self.previousSlide}
                                goToSlide={self.goToSlide}/>
                        </div>
                    )
                })}
            </div>
        )
    },
    // Action Methods

    goToSlide(index) {
        if (this.props.indexCb) {
            this.props.indexCb(index)
        }
        this.setState({currentSlide: index}) //eslint-disable-line
    },

    nextSlide() {
        if ((this.state.currentSlide + this.props.slidesToShow) >= this.state.slideCount) {
            return
        }
        this.goToSlide(this.state.currentSlide + this.props.slidesToShow)
    },

    previousSlide() {
        if (this.state.currentSlide <= 0) {
            return
        }
        this.goToSlide(this.state.currentSlide - this.props.slidesToShow)
    },

    getDecoratorStyles(position) {
        switch (position) {
        case 'TopLeft':
            {
                return {
                    position: 'absolute',
                    top: 0,
                    left: 0
                }
            }
        case 'TopCenter':
            {
                return {
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    WebkitTransform: 'translateX(-50%)'
                }
            }
        case 'TopRight':
            {
                return {
                    position: 'absolute',
                    top: 0,
                    right: 0
                }
            }
        case 'CenterLeft':
            {
                return {
                    position: 'absolute',
                    top: '50%',
                    left: 0,
                    transform: 'translate(-100%, -50%)',
                    WebkitTransform: 'translateY(-100%, -50%)'
                }
            }
        case 'CenterCenter':
            {
                return {
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%,-50%)',
                    WebkitTransform: 'translate(-50%, -50%)'
                }
            }
        case 'CenterRight':
            {
                return {
                    position: 'absolute',
                    top: '50%',
                    right: 0,
                    transform: 'translate(-100%, -50%)',
                    WebkitTransform: 'translate(100%, -50%)'
                }
            }
        case 'BottomLeft':
            {
                return {
                    position: 'absolute',
                    bottom: 0,
                    left: 0
                }
            }
        case 'BottomCenter':
            {
                return {
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    WebkitTransform: 'translateX(-50%)'
                }
            }
        case 'BottomRight':
            {
                return {
                    position: 'absolute',
                    bottom: 0,
                    right: 0
                }
            }
        default:
            {
                return {
                    position: 'absolute',
                    top: 0,
                    left: 0
                }
            }
        }
    }


})

export default SubCarousel
