import { off, onChildAdded, ref } from 'firebase/database'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../../firebase'
import { useSelector } from 'react-redux'
import PictureItem from './PictureItem'

const PictureHome = () => {
    const { currentUser } = useSelector(state => state.user)
    const UserPictureRef = ref(db, `pictures/${currentUser.uid}`)
    const [pictures, setPictures] = useState([])

    const nav = useNavigate()
    useEffect(() => {
        addPicturesListeners();

        //컴포넌트가 unmount될 때
        return () => {
            off(UserPictureRef)
        }
    }, [])

    const addPicturesListeners = () => {
        let PicturesArray = []

        onChildAdded(UserPictureRef, DataSnapshot => {
            PicturesArray.push(DataSnapshot.val());
            const newPictures = [...PicturesArray];
            setPictures(newPictures)
        })
    }

    const sortedData = () => {
        return pictures.toSorted((a, b) => {
            return Number(new Date(b.createdDate).getTime()) - Number(new Date(a.createdDate).getTime())

        })
    }

    const sortedDate = sortedData()

    return (
        <div className='DiaryHome'>
            <div className='DiaryMiddle'>
                {/* <select>
                    <option value={"latest"}>latest</option>
                    <option value={"oldest"}>oldest</option>
                </select> */}
                <button onClick={() => nav('/newPicture')}>✏️ 게시판 작성하기</button>
            </div>

            <div className='item_wrapper'>
                {sortedDate.length > 0 &&
                    sortedDate.map(picture => (
                        <PictureItem key={picture.id} {...picture} />
                    ))}
            </div>

        </div>
    )
}

export default PictureHome