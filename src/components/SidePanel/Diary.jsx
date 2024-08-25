import React from 'react'
import { useNavigate } from 'react-router-dom'


const Diary = () => {
    const nav = useNavigate();
    return (
        <div>
            <button className='SideButton'>
                Diary
            </button>
        </div>
    )
}

export default Diary