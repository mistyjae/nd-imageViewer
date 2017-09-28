'use strict'

import React from 'react'
import styles from '../../../../styles/imageSlider.css'

/*eslint-disable*/
const DefaultDecorators = [
    {
        component: React.createClass({
            render() {
                return (
                  <button style={this.getButtonStyles(this.props.currentSlide === 0)}
                          onClick={this.props.previousSlide}>
                      <i className={styles['prev']} />
                  </button>
                )
            },
            getButtonStyles(disabled) {
                if(this.props.getButtonStyles) {
                    return this.props.getButtonStyles(disabled)
                } else {
                    return {
                        border: 0,
                        background: disabled ? 'rgba(114, 114, 114, .5)' : 'rgba(255, 255, 255, .92)',
                        color: disabled ? '#ffffff' : '#5faef4',
                        outline: 0,
                        // opacity: disabled ? 0.3 : 1, // 策划要求箭头不可用时直接隐藏
                        // visibility:disabled?'hidden':'visible',
                        cursor: 'pointer',
                        width: 83,
                        height: 83,
                        lingHeight: 83,
                        borderRadius: 83,
                        fontSize: '40px',
                        textAlign: 'center'
                    }
                }
            }
        }),
        position: 'CenterLeft'
    },
    {
        component: React.createClass({
            render() {
                return (
                  <button style={this.getButtonStyles(this.props.currentSlide + this.props.slidesToScroll >= this.props.slideCount)}
                          onClick={this.props.nextSlide}>
                      <i className={styles['next']} />
                  </button>
                )
            },
            getButtonStyles(disabled) {
                if(this.props.getButtonStyles) {
                    return this.props.getButtonStyles(disabled)
                } else {
                    return {
                        border: 0,
                        background: disabled ? 'rgba(114, 114, 114, .5)' : 'rgba(255, 255, 255, .92)',
                        color: disabled ? '#ffffff' : '#5faef4',
                        outline: 0,
                        // opacity: disabled ? 0.3 : 1, // 策划要求箭头不可用时直接隐藏
                        // visibility:disabled?'hidden':'visible',
                        cursor: 'pointer',
                        width: 83,
                        height: 83,
                        lingHeight: 83,
                        borderRadius: 83,
                        fontSize: '40px',
                        textAlign: 'center'
                    }
                }
            }
        }),
        position: 'CenterRight'
    },
    {
        component: React.createClass({
            render() {
                let self = this
                let indexes = this.getIndexes(self.props.slideCount, self.props.slidesToScroll)
                let content = this.props.dot&&!this.props.dot?
                    <ul style={self.getListStyles()}>
                        {
                            indexes.map(function (index) {
                                return (
                                    <li style={self.getListItemStyles()} key={index}>
                                        <button
                                            style={self.getButtonStyles(self.props.currentSlide === index)}
                                            onClick={self.props.goToSlide.bind(null, index)}>
                                            &bull;
                                        </button>
                                    </li>
                                )
                            })
                        }
                    </ul>:null
                return content
            },
            getIndexes(count, inc) {
                let arr = []
                for (let i = 0; i < count; i += inc) {
                    arr.push(i)
                }
                return arr
            },
            getListStyles() {
                return {
                    position: 'relative',
                    margin: 0,
                    top: -10,
                    padding: 0
                }
            },
            getListItemStyles() {
                return {
                    listStyleType: 'none',
                    display: 'inline-block'
                }
            },
            getButtonStyles(active) {
                return {
                    border: 0,
                    background: 'transparent',
                    color: 'black',
                    cursor: 'pointer',
                    padding: 10,
                    outline: 0,
                    fontSize: 24,
                    opacity: active ? 1 : 0.5
                }
            }
        }),
        position: 'BottomCenter'
    }
]

export default DefaultDecorators
/*eslint-enable*/
