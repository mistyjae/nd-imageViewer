'use strict'

import React from 'react'
import decorators from './decorators'
import assign from 'object-assign'


const MyCarousel = React.createClass({
    displayName: 'MyCarousel',

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
        indexCb: React.PropTypes.func,
        loadImage: React.PropTypes.func
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


    render() {
        let self = this
        let hide = {
            opacity: '0',
            /*transition: 'opacity 0.6s linear',*/
            visibility: 'hidden',
            height: '0'
        }
        let show = {
            opacity: '1',
            height: this.props.height + 'px',
            visibility: 'visible'/*,
            transition: 'opacity 0.6s linear'*/
        }

        let icons = this.props.picList.map((data, index) => {
            return (
                <div key={`slider-img-${index}`}>
                    <div style={index==this.state.currentSlide?show :hide}>{data}</div>
                </div>
            )
        })
        return (
            <div ref='slider' style={{ height: '85%' }}>
                {icons}
                {this.props.decorators.map((Decorator, index) => {
                    return (
                        <div
                            style={assign(self.getDecoratorStyles(Decorator.position), Decorator.style || {})}
                            className={'slider-decorator-' + index}
                            key={index}>
                            <Decorator.component
                                dot={false}
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
        if (typeof this.props.loadImage === 'function') {
            this.props.loadImage(index)
        }
        this.setState({currentSlide: index}) //eslint-disable-line
    },

    nextSlide() {
        if ((this.state.currentSlide + this.props.slidesToScroll) >= this.state.slideCount) {
            return
        }
        this.goToSlide(this.state.currentSlide + this.props.slidesToScroll)
    },

    previousSlide() {
        if (this.state.currentSlide <= 0) {
            return
        }
        this.goToSlide(this.state.currentSlide - this.props.slidesToScroll)
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
                    left: 40,
                    transform: 'translateY(-50%)',
                    WebkitTransform: 'translateY(-50%)'
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
                    right: 40,
                    transform: 'translateY(-50%)',
                    WebkitTransform: 'translateY(-50%)'
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

export default MyCarousel

