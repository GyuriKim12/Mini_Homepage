import React from 'react'
import './SidePanel.css'
import { useNavigate } from 'react-router-dom'

const SidePanel = () => {
    const nav = useNavigate();
    return (
        //어떤 것이 눌렸는지에 따라 다르게 행동되어야함

        <div className='SidePanel'>
            <button className='SideButton' onClick={() => nav('/')} >
                홈
            </button>
            <button className='SideButton' onClick={() => nav('/diary')}>
                다이어리
            </button>
            <button className='SideButton' onClick={() => nav('/picture')}>
                게시판
            </button>
            <button className='SideButton' onClick={() => nav('/message')}>
                메세지
            </button>
        </div>
    )
}

export default SidePanel