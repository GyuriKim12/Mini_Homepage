import React from 'react'
import './PictureItem.css'
import { useNavigate } from 'react-router-dom'

const PictureItem = ({ content, title, photoURL, id, createdDate }) => {
    const nav = useNavigate()
    return (
        <div className='PicutureItem' onClick={() => nav(`/picture/${id}`)}>
            <div className='img_section'>
                <img src={photoURL} />
            </div>
        </div>
    )
}

export default PictureItem