import React from 'react'
import './MainHome.css'
import MainImage from './MainImage'
import PictureList from './PictureList'

const MainHome = () => {
    return (
        <div className='MainHome' style={{
            display: 'flex', flexDirection: 'column', gap: '10px',
            height: '80vh'
        }}>

            <section style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
                <section style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                    <section style={{ flex: 1, boxSizing: 'border-box' }}>
                        <MainImage />
                    </section>
                    <section style={{ flex: 1, boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
                        <section style={{ flex: 1, boxSizing: 'border-box' }}>
                            <PictureList />
                        </section>
                    </section>
                </section>
            </section>
        </div>
    )
}

export default MainHome