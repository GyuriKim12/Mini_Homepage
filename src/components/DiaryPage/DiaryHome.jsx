import React, { useState } from 'react'
import './DiaryHome.css'
import DiaryList from './DiaryList'
import { useNavigate } from 'react-router-dom'
import DiaryWriting from './DiaryWriting'
import { useSelector } from 'react-redux'
import { off, onChildAdded, ref } from 'firebase/database'
import { db } from '../../firebase'

const DiaryHome = () => {
    const nav = useNavigate();
    const { currentUser } = useSelector(state => state.user)
    const diaryRef = ref(db, `diary/${currentUser.uid}`)
    const [diary, setDiary] = useState([])
    const [state, setState] = useState("latest")

    const onChangeState = (e) => {
        setState(e.target.value)
    }

    const addDiaryEventListener = () => {
        let diaryArray = []
        onChildAdded(diaryRef, DataSnapshot => {
            diaryArray.push(DataSnapshot.val())
            const newDairy = [...diaryArray]
            setDiary(newDairy)
        })
    }


    useState(() => {
        addDiaryEventListener();

        return () => {
            off(diaryRef)
        }
    }, [])

    const sortedData = () => {
        return diary.toSorted((a, b) => {
            if (state === 'oldest') {
                return Number(new Date(a.createdDate).getTime()) - Number(new Date(b.createdDate).getTime())

            }
            else {
                return Number(new Date(b.createdDate).getTime()) - Number(new Date(a.createdDate).getTime())

            }
        })
    }

    const sortedDate = sortedData()

    return (
        <div className='DiaryHome'>
            <div className='DiaryMiddle'>
                <select onClick={onChangeState}>
                    <option value={"latest"}>latest</option>
                    <option value={"oldest"}>oldest</option>
                </select>
                <button onClick={() => nav('/newDiary')}>✏️ 일기 작성하기</button>
            </div>
            <div>
                {sortedDate.map((item) => <DiaryList key={item.id}
                    {...item} />)}
            </div>
        </div>
    )
}

export default DiaryHome