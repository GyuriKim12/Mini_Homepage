import React, { useEffect, useRef, useState } from 'react'
import './MessageWriting.css'
import { useDispatch, useSelector } from 'react-redux'
import { child, off, onChildAdded, onChildRemoved, push, ref, remove, serverTimestamp, set, update } from 'firebase/database'
import { db, storage } from '../../firebase'
import { Button, Form, Image, Modal } from 'react-bootstrap'
import { getDownloadURL, ref as stRef, uploadBytesResumable } from 'firebase/storage'
import Message from './Message'
import { useNavigate } from 'react-router-dom'
import { setChatRoomName } from '../../store/ChatRoomSlice'


const MessageWriting = () => {
    const { currentUser } = useSelector(state => state.user)
    const { currentChatRoom } = useSelector(state => state.chatRoom)
    const [message, setMessage] = useState([])
    const [data, setData] = useState([])
    const [content, setContent] = useState("")
    const fileInputRef = useRef(null);
    const [errors, seteErrors] = useState([]);
    const [typingUsers, setTypingUsers] = useState([])
    const chatRoomsRef = ref(db, 'chatRooms')
    const MessagesRef = ref(db, 'messages')
    const typingRef = ref(db, 'typing')
    const nav = useNavigate()
    const [show, setShow] = useState(false)
    const [chatName, setChatName] = useState("")
    const dispatch = useDispatch()
    const messageEndRef = useRef(null);


    useEffect(() => {
        //내가 만든 사람일 때
        if (currentChatRoom.createdBy.id === currentUser.uid) {
            setData(currentChatRoom.participant)
        }
        //내가 만든 사람이 아닐 때
        else {
            setData(currentChatRoom.createdBy)
        }
    })

    useEffect(() => {
        if (currentChatRoom.id) {
            setMessage([])
            addMessageListener(currentChatRoom.id)
            addTypingListener(currentChatRoom.id)
        }
        return () => {
            if (currentChatRoom.id) {
                off(child(MessagesRef, currentChatRoom.id))
            }
        }
    }, [currentChatRoom.id])

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [message]);

    const addTypingListener = (chatRoomId) => {
        let typingUsers = []
        onChildAdded(child(typingRef, chatRoomId), DataSnapshot => {
            if (DataSnapshot.key !== currentUser.uid) {
                const typingData = DataSnapshot.val();
                typingUsers = typingUsers.concat({
                    id: DataSnapshot.key,
                    name: typingData.userName
                });
                setTypingUsers(typingUsers)
            }
        })

        onChildRemoved(child(typingRef, chatRoomId), DataSnapshot => {
            const index = typingUsers.findIndex(user => user.id === DataSnapshot.key);  // user.id로 비교
            if (index !== -1) {
                typingUsers = typingUsers.filter(user => user.id !== DataSnapshot.key);
                setTypingUsers(typingUsers);
            }
        });
    }

    const addMessageListener = (chatRoomId) => {
        let MessagesArray = []
        onChildAdded(child(MessagesRef, chatRoomId), DataSnapshot => {
            MessagesArray.push(DataSnapshot.val())
            const newMessages = [...MessagesArray]
            setMessage(newMessages)
        })

    }


    const createMessage = (fileUrl = null) => {
        const message = {
            timestamp: serverTimestamp(),
            user: {
                id: currentUser.uid,
                name: currentUser.displayName,
                image: currentUser.photoURL
            }
        }

        if (fileUrl != null) {
            message["image"] = fileUrl;
        }
        else {
            message["content"] = content
        }

        return message
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content) {
            seteErrors(prev => prev.concat("Type contents First"))
            return
        }
        try {
            await set(push(child(MessagesRef, currentChatRoom.id)), createMessage())
            setContent("")
            seteErrors([])

        } catch (error) {
            seteErrors(prev => prev.concat(error.message))
            setTimeout(() => {
                seteErrors([])
            }, 5000)
        }
    }

    const handleChange = (e) => {
        setContent(e.target.value)
        if (e.target.value) {
            // 사용자가 타이핑 중일 때 타이핑 상태를 설정
            set(ref(db, `typing/${currentChatRoom.id}/${currentUser.uid}`), {
                userUid: currentUser.uid,
                userName: currentUser.displayName
            });
        } else {
            // 사용자가 타이핑을 멈췄을 때 타이핑 상태를 제거
            remove(ref(db, `typing/${currentChatRoom.id}/${currentUser.uid}`));
        }
    }


    const handleImageUpload = (event) => {
        const file = event.target.files[0]
        if (file) {
            const storageRef = stRef(storage, `message/${currentChatRoom.id}` + file.name);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                },
                (error) => {
                    console.error("Image upload error:", error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        set(push(child(MessagesRef, currentChatRoom.id)), createMessage(downloadURL))
                    });
                }
            );
        }

    };

    const handleImageClick = () => {
        console.log('클릭')
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleChatName = async (e) => {
        dispatch(setChatRoomName(chatName))
        await update(child(chatRoomsRef, currentChatRoom.id), { name: chatName })
        setShow(false)
    }


    return (
        <div className='MessageWriting'>
            <div className='MessageHeader'>
                <button onClick={() => nav(-1)} style={{ width: '50px', fontSize: '20px', padding: '10px' }}>{"<"}</button>

                <Image src={data.image} style={{ width: '100px', borderRadius: '5px' }} />
                <div className='name'>
                    <h3>{currentChatRoom.name}</h3>

                    <h4>
                        {data.name}
                    </h4>
                </div>


                <button style={{ width: '120px' }} onClick={() => setShow(!show)}>채팅방 이름 수정</button>
            </div>
            <div className='MessageMiddle'>
                <div className='MessageMain' >
                    {message.length > 0 &&
                        message.map(item => <Message key={item.id} {...item} />)}
                    <div ref={messageEndRef} />

                </div>
                <div className='MessageTyping'>
                    {typingUsers.length > 0 &&
                        typingUsers.map(user => <span key={user.id}>{user.name}님이 채팅을 입력하고 있습니다</span>)}
                </div>
            </div>
            <div className='MessageFooter'>
                <div>
                    <form onSubmit={handleSubmit}>
                        <button
                            onClick={handleImageClick}
                        >이미지</button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleImageUpload}
                            accept="image/*"
                        />

                        <textarea onChange={handleChange} value={content} />

                        <button type='submit'>전송</button>
                    </form>


                </div>
            </div>

            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{""}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Control
                                onChange={(e) => setChatName(e.target.value)}
                                type='text' placeholder='새로운 채팅방 이름을 만드세요' />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={handleChatName}
                        style={{ width: '20%' }} variant='primary'>수정</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default MessageWriting