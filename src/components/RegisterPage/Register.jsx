import { createUserWithEmailAndPassword, getAuth, updateProfile } from 'firebase/auth'
import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import app, { db } from '../../firebase'
import md5 from 'md5'
import { useDispatch } from 'react-redux'
import { setUser } from '../../store/UserSlice'
import { ref, set } from 'firebase/database'
import { useForm } from 'react-hook-form'

const Register = () => {

    const { register, watch, formState: { errors }, handleSubmit } = useForm()
    const [Loading, setLoading] = useState(false)
    const [errorFormSubmit, setErrorFormSubmit] = useState("")
    const dispatch = useDispatch()
    const nav = useNavigate()
    const auth = getAuth(app)
    const onSubmit = async (data) => {
        try {
            setLoading(true)
            const createdUser = await createUserWithEmailAndPassword(auth, data.email, data.password)

            await updateProfile(auth.currentUser, {
                displayName: data.name,
                photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`,
            });

            const userData = {
                uid: createdUser.user.uid,
                displayName: createdUser.user.displayName,
                photoURL: createdUser.user.photoURL,
                stateMessage: '',
                mainImageURL: `https://www.example.com/backgrounds/${md5(createdUser.user.email)}.jpg`
            }
            dispatch(setUser(userData))

            set(ref(db, `users/${createdUser.user.uid}`), userData)

        }
        catch (error) {
            console.error(error)
            setErrorFormSubmit(error.message)
            setTimeout(() => {
                setErrorFormSubmit("")
            }, 3000)
        }
        finally {
            setLoading(false)
        }
    }
    return (
        <div className='Login'>
            <h3>회원가입</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
                <section>
                    <label htmlFor='name'>이름</label>
                    <input name='name' type='name' id='name'
                        {...register("name", { required: true, maxLength: 6 })} />
                    {errors.name && errors.name.type == 'required' && <p>이름을 입력하세요</p>}
                    {errors.name && errors.name.type == 'maxLength' && <p>이름은 최대 6자까지 가능합니다</p>}
                </section>

                <section>
                    <label htmlFor='email'>이메일</label>
                    <input name='email' type='email' id='email'
                        {...register("email", { required: true, pattern: /^\S+@\S+$/i })} />
                    {errors.email && <p>이메일을 다시 입력해주세요</p>}
                </section>

                <section>
                    <label htmlFor='password'>비밀번호</label>
                    <input name='password' type='password' id='password'
                        {...register("password", { required: true, minLength: 6 })} />
                    {errors.password && errors.password.type == 'required' && <p>비밀번호를 입력해주세요</p>}
                    {errors.password && errors.password.type == 'minLength' && <p>비밀번호는 6자 이상이여야 합니다</p>}
                </section>


                {errorFormSubmit && <p>{errorFormSubmit}</p>}

                <input type='submit' disabled={Loading} />
                <Button className='submit_button'
                    onClick={() => nav('/login')}
                    style={{ marginTop: '10px', float: 'right' }}>로그인하러 가기</Button>

            </form>

        </div>
    )
}

export default Register