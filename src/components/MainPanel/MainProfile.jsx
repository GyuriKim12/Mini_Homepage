import React, { useEffect, useRef, useState } from 'react'
import { Button, ButtonGroup, Dropdown, Form, Image, Modal } from 'react-bootstrap'
import './MainProfile.css'
import { useDispatch, useSelector } from 'react-redux'
import { getAuth, updateProfile } from 'firebase/auth'
import app, { db, storage } from '../../firebase'
import { getDownloadURL, ref as stRef, uploadBytesResumable } from 'firebase/storage'
import { setDisplayName, setPhotoUrl, setStateMessage } from '../../store/UserSlice'
import { ref, update } from 'firebase/database'
import md5 from 'md5'

const MainProfile = () => {
    const usersRef = ref(db, "users")
    const [state, setState] = useState("😀")
    const { currentUser } = useSelector(state => state.user)
    const auth = getAuth(app)
    const dispatch = useDispatch()
    const [name, setName] = useState("")
    const [message, setMessage] = useState("")
    const [imgError, setImgError] = useState(false); // 이미지 로드 오류 상태
    const defaultImageURL = `http://gravatar.com/avatar/${md5(auth.currentUser.email)}?d=identicon`

    // const [friends, setFriends] = useState(["임솔", "류선재", "간지남김태성", "인혁이다", "찬영이", "성찬이", "돌석", "블쉐님", "구름즈", "성찬영"]);

    const [view, setView] = useState(false);
    const [show, setShow] = useState(false)
    const [messageShow, setMessageShow] = useState(false)

    const onClick = (e) => {
        setState(e.target.value)
    }

    const isFormValid = (name) => {
        return name;
    }
    const handleSubmit = async (e) => {
        const user = auth.currentUser

        if (isFormValid(name)) {
            try {
                dispatch(setDisplayName(name))
                await update(ref(db, `users/${user.uid}`), { displayName: name });
                await updateProfile(user, { displayName: name });
                setShow(false)
            }
            catch (error) {
                alert(error)
            }

        }
    }

    const handleMessageSubmit = async (e) => {
        const user = auth.currentUser

        if (isFormValid(message)) {
            try {
                dispatch(setStateMessage(message))
                await update(ref(db, `users/${user.uid}`), { stateMessage: message });
                await updateProfile(user, { stateMessage: message });
                setMessageShow(false)
            }
            catch (error) {
                alert(error)
            }

        }
    }

    const fileInputRef = useRef(null);

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handelUploadImage = (event) => {

        const file = event.target.files[0]
        const user = auth.currentUser
        const metadata = {
            contentType: file.type
        };

        // Upload file and metadata to the object 'images/mountains.jpg'
        const storageRef = stRef(storage, 'user_image/' + file.name);
        const uploadTask = uploadBytesResumable(storageRef, file, metadata);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on('state_changed',
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                    case 'storage/unauthorized':
                        // User doesn't have permission to access the object
                        break;
                    case 'storage/canceled':
                        // User canceled the upload
                        break;

                    // ...

                    case 'storage/unknown':
                        // Unknown error occurred, inspect error.serverResponse
                        break;
                }
            },
            () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    updateProfile(user,
                        {
                            photoURL: downloadURL
                        }
                    )
                    dispatch(setPhotoUrl(downloadURL))

                    update(ref(db, `users/${user.uid}`), { photoURL: downloadURL });
                });
            }
        );
    }

    const [showMenu, setShowMenu] = useState(false);

    const handleToggle = () => {
        setShowMenu(!showMenu);
    };

    const dropdownRef = useRef(null);

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setView(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (!currentUser) {
        return <div>Loading...</div>; // currentUser가 null인 경우 로딩 상태를 보여줍니다.
    }


    return (
        <div className='MainProfile'>

            <div className='nickname'>
                <h3>{currentUser.displayName}</h3>

            </div>

            <div>
                {currentUser.photoURL !== defaultImageURL ?
                    (<Image
                        src={currentUser.photoURL}
                        alt="Profile"
                        className='profileImage'
                        style={{ maxWidth: '170px' }}
                    />) : (<div style={{
                        height: '140px', borderRadius: '5px', border: '2px solid black', textAlign: 'center', display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer'
                    }}
                        onClick={handleButtonClick}
                    >{'프로필 이미지를 넣어주세요'}</div>)
                }

            </div>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }} // 파일 입력 숨기기
                onChange={handelUploadImage}
            />
            <div className='stateMessage'>
                <h3>자기소개</h3>
                <h4 className='introduce'>{currentUser.stateMessage}</h4>

            </div>

            <div style={{ position: 'relative', display: 'inline-block', height: '100%' }} ref={dropdownRef}>
                <ul
                    style={{
                        listStyleType: 'none',
                        margin: 0,
                        padding: 0,
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        flex: 1,
                        height: '100%'
                    }}
                    onClick={() => setView(!view)}
                >
                    <button>
                        프로필 수정
                    </button>

                </ul>
                {view && (
                    <div
                        style={{
                            position: 'absolute',
                            backgroundColor: 'rgb(123, 166, 226)',
                            // boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                            zIndex: 1
                        }}
                    >
                        <ul
                            className='dropdown-menu'
                        >
                            <li onClick={() => setShow(!show)}>닉네임 수정</li>
                            <li onClick={handleButtonClick}>프로필 이미지 수정</li>
                            <li onClick={() => setMessageShow(!messageShow)}>상태메세지 수정</li>
                        </ul>
                    </div>
                )}
            </div>

            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{""}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            {/* <Form.Label>닉네임</Form.Label> */}
                            <Form.Control
                                onChange={(e) => setName(e.target.value)}
                                maxLength={6}
                                type='text' placeholder='닉네임을 6자 이내로 입력하세요' />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={handleSubmit}
                        style={{ width: '20%' }} variant='primary'>수정</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={messageShow} onHide={() => setMessageShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{""}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            {/* <Form.Label>닉네임</Form.Label> */}
                            <Form.Control
                                onChange={(e) => setMessage(e.target.value)}
                                type='text' placeholder='상태메세지를 입력하세요' />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={handleMessageSubmit}
                        style={{ width: '20%' }} variant='primary'>수정</Button>
                </Modal.Footer>
            </Modal>



            {/* <div className='friendList'>
                친구목록 {" ("}{friends.length}{"명)"}
                <ul>
                    {friends.map((friend, index) => (
                        <li className="friend-item" key={index}>{friend}</li>
                    ))}
                </ul>
            </div> */}

        </div>
    )
}

export default MainProfile