import React from 'react'
import { useNavigate } from 'react-router-dom'


export const Home = () => {
    const nav = useNavigate();
    return (
        <div>
            <button className='SideButton' onClick={() => nav('/')}>
                Home
            </button>
        </div>
    )
}

export default Home