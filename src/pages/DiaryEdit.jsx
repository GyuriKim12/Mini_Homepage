import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import DiaryWriting from '../components/DiaryPage/DiaryWriting'
import { child, get, ref } from 'firebase/database'
import { db } from '../firebase'

const DiaryEdit = () => {
    const { id } = useParams()
    const { currentUser } = useSelector(state => state.user)
    const [data, setData] = useState([])
    useEffect(() => {
        const diaryRef = child(ref(db, `diary/${currentUser.uid}`), id)
        get(diaryRef).then(snapshot => {
            if (snapshot.exists()) {
                setData(snapshot.val())
            }
            else {
                console.log("No data available");

            }
        }).catch(error => { console.log(error) })
    }, [id])
    return (
        <div>
            {data ? <DiaryWriting data={data} edit={true} /> : <p>Loading...</p>}

        </div>
    )
}

export default DiaryEdit