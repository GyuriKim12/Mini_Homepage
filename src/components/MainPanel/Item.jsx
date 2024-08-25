import React from 'react'
import './Item.css'
import { useNavigate } from 'react-router-dom'

const Item = ({ title, id }) => {
    const nav = useNavigate()
    return (
        <div className='Item'>
            <div onClick={() => nav(`/picture/${id}`)} style={{ cursor: 'pointer' }}>
                ◻️ {title}

            </div>
        </div>
    )
}

export default Item