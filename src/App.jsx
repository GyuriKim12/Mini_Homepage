import './App.css'
import { Route, Routes, useNavigate } from 'react-router-dom'
import MainPage from './pages/MainPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import SidePanel from './components/SidePanel/SidePanel'
import UpPanel from './components/MainPanel/UpPanel'
import MainProfile from './components/MainPanel/MainProfile'
import DiaryPage from './pages/DiaryPage'
import PicturePage from './pages/PicturePage'
import MessagePage from './pages/MessagePage'
import DiaryWriting from './components/DiaryPage/DiaryWriting'
import { useEffect } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import app, { db } from './firebase'
import { useDispatch } from 'react-redux'
import { clearUser, setUser } from './store/UserSlice'
import { Firestore, doc, getDoc } from 'firebase/firestore'
import { get, ref } from 'firebase/database'
import PictureWriting from './components/PicturePage/PictureWriting'
import PictureEdit from './pages/PictureEdit'
import DiaryEdit from './pages/DiaryEdit'
import MessageWriting from './components/MessagePage/MessageWriting'

// 공통된 레이아웃
const Layout = ({ children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
    <section style={{
      display: 'flex',
      marginBottom: '10px',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <SidePanel />
      <UpPanel />
    </section>
    <section style={{ display: 'flex', justifyContent: 'space-between', flex: 1 }}>
      <MainProfile />
      <div style={{ flex: 1, height: '100%' }}>{children}</div>
    </section>
  </div>
);

function App() {
  const auth = getAuth(app)
  const nav = useNavigate()
  const dispatch = useDispatch()
  useEffect(() => {
    //인증 상태 change되면 실행됨
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = ref(db, `users/${user.uid}`);
          const userSnapshot = await get(userRef);
          const userData = userSnapshot.val();
          if (userSnapshot.exists()) {
            const userData = userSnapshot.val();
            dispatch(setUser({
              uid: user.uid,
              displayName: user.displayName || '',
              photoURL: user.photoURL || '',
              stateMessage: userData.stateMessage || '', // 기본값 설정
              mainImageURL: userData.mainImageURL || ''  // 기본값 설정
            }));
            nav('/');
          } else {
            dispatch(setUser({
              uid: user.uid,
              displayName: user.displayName,
              photoURL: user.photoURL,
              stateMessage: '',
              mainImageURL: ''
            }));
            nav('/');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          dispatch(clearUser());
          nav('/login');
        }
      } else {
        dispatch(clearUser());
        nav('/login');
      }
    });
    //상태 변화 없으면 비워줌
    return () => {
      unsubscribe();
    }
  }, [])
  return (
    <div>
      <Routes>
        {/* MainPage */}
        <Route path='/' element={<Layout><MainPage /></Layout>} />
        <Route path='/diary' element={<Layout><DiaryPage /></Layout>} />
        <Route path='/newDiary' element={<Layout><DiaryWriting /></Layout>} />
        <Route path='/diary/:id' element={<Layout><DiaryEdit /></Layout>} />

        <Route path='/picture' element={<Layout><PicturePage /></Layout>} />
        <Route path='/newPicture' element={<Layout><PictureWriting /></Layout>} />
        <Route path='/picture/:id' element={<Layout><PictureEdit /></Layout>} />
        <Route path='/message' element={<Layout><MessagePage /></Layout>} />
        <Route path='/message/:id' element={<Layout><MessageWriting /></Layout>} />

        {/* LoginPage */}
        <Route path='/login' element={<LoginPage />} />
        {/* RegisterPage */}
        <Route path='/register' element={<RegisterPage />} />
      </Routes>
    </div>

  )
}

export default App
