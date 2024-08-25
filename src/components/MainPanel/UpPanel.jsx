import React from 'react'
import './UpPanel.css'
import { getAuth, signOut } from 'firebase/auth'
import app from '../../firebase'

const UpPanel = () => {
    const auth = getAuth(app)
    const handleLogout = () => {
        signOut(auth).then(() => {

        })
            .catch((err) => console.error(err))

    }

    return (
        <div className='UpPanel'>
            {/* <div>
                <input placeholder='Input ID' />
                <button>친구 찾기 🔎</button>
            </div> */}
            <button onClick={handleLogout}>로그아웃</button>
        </div>
    )
}

export default UpPanel