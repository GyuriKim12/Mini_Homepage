import React, { useState } from 'react'
import './Login.css'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import app from '../../firebase'

const Login = () => {
    const { register, watch, formState: { errors }, handleSubmit } = useForm()
    const [Loading, setLoading] = useState(false)
    const [errorFormSubmit, setErrorFormSubmit] = useState("")

    const dispatch = useDispatch()
    const nav = useNavigate()
    const auth = getAuth(app)

    const onSubmit = async (data) => {
        try {
            setLoading(true)
            console.log(data)
            await signInWithEmailAndPassword(auth, data.email, data.password)

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
            <h3>로그인</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
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
                    onClick={() => nav('/register')}
                    style={{ marginTop: '10px', float: 'right' }}>회원가입하러 가기</Button>

            </form>

        </div>
    )
}

export default Login