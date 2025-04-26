import React ,{useState,useEffect,useContext} from 'react'
import './welcome.css'
import bgmg from './bgimg.jpg'
import LandingPage from './LandingPage'
import { StudyContext } from "./Store.js";
import axios from 'axios'
import validator from 'validator';
import SignUp from './SignUp';

const WelcomePage = () => {
  const [loginEmail2, setLoginEmail2] = useState('');
    const [loginPass2, setLoginPass2] = useState('');
    const [signedUsers2,setSignedUsers2]= useState([])
    const [isAllowed2, setIsAllowed2] = useState(false);
    const { updateData, ldata } = useContext(StudyContext);
    const [signup,setSignUp]= useState(false)

    useEffect(() => {
      axios.get('https://readyvsr.onrender.com/getUserData')
        .then(response => {
          setSignedUsers2(response.data);
        })
        .catch(error => console.error('Error fetching users:', error));
    }, []);

    const handleLogin = () => {
      if (!loginEmail2.trim() || !loginPass2.trim()) {
        alert('All fields are required!');
        return;
      } else if (!validator.isEmail(loginEmail2)) {
        alert('Please enter a valid email.');
        return;
      } else {
        const matchedUser2 = signedUsers2.find(
          (curUser) => curUser.email === loginEmail2 && curUser.password === loginPass2
        );
        if (matchedUser2) {
          console.log("this is teh loginer:",matchedUser2);
          
          axios.post('https://readyvsr.onrender.com/loginers', matchedUser2);
          setIsAllowed2(true);
          updateData(matchedUser2); 
    
        } else {
          alert('No Such User Exists');
        }
      }
    };

  return (
    <>
    {isAllowed2 ? (
      <LandingPage />
    ) :signup ? (
      <SignUp />
    ) :(
      <div className='karide'>
      <div className="main">
        <div className="sec1">
          <nav className="navdiv">
            <div className="praroz leftside">LOGO</div>
            <ul>
            <li><a href="#" style={{fontSize:"20px"}}>Home</a></li>
            <li><a href="/about" style={{fontSize:"20px"}}>About</a></li>
            <li><a href="/serv" style={{fontSize:"20px"}}>Services</a></li>
            <li><a href="/cont" style={{fontSize:"20px"}}>Contact</a></li>
            </ul>
            <div id="dd">
              {/* <input type="text" id="in" placeholder="Type to text" />
              <button id="bn">Search</button> */}
              <button id='bn' onClick={()=>setSignUp(true)}>Sign Up</button>
            </div> {/* Missing closing div added */}
          </nav>
        </div>
        <div className="sec2">
          <div id="sec3">
          {/* <div className="loginSection">
      <label htmlFor="toggleAuthMode" className="loginLabel">Login</label>
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setLoginEmail(e.target.value)}
        className="loginInput"
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setLoginPass(e.target.value)}
        className="loginInput"
      />
      <button onClick={handleLogin} className="loginButton">Login</button>
    </div> */}
            <h1  className="middle" style={{color:"white",textAlign:"center"}}>Login Here</h1><br />
            <input type="text" className="middle" id="in1" onChange={(e) => setLoginEmail2(e.target.value)} placeholder="Enter Email " /><br />
            <input type="password" className="middle" id="in2" onChange={(e) => setLoginPass2(e.target.value)} placeholder="Enter Password " /><br />
            <button id="btn3" className="middle" onClick={handleLogin}>Login</button><br />
            {/* <h3 className="middle" id="h31">Don't have an account?<br id="br1" /> Sign Up here</h3>
            <h3 id="h32">Log in with</h3>
            <div id="dds">
              <a href="#" id="a1"><img className="image" src="https://tse2.mm.bing.net/th?id=OIP.XgT9d552B6R9C60Ul2yqkAHaHa&pid=Api&P=0&h=180" height="30px" width="40px" /></a>
              <a href="#" id="a2"><img className="image" src="https://tse1.mm.bing.net/th?id=OIP.6-Etwy2306AInODxxbDK6gHaHY&pid=Api&P=0&h=180" height="30px" width="40px" /></a>
              <a href="#" id="a3"><img className="image" src="https://tse2.mm.bing.net/th?id=OIP.IOlJ2wJrAUpUh6T1la8kxAHaEK&pid=Api&P=0&h=180" height="30px" width="40px" /></a>
              <a href="#" id="a4"><img className="image" src="https://logos-world.net/wp-content/uploads/2020/09/Google-Symbol.png" height="30px" width="40px" /></a>
            </div>  */}
          </div>
          <h1 className="white leftside">Web Design &</h1>
          <h1 id="ora" className="leftside">Development</h1>
          <h1 className="white leftside">Course</h1>
          <p id="me">
            Built wicket longer do barton vanity itself do in it. Preferred to sportsmen it engrossed listening. 
            Park gatesell they west hard for Lorem, ipsum dolor sit amet consectetur adipisicing elit. Veritatis sit 
            molestiae doloribus tempora, numquam consectetur error suscipit, corporis dolorem iusto molestias, sunt 
            incidunt rem! Eum fugit similique autem qui totam?
          </p> {/* Corrected closing tag */}
          <button id="btn">JOIN US</button>
        </div>
      </div>
      </div>
    )}
    </>
  )
}

export default WelcomePage
