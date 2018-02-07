/**
 * Created by xlm on 2016/6/12.
 */
import React, { PropTypes } from 'react'
import styles from '../../../styles/imagePopup.css'
import ImageSlider from './imageSlider.js'
import DragDialog from '../draggableDialog/index'

export default React.createClass({
    displayName: 'ImagePopup',
    propTypes: {
        data: PropTypes.arrayOf(
            PropTypes.shape({
                title: PropTypes.string,
                file_property: PropTypes.object,
                picUrl: PropTypes.string
            })
        ),
        checkedItems: PropTypes.array,
        checkPicItem: PropTypes.func,
        selectMode: PropTypes.string,
        previewMode: PropTypes.bool,
        zIndex: PropTypes.number   
    },
    getInitialState() {
        return {
            index: 0,
            height: window.innerHeight*0.76,
            width: window.innerWidth*0.75,
            show: false
        }
    },
    componentDidMount() {
        window.addEventListener('resize', this.handleResize)
    },
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize)
    },
    //调整浏览器窗口大小时触发render
    /*eslint-disable */
    handleResize() {
        this.setState({
            height: window.innerHeight*0.76,
            width: window.innerWidth*0.75
        })
    },
    show(index) {
        this.setState({
            index: index,
            show: true
        })
    },
    hide() {
        this.setState({
            show: false
        })
    },
    /*eslint-enable */
    render() {
        //contentStyle是.dialog_container的style
        const containerStyle = {
            height: '100%',
            overflow: 'visible'
        }
        const dialogStyle = {
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            borderRadius: '0',
            backgroundColor: 'rgba(0, 0, 0, .75)'
        }
        let { 
            zIndex = 9999, 
            data = [],
            checkedItems,
            checkPicItem,
            selectMode,
            previewMode
        } = this.props
        return(
            <DragDialog id='imagePopup'
                        ref='imagePopup'
                        isTitleBar={false}
                        isFullScreen
                        contentStyle={containerStyle}
                        dialogStyle={dialogStyle}
                        maskStyle={{ zIndex }}
                        isDraggable
                        onCloseCb={this.hide}
                        isShow={this.state.show}>
                <span title={'关闭'}
                      className={styles.closeBtn}
                      onClick={this.hide}>
                    <i className={styles.closeIcon}/>
                </span>
                <ImageSlider ref='imageSlider' data={data}
                             checkedItems={checkedItems}
                             checkPicItem={checkPicItem}
                             index={this.state.index}
                             gotoIndexCb={this.show}
                             height={this.state.height}
                             width={this.state.width}
                             selectMode={selectMode}
                             previewMode={previewMode}/>
            </DragDialog>
        )
    }
})
