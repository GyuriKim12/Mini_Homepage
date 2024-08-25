import moment from 'moment'
import React from 'react'
import { Image } from 'react-bootstrap'
import 'moment/locale/ko';  // 한국어 로케일 임포트
import './Message.css'

moment.locale('ko');

const Message = ({ user, content, image, timestamp }) => {

    const timeFromNow = timestamp => moment(timestamp).fromNow()
    return (
        <div className='Message'>
            <Image
                src={user.image} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
            {/* <div className='userImage'>
                <Image
                    src={user.image} style={{ width: '50px', borderRadius: '50%' }} />
            </div> */}
            <div className='content'>
                <div className='content_main'>
                    {content}
                    {image && <Image src={image} style={{ width: '120px' }} />}
                </div>
                <div className='content_sub'>
                    {user.name} {" "}
                    {timeFromNow(timestamp)}

                </div>
            </div>
        </div>
    )
}

export default Message