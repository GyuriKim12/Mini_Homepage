import React, { useEffect, useState } from 'react'
import { Image } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setCurrentChatRoom } from '../../store/ChatRoomSlice'

const MessageList = ({ id, name, createdBy, participant }) => {
    const { currentUser } = useSelector(state => state.user)
    const [data, setData] = useState([])
    const nav = useNavigate()

    const dispatch = useDispatch()
    const onClick = () => {
        dispatch(setCurrentChatRoom({
            id: id,
            name: name,
            createdBy: createdBy,
            participant: participant
        }))
        nav(`/message/${id}`)
    }
    useEffect(() => {
        //내가 만든 사람일 때
        if (createdBy.id === currentUser.uid) {
            setData(participant)
        }
        //내가 만든 사람이 아닐 때
        else {
            setData(createdBy)
        }
    })
    return (
        <div className='DiaryList' style={{ cursor: 'pointer' }} onClick={onClick}>
            <div><Image style={{ width: '100px', borderRadius: '5px' }} src={data.image} /></div>
            <div className='diary_sen'>
                {name}
                {/* 가장 최근 대화 하나 보여주기 + 최근 연락 날짜 보여주기*/}
            </div>
        </div>
    )
}

export default MessageList