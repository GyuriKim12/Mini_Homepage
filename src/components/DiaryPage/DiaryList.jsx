import React from 'react'
import { Image } from 'react-bootstrap'
import { getEmotionImage } from '../../utils/get-emotion'
import './DiaryList.css'
import { useNavigate } from 'react-router-dom'


const DiaryList = ({ id, createdDate, emotionId, content }) => {
    const nav = useNavigate()
    return (
        <div className='DiaryList' onClick={() => nav(`/diary/${id}`)}>
            <div><Image style={{ width: '120px', borderRadius: '5px' }} src={getEmotionImage(emotionId)} /></div>
            <div className='diary_sen'>
                <div>
                    {createdDate}

                </div>
                <div style={{ width: '70%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                    {content}

                </div>
            </div>

        </div>
    )
}

export default DiaryList