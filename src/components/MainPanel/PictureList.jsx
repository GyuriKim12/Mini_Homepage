import React, { useEffect, useState } from 'react'
import './PictureList.css'
import { useSelector } from 'react-redux'
import { off, onChildAdded, ref } from 'firebase/database'
import { db } from '../../firebase'
import Item from './Item'
import { LiaEtsy } from 'react-icons/lia'
import DiaryItem from './DiaryItem'

const PictureList = () => {
    const { currentUser } = useSelector(state => state.user)
    const UserPictureRef = ref(db, `pictures/${currentUser.uid}`)
    const UserDiaryRef = ref(db, `diary/${currentUser.uid}`)

    const [pictures, setPictures] = useState([])
    const [diary, setDiary] = useState([])

    useEffect(() => {
        addPicturesListeners();

        //컴포넌트가 unmount될 때
        return () => {
            off(UserPictureRef)
        }
    }, [])

    useEffect(() => {
        addDiaryListeners()
        //컴포넌트가 unmount될 때
        return () => {
            off(UserDiaryRef)
        }
    }, [])

    const sortedData = (data) => {
        return data.toSorted((a, b) => {
            return Number(new Date(b.createdDate).getTime()) - Number(new Date(a.createdDate).getTime())

        })
    }

    const addPicturesListeners = () => {
        let PicturesArray = []
        onChildAdded(UserPictureRef, DataSnapshot => {
            PicturesArray.push(DataSnapshot.val());
            //상위 10개만 항상 보여지게 하기
            let sortedPicture = sortedData(PicturesArray)
            if (sortedPicture.length > 10) {
                sortedPicture = sortedPicture.slice(-10); // 마지막 10개 항목만 유지
            }
            setPictures([...sortedPicture]);
        })
    }

    const addDiaryListeners = () => {
        let DiaryArray = []
        onChildAdded(UserDiaryRef, DataSnapshot => {
            DiaryArray.push(DataSnapshot.val());
            //상위 10개만 항상 보여지게 하기
            console.log(DiaryArray)
            let sortedDiary = sortedData(DiaryArray)
            if (sortedDiary.length > 10) {
                sortedDiary = sortedDiary.slice(-10); // 마지막 10개 항목만 유지
            }
            console.log(sortedDiary)
            setDiary([...sortedDiary]);
        })
    }


    return (
        <div className='PictureList'>
            <div className='Picturetitle'>
                <h4>다이어리</h4>
                <h4>게시판</h4>
            </div>
            <div className='section'>
                <div className='diarySection'>
                    {diary.map(item => <DiaryItem key={item.id} id={item.id} createdDate={item.createdDate} />)}

                </div>
                <div className='pictureSection'>
                    {pictures.map(picture => <Item key={picture.id} title={picture.title} id={picture.id} />)}
                </div>
            </div>


        </div>
    )
}

export default PictureList