import React, { useEffect, useRef, useState } from 'react'
import './PictureWriting.css'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { child, push, ref, remove, set, update } from 'firebase/database'
import { db, storage } from '../../firebase'
import { Image } from 'react-bootstrap'
import { getDownloadURL, ref as stRef, uploadBytesResumable } from 'firebase/storage'


const PictureWriting = ({ data, edit }) => {
    const fileInputRef = useRef(null);
    const { currentUser } = useSelector(state => state.user)
    const pictureRef = ref(db, 'pictures')
    const nav = useNavigate()
    const [upload, setUpload] = useState(false)
    const [change, setChange] = useState(false);
    const dispatch = useDispatch()
    const [editPage, setEditPage] = useState(false)

    //useState이용해서 title, sentence 등의 정보를 다 저장해둠
    const [input, setInput] = useState({
        createdDate: new Date().getTime(),
        title: "",
        content: "",
        photoURL: "",
    });

    useEffect(() => {
        if (data, edit) {
            setInput({ ...data })
            setEditPage(true)
        }
    }, [data])

    const onChange = (e) => {
        const name = e.target.name
        const value = e.target.value
        setInput({
            ...input, [name]: value,
        })
        setChange(true);
    }

    const handleImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    useEffect(() => {
        if (input.photoURL) {
            setUpload(true);
        }
    }, [input.photoURL]);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const storageRef = stRef(storage, 'user_photo/' + file.name);
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
                        setInput(prevInput => ({
                            ...prevInput,
                            photoURL: downloadURL,
                        }));

                        console.log('이미지 업로드 완료', input.photoURL)
                        setUpload(true);
                    });
                }
            );
        }
    };


    const handleSubmit = async (e) => {
        //edit상황인지 아닌지에 따라 다르게 행동하도록 함
        e.preventDefault();
        const userId = currentUser.uid;
        const userPicturesRef = ref(db, `pictures/${userId}`);
        const newPictureRef = push(userPicturesRef);
        const newPicture = {
            id: newPictureRef.key,
            ...input
        };

        if (input.content && input.photoURL && input.title) {
            try {
                if (!editPage) {
                    await set(newPictureRef, newPicture);
                } else {
                    const isConfirmed = window.confirm('정말로 수정하겠습니까?');
                    if (isConfirmed) {
                        await update(ref(db, `pictures/${userId}/${newPicture.id}`), newPicture);

                    }
                    else {
                        return
                    }
                }
                nav(-1);
            } catch (error) {
                console.error("Error saving picture:", error);
                alert(error);
            }

        }
        else {
            window.alert('이미지, 제목, 설명 모두 작성해주세요')
        }


    };

    const handleDelete = async (e) => {
        const isConfirmed = window.confirm('정말로 삭제하시겠습니까?');
        const userId = currentUser.uid;
        if (isConfirmed) {
            remove(ref(db, `pictures/${userId}/${data.id}`))
            nav(-1)
        }
        else {
            return
        }
    }

    return (
        <div className='PictureWriting'>
            <div className='writing_header'>
                <button onClick={() => nav(-1)}>{"<"}</button>
                <h4>
                    <span>
                        {currentUser.displayName}
                    </span>
                    의
                    <span className='title'>
                        아카이빙!
                    </span>
                    : 소중한 순간을 기록해봐 !</h4>
            </div>
            <div className='writing_main'>
                <div className='writing_image'>
                    {upload && <Image src={input.photoURL}
                        style={{ maxWidth: '350px' }} />}

                    <button onClick={handleImageClick}>이미지를 선택해주세요!</button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleImageUpload}
                        accept="image/*"
                    />

                </div>
                <div className='writing_sen'>
                    <h4>{`해당 순간의 제목을 적어주세요!`}</h4>
                    <input
                        name='title'
                        value={input.title || ""}
                        onChange={onChange}
                        placeholder="제목은 ... " />
                </div>

                <div className='writing_sen'>
                    <h4>{`해당 순간을 설명해주세요!`}</h4>
                    <input
                        name='content'
                        value={input.content || ""}
                        onChange={onChange}
                        placeholder="이 장면은 ... " />
                </div>

            </div>
            <div className='writing_footer'>
                <button className='submit' onClick={handleSubmit}>제출</button>
                <button className={`submit_${editPage}`} onClick={handleDelete}>삭제</button>
            </div>

        </div>
    )
}

export default PictureWriting