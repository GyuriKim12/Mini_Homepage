import { get, ref, push, update, child, off, onChildAdded } from 'firebase/database'
import React, { useState } from 'react'
import { Button, Form, Image, Modal } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { db } from '../../firebase'
import { useDispatch, useSelector } from 'react-redux'
import MessageList from './MessageList'
import { setCurrentChatRoom } from '../../store/ChatRoomSlice'

const MessageHome = () => {
    const nav = useNavigate()
    const [show, setShow] = useState(false)
    const [name, setName] = useState()
    const { currentUser } = useSelector(state => state.user)
    const [input, setInput] = useState({
        createdUserUID: currentUser.uid,
        friendUID: "",
        friendDisplayName: "",
        friendphotoURL: "",
        chatName: "",
    })
    const [friend, setFriend] = useState(false)

    const [chatName, setChatName] = useState()
    const [searchTimeout, setSearchTimeout] = useState(null)
    const [message, setMessage] = useState([])
    const usersRef = ref(db, 'users')
    const chatRoomsRef = ref(db, 'chatRooms')
    const dispatch = useDispatch()


    const addMessageEventListener = () => {
        let MessageArray = []
        onChildAdded(chatRoomsRef, DataSnapshot => {
            console.log(DataSnapshot.val().createdBy.id)
            if (DataSnapshot.val().createdBy.id === currentUser.uid ||
                DataSnapshot.val().participant.id === currentUser.uid) {
                MessageArray.push(DataSnapshot.val())
                const newMessage = [...MessageArray]
                setMessage(newMessage)
            }

        })
    }


    useState(() => {
        addMessageEventListener();

        return () => {
            off(chatRoomsRef)
        }
    }, [])

    const searchFriendByEmail = async (email) => {
        try {
            get(usersRef).then(snapshot => {
                if (snapshot.exists()) {
                    const users = snapshot.val()
                    const foundUser = Object.values(users).find(user => user.displayName === email)

                    if (foundUser) {
                        setInput({ ...input, friendUID: foundUser.uid, friendDisplayName: foundUser.displayName, friendphotoURL: foundUser.photoURL })
                        setFriend(true)
                    }
                    else {
                        setFriend(false)
                    }
                }
                else {
                    setFriend(false)
                }
            })
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    }

    const handleInputChange = (e) => {
        const email = e.target.value
        setName(email);
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        const newTimeout = setTimeout(() => {
            if (email) {
                searchFriendByEmail(email);
            } else {
                setFriend(null);
            }
        }, 500);

        setSearchTimeout(newTimeout);

    }

    const handleSubmit = async (e) => {
        const key = push(chatRoomsRef).key
        console.log(input)
        const newChatRoom = {
            id: key,
            name: input.chatName,
            createdBy: {
                id: currentUser.uid,
                image: currentUser.photoURL,
                name: currentUser.displayName,
            },
            participant: {
                id: input.friendUID,
                image: input.friendphotoURL,
                name: input.friendDisplayName,
            }
        }
        try {
            await update(child(chatRoomsRef, key), newChatRoom)
            setInput({
                createdUserUID: currentUser.uid,
                friendUID: "",
                friendDisplayName: "",
                friendphotoURL: "",
                chatName: "",
            })
            setShow(false)
            dispatch(setCurrentChatRoom(newChatRoom))
        } catch (error) {
            alert(error)
        }
    }

    return (
        <div className='DiaryHome'>
            <div className='DiaryMiddle'>
                <button onClick={() => setShow(!show)}>✉️ 메세지방 만들기</button>
            </div>

            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{""}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Control
                                value={name || ""}
                                onChange={handleInputChange}
                                type='text' placeholder='친구의 닉네임을 검색해주세요' />
                        </Form.Group>
                        <div>
                            {friend && (
                                <div
                                    onClick={() => console.log('Selected friend:', friend)}
                                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px', borderRadius: '5px', backgroundColor: 'white', marginBottom: '10px' }}
                                >
                                    <Image src={input.friendphotoURL} style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }} />

                                    <p style={{ margin: 0 }}>{input.friendDisplayName}</p>
                                </div>
                            )}
                        </div>


                        <Form.Group>
                            <Form.Control
                                value={chatName}
                                onChange={(e) => setInput({ ...input, chatName: e.target.value })}
                                type='text' placeholder='채팅방 이름을 만드세요' />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={handleSubmit}
                        style={{ width: '20%' }} variant='primary'>생성</Button>
                </Modal.Footer>
            </Modal>
            <div>
                {message.map((item) => <MessageList key={item.id} {...item} />)}
            </div>

        </div >
    )
}

export default MessageHome