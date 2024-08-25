import React, { useRef } from 'react'
import { Image } from 'react-bootstrap'
import './MainImage.css'
import { getAuth } from 'firebase/auth'
import app, { db, storage } from '../../firebase'
import { getDownloadURL, ref as stRef, uploadBytesResumable } from 'firebase/storage'
import { setMainImageUrl } from '../../store/UserSlice'
import { useDispatch, useSelector } from 'react-redux'
import { ref, update } from 'firebase/database'
import md5 from 'md5'

const MainImage = () => {
    const auth = getAuth(app)
    const dispatch = useDispatch()
    const fileInputRef = useRef(null);
    const { currentUser } = useSelector(state => state.user)
    const handelUploadImage = (event) => {

        const file = event.target.files[0]
        const user = auth.currentUser
        const metadata = {
            contentType: file.type
        };

        // Upload file and metadata to the object 'images/mountains.jpg'
        const storageRef = stRef(storage, 'user_mainImage/' + file.name);
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
                    dispatch(setMainImageUrl(downloadURL))

                    update(ref(db, `users/${user.uid}`), { mainImageURL: downloadURL })
                });
            }
        );
    }
    const defaultImageURL = `https://www.example.com/backgrounds/${md5(auth.currentUser?.email || '')}.jpg`;
    const placeholderText = '🔎 대표 이미지를 넣어주세요!';

    const handleImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div className='MainImage'>

            <h4>대표 이미지</h4>
            <div className='ImageSection'>
                {currentUser.mainImageURL !== defaultImageURL ?
                    <Image
                        src={currentUser.mainImageURL || defaultImageURL}
                        alt="User"
                        style={{
                            maxHeight: '320px', maxWidth: '500px',
                            cursor: 'pointer', borderRadius: '5px'
                        }}
                        onClick={handleImageClick}
                    /> : null}

                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handelUploadImage}
                />

                {currentUser.mainImageURL == defaultImageURL && (
                    <div style={{
                        width: 'auto',
                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                        cursor: 'pointer'
                    }}
                        onClick={handleImageClick}
                    >
                        {placeholderText}
                    </div>
                )}
            </div>
        </div>
    )
}

export default MainImage