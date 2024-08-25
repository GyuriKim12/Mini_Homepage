import React, { useEffect, useState } from 'react'
import './DiaryWriting.css'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import EmotionItem from './EmotionItem.jsx';
import { get, push, ref, remove, set, update } from 'firebase/database';
import { db } from '../../firebase.js';
const EmotionList = [
    {
        emotionId: 1, emotionName: "Very Good"
    },
    {
        emotionId: 2, emotionName: "Good"
    },
    {
        emotionId: 3, emotionName: "so so"
    },
    {
        emotionId: 4, emotionName: "bad..."
    },
    {
        emotionId: 5, emotionName: "Very bad"
    },
]

const getStringDate = (date) => {
    if (typeof date === 'string') {
        date = new Date(date)
    }
    let getYear = date.getFullYear()
    let getMonth = date.getMonth() + 1
    let getDate = date.getDate()

    if (getMonth < 10) {
        getMonth = `0${getMonth}`
    }
    if (getDate < 10) {
        getDate = `0${getDate}`
    }

    return `${getYear}-${getMonth}-${getDate}`
}

const DiaryWriting = ({ data, edit }) => {
    const nav = useNavigate()
    const { currentUser } = useSelector(state => state.user)
    const [input, setInput] = useState({
        createdDate: new Date(),
        emotionId: 2,
        content: "",
    });
    const [editPage, setEditPage] = useState(false)
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        if (data) {
            setInput({ ...data })
            setEditPage(true)
        }
    }, [data])

    useEffect(() => {
        const selectedDateString = getStringDate(selectedDate).split('T')[0];
        const diaryRef = ref(db, `diary/${currentUser.uid}`)
        get(diaryRef).then(snapshot => {
            if (snapshot.exists()) {
                const diaries = snapshot.val();
                const selectedDiary = Object.values(diaries).find(diary => diary.createdDate === selectedDateString);
                if (selectedDiary) {
                    setInput({
                        id: selectedDiary.id,
                        createdDate: new Date(selectedDiary.createdDate),
                        emotionId: selectedDiary.emotionId,
                        content: selectedDiary.content,
                    });
                    setEditPage(true);
                }
                else {
                    setInput({
                        id: "",
                        createdDate: new Date(selectedDate),
                        emotionId: 2,
                        content: "",
                    });
                    setEditPage(false);
                }
            }

        }).catch(error => console.log(error))
    }, [selectedDate])

    const onCreateInput = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        if (name === 'createdDate') {
            setInput({
                ...input,
                createdDate: new Date(value)
            })
            setSelectedDate(value)
        }
        else {
            setInput({ ...input, [name]: value })
        }
    }

    const handleSubmit = async (e) => {
        const userId = currentUser.uid;
        const diaryRef = ref(db, `diary/${userId}`)
        try {
            if (!editPage) {
                const newDiaryRef = push(diaryRef)
                const newDiary = {
                    ...input,
                    id: newDiaryRef.key,
                    createdDate: getStringDate(input.createdDate)
                }
                await set(newDiaryRef, newDiary)

            } else {
                const isConfirmed = window.confirm('정말로 수정하겠습니까?');
                if (isConfirmed) {
                    await update(ref(db, `diary/${userId}/${input.id}`), {
                        ...input,
                        createdDate: getStringDate(input.createdDate)
                    })
                }
                else {
                    return
                }
            }
            nav(-1)
        }
        catch (error) {
            alert(error);
        }
    }

    const handleDelete = async (e) => {
        const isConfirmed = window.confirm('정말로 삭제하시겠습니까?');
        const userId = currentUser.uid;
        if (isConfirmed) {
            remove(ref(db, `diary/${userId}/${input.id}`))
            nav(-1)
        }
        else {
            return
        }
    }
    return (
        <div className='DiaryWriting'>
            <div className='writing_header'>
                <button onClick={() => nav(-1)}>{"<"}</button>
                <h4>
                    <span>
                        {currentUser.displayName}
                    </span>
                    의
                    <span className='title'>
                        다이어리!
                    </span>
                    : 소중한 하루를 기록해봐 !</h4>
            </div>
            <section className={`date_`}>
                <h3>☐ 오늘의 날짜는?</h3>
                <input
                    name='createdDate'
                    value={getStringDate(input.createdDate)}
                    onChange={onCreateInput}
                    type='date' />
            </section>
            <section className='emotion_section'>
                <h3>☐ 오늘의 기분은?</h3>
                <div>
                    {EmotionList.map((item) => <EmotionItem
                        key={item.emotionId} emotionId={item.emotionId} emotionName={item.emotionName}
                        onClick={() =>
                            onCreateInput({
                                target: {
                                    name: "emotionId",
                                    value: item.emotionId,
                                }
                            })}
                        isSelected={item.emotionId === input.emotionId ? input.emotionId : ""} />)}
                </div>
            </section>
            <section className='writing_section'>
                <h3>☐ 오늘 하루는 어땠어?</h3>
                <textarea
                    name='content'
                    value={input.content || ""}
                    onChange={onCreateInput}
                    placeholder='오늘 하루는 ...' />
            </section>
            <section className='button_section'>
                <button className='submit' onClick={handleSubmit}>제출</button>
                <button className={`submit_${editPage}`} onClick={handleDelete}>삭제</button>
            </section>
        </div>
    )
}

export default DiaryWriting