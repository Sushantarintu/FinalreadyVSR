import React from 'react'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import Todo from './Todo.js'
import SignUp from './SignUp.js'
import LandingPage from './LandingPage.js'
import QuizMode from './QuizMode.js'
import ChatSign from './ChatSign.js' 
import GroupCreation from './GroupCreation.js'
import {MyProvider} from './Store.js'
import GroupChatting from "./GroupChatting.js";
import LeaderBoard from './LeaderBoard.js'
import RandomQuiz from './RandomQuiz.js'
// import VideoFront from './VideoFront.js'
import RoomCreation from './RoomCreation.js'
import QuizQueSection from './QuizQueSection.js'
import GrStudyPage from './GrStudyPage.js'
import Whiteboard from './WhiteBoard.js'
import JoinSection from './JoinSection.js'
import Test from './Test.js'
import GrpTest from './GrpTest.js'
import AdminPage from './AdminPage.js'
import WelcomePage from './WelcomePage.js'
import SpeechToText from './SpeechToText.js'
import FetchRes from './FetchRes.js'
import EngagementDetails from './EngagementDetails.js'
import AboutPage from './AboutPage.js'
import ServicesPage from './ServicesPage.js'
import ContactPage from './ContactPage.js'
import UserEngagement from './UserEngagement.js'


const Secondary = () => {
  return (
    <div>
      <MyProvider>
      <Router>
        <Routes>
        <Route path='/' element={<WelcomePage />}/>
            {/* <Route path='/' element={<LandingPage />}/> */}
            <Route path='/whiteboard' element={<Whiteboard />}/>
            <Route path='/useng' element={<UserEngagement />}/>
            <Route path='/about' element={<AboutPage />}/>
            <Route path='/serv' element={<ServicesPage />}/>
            <Route path='/cont' element={<ContactPage />}/>
            <Route path='/engdetail' element={<EngagementDetails />}/>
            <Route path='/sptext' element={<SpeechToText />}/>
            <Route path='/testing' element={<Test />}/>
            <Route path='/fetres' element={<FetchRes />}/>
            <Route path='/quizmode' element={<QuizMode />}/>
            <Route path='/joinsec' element={<JoinSection />}/>
            <Route path='/ranquiz' element={<RandomQuiz />}/>
            <Route path='/admin' element={<AdminPage />}/>
            <Route path='/signup' element={<SignUp />}/>
            <Route path='/chat' element={<ChatSign />}/>
            <Route path='/leaderboard' element={<LeaderBoard />}/>
            <Route path="/study/:roomid2" element={<GrStudyPage />} />
            {/* <Route path='/grstudy' element={<GrStudyPage />}/> */}
            <Route path='/cgroup' element={<GroupCreation />}/>
            <Route path='/grchat' element={<GroupChatting />}/>
            <Route path='/grtest' element={<GrpTest />}/>
            <Route path='/create-room/:roomId' element={<JoinSection  />} />
            <Route path='/study/:roomId' element={<JoinSection  />} />
            <Route path='/create-room2/:roomid' element={<RoomCreation  />} />
            <Route path='/roomcre' element={<RoomCreation />} />
            {/* <Route path='/videosec' element={<VideoFront />}/> */}
            <Route path='/quizsetque' element={<QuizQueSection />}/>
        </Routes>
      </Router>
      </MyProvider>
    </div>
  )
}

export default Secondary
