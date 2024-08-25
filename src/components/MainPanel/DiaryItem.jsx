import React from 'react'
import { useNavigate } from 'react-router-dom'

const DiaryItem = ({ id, createdDate }) => {
    const nav = useNavigate()
    return (
        <div className='Item'>
            <div onClick={() => nav(`/diary/${id}`)} style={{ cursor: 'pointer' }}>
                ◻️ {createdDate}

            </div>
        </div>
    )
}

export default DiaryItem