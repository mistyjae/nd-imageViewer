/*
 测试 picList, imgAmplify, imagePopup
 */
require('console-polyfill')
import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
// ES6
import PicList from './imgComponent/picList/picList'
import ImgAmplify from './imgComponent/imgAmplify/imgAmplify.js'
import ImagePopup from './imgComponent/imagePopup.js'

let data = [ { 'thumbnail':'http://betacs.101.com/v0.1/download?dentryId=3183c9d3-f7ca-427a-9deb-6741eb1a9a2f&size=80&ext=jpg','tabulate':'http://betacs.101.com/v0.1/download?dentryId=3183c9d3-f7ca-427a-9deb-6741eb1a9a2f&size=320&ext=jpg','expand':'http://betacs.101.com/v0.1/download?dentryId=3183c9d3-f7ca-427a-9deb-6741eb1a9a2f&size=960','original':'http://betacs.101.com/v0.1/download?dentryId=3183c9d3-f7ca-427a-9deb-6741eb1a9a2f','unfold':'http://betacs.101.com/v0.1/download?dentryId=3183c9d3-f7ca-427a-9deb-6741eb1a9a2f&size=640' } ,
    { 'thumbnail':'http://betacs.101.com/v0.1/download?dentryId=9d9ef7c8-3885-422b-9dae-354789fab2e8&size=80','tabulate':'http://betacs.101.com/v0.1/download?dentryId=9d9ef7c8-3885-422b-9dae-354789fab2e8&size=320','expand':'http://betacs.101.com/v0.1/download?dentryId=9d9ef7c8-3885-422b-9dae-354789fab2e8&size=960','original':'http://betacs.101.com/v0.1/download?dentryId=9d9ef7c8-3885-422b-9dae-354789fab2e8','unfold':'http://betacs.101.com/v0.1/download?dentryId=9d9ef7c8-3885-422b-9dae-354789fab2e8&size=640' } ,
    { 'thumbnail':'http://betacs.101.com/v0.1/download?dentryId=4c9d32b2-5a8a-4220-bd5c-bc518ccff78e&size=80','tabulate':'http://betacs.101.com/v0.1/download?dentryId=4c9d32b2-5a8a-4220-bd5c-bc518ccff78e&size=240','expand':'http://betacs.101.com/v0.1/download?dentryId=4c9d32b2-5a8a-4220-bd5c-bc518ccff78e&size=960','original':'http://betacs.101.com/v0.1/download?dentryId=4c9d32b2-5a8a-4220-bd5c-bc518ccff78e','unfold':'http://betacs.101.com/v0.1/download?dentryId=4c9d32b2-5a8a-4220-bd5c-bc518ccff78e&size=640' } ,
    { 'thumbnail':'http://betacs.101.com/v0.1/download?dentryId=f12cf9ad-273f-437e-88df-002b3ab799c8&size=80','tabulate':'http://betacs.101.com/v0.1/download?dentryId=f12cf9ad-273f-437e-88df-002b3ab799c8&size=240','expand':'http://betacs.101.com/v0.1/download?dentryId=f12cf9ad-273f-437e-88df-002b3ab799c8&size=960','original':'http://betacs.101.com/v0.1/download?dentryId=f12cf9ad-273f-437e-88df-002b3ab799c8','unfold':'http://betacs.101.com/v0.1/download?dentryId=f12cf9ad-273f-437e-88df-002b3ab799c8&size=640' } ,
    { 'thumbnail':'http://betacs.101.com/v0.1/download?dentryId=8b82abb7-c356-433b-9f59-9a99fec1e5cb&size=80','tabulate':'http://betacs.101.com/v0.1/download?dentryId=8b82abb7-c356-433b-9f59-9a99fec1e5cb&size=240','expand':'http://betacs.101.com/v0.1/download?dentryId=8b82abb7-c356-433b-9f59-9a99fec1e5cb&size=960','original':'http://betacs.101.com/v0.1/download?dentryId=8b82abb7-c356-433b-9f59-9a99fec1e5cb','unfold':'http://betacs.101.com/v0.1/download?dentryId=8b82abb7-c356-433b-9f59-9a99fec1e5cb&size=640' }
]

//render(<ImagePopup index={1} show={true} hidePopup={() => 1} data={data}/>,
//    document.getElementById('root') )

//render(
//    <ImgAmplify index={1} show={true}
//                data={data}
//                setPic={() => 1}
//                showImgList={()=> 1}
//                showPopup={()=> 1}/>,
//    document.getElementById('root'))

render(
    <PicList show={true} showImgBox={()=> console.log('showing img box') } data={data}/>,
    document.getElementById('root')
)
