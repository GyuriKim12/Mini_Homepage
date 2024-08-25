import { child, get, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import PictureWriting from '../components/PicturePage/PictureWriting';
import { useSelector } from 'react-redux';

const PictureEdit = () => {
    const { id } = useParams();
    const { currentUser } = useSelector(state => state.user)
    const [data, setData] = useState([]);
    const edit = true

    useEffect(() => {
        if (id) {
            const pictureRef = child(ref(db, `pictures/${currentUser.uid}`), id);
            get(pictureRef).then(snapshot => {
                if (snapshot.exists()) {
                    setData(snapshot.val());
                } else {
                    console.log("No data available");
                }
            }).catch(error => {
                console.error(error);
            });
        }
    }, [id]);

    return (
        <div>
            {data ? <PictureWriting data={data} edit={true} /> : <p>Loading...</p>}
        </div>
    );
}

export default PictureEdit