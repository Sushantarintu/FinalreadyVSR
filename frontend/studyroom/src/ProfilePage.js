import React, { useState,useContext,useEffect ,useMemo} from 'react';
import { StudyContext } from "./Store.js";
import LandingPage from './LandingPage.js';
import logo from './default-profileimg.webp'
import {Avatar} from "@mui/material"
import './profile2.css'
import boyimg from './profilepage-boy-img.jpg'
import axios from 'axios';
import UserEngagement from './UserEngagement.js';

const ProfilePage = () => {
  const [account, setAccount] = useState(false);
  const [isLand,setIsLand]= useState(false)
  const [curuser,setCurUser]=useState({})
  const [allAccounts,setAllAccounts]= useState([])
  const [isSwitching,setIsSwitching]= useState(false)
  const [signedusers,setsignedUsers]= useState([])
  const [isAvatar,setIsavatar]= useState(false)
  const [imageFile, setImageFile] = useState(null);
  const [images, setImages] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLandAllowed,setIslandAllowed]= useState(false)
  // const [allloginers,setAllloginers]= useState([])
  const [selectedOption, setSelectedOption] = useState("default"); // State for selected nav option
  const users = useContext(StudyContext);

  // Load saved user on mount
useEffect(() => {
  const savedUser = localStorage.getItem("loggedInUser");
  if (savedUser) {
    const parsedUser = JSON.parse(savedUser);
    setCurUser(parsedUser);
    users.updateData(parsedUser);  // Optional: only if context needed
  }
}, []);

   useEffect(() => {
          if (users && users.ldata) {
              console.log("Updated curUserData:", users.ldata);
              setCurUser(users.ldata);
              setsignedUsers(users.userData)
              // setAllloginers(users.allLoginers)

               // Store to localStorage
    localStorage.setItem("loggedInUser", JSON.stringify(users.ldata));
          }
      }, [users.ldata]);
      

useEffect(()=>{
  axios.get('https://finalreadyvsr.onrender.com/getloginers')
        .then((res)=>{
          console.log(res.data);
          setAllAccounts(res.data)
        })
        .catch(err => console.error('Error fetching loginers:', err))
},[])

const validUser = useMemo(() => {
  return allAccounts.find(user => user.email === curuser.email);
}, [allAccounts, curuser.email]);

useEffect(() => {
  fetch('https://finalreadyvsr.onrender.com/images')
    .then(res => res.json())
    .then(data => {
      if (data.status === "ok") {
        setImages(data.images);
      }
    })
    .catch(err => console.error('Failed to fetch images:', err));
}, []);

console.log("allaccounts are",allAccounts);

const handleChooseLogin = (index) => {
    const checkUser= allAccounts[index]
    const  matchedUser = signedusers.find(
      (curUser) => curUser.email === checkUser.email && curUser.password === checkUser.password
    );
    if (matchedUser) {
      // axios.post('http://localhost:3009/loginers', matchedUser);
      setIslandAllowed(true);
      users.updateData(matchedUser); 
      localStorage.setItem("loggedInUser", JSON.stringify(matchedUser));
    } else {
      alert('No Such User Exists');
    }
};


const handleUpload = () => {
  const formData = new FormData();
  formData.append('file', imageFile);
  formData.append('email',curuser.email );

  fetch('https://finalreadyvsr.onrender.com/upload-image', {
    method: 'POST',
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      if (data.status === "ok") {
        setCurUser(data.updatedUser);
        localStorage.setItem("loggedInUser", JSON.stringify(data.updatedUser));
        alert('Image uploaded and user updated successfully!');

           // ⬇️ Fetch updated allAccounts from server again
           axios.get('https://finalreadyvsr.onrender.com/getloginers')
           .then((res) => {
             setAllAccounts(res.data);  // <-- This will trigger validUser to recompute
           });

      } else {
        alert('Failed to update user image');
      }
    })
    .catch(err => console.error('Upload failed:', err));
};

const handleFileChange = (e) => {
  const file = e.target.files[0];
  setImageFile(file); // Save the file for upload
  if (file) {
    const imageURL = URL.createObjectURL(file);
    setImagePreview(imageURL); // Set the preview URL
  }
};


const renderContent = () => {
  switch (selectedOption) {
    case "account":
      return (
        <div style={{display:"flex",alignItems:"center",flexDirection:"column",fontSize:"30px",color:"orange"}}>
        
        <div className="profile-info"  style={{textAlign:"center",margin:"10px"}}>
        <span style={{marginBottom:"20px"}}>Account Details</span>
        <Avatar
              className="profile-avatar"
             
              src={
                validUser && validUser.imagePath
                  ? `https://finalreadyvsr.onrender.com/${validUser.imagePath}`
                  // : imagePreview || logo
                  : curuser.imagePath
                  ? `https://finalreadyvsr.onrender.com/${curuser.imagePath}`
                  : logo
              }
              onClick={() => setIsavatar(true)}
              style={{width:"70px",height:'70px', margin: "0 auto", 
                marginBottom: "10px" }}
            />
          <h2>{curuser.name}</h2>
          <h2>{curuser.email}</h2>
          <button className="button">Add Account</button>
        </div>
      </div>
      );
    case "contact":
      return (
        <div>
          {/* <h2>Contact Information</h2>
          <p style={{color:"black"}}>Email: {curuser.email}</p>
          <p>Support: support@example.com</p> */}

          <UserEngagement />
        </div>
      );
    case "logout":
      alert("Your registered email and password will be deleted..")
      try {
        axios.post("https://finalreadyvsr.onrender.com/logout-user",{email:curuser.email})
      } catch (err) {
        console.error('Logout failed:', err);
      }
      window.location.reload();
      break;
    case "switch":
      return (
        <>
        <h1 style={{fontSize:"20px"}}>Choose Account</h1>
        <div className="account-list">
          {allAccounts.map((curloginer, index) => (
            <div key={index} className="account-item" onClick={() => handleChooseLogin(index)}>
              <Avatar src={curloginer.imagePath ? `https://finalreadyvsr.onrender.com/${curloginer.imagePath}` : logo} />
              <div>
                <h2>{curloginer.name}</h2>
                <p>{curloginer.email}</p>
              </div>
            </div>
          ))}
        </div>
        </>
      );
    case "notifications":
      return <h2>Notification Center</h2>;
    default:
      return <img src={boyimg} style={{width:"90%",height:"55vh"}}/>;
  }
};


  return (
    <>
      {isAvatar ? (
        <>
          <div className="image-upload">
            <input accept="image/*" type="file" onChange={handleFileChange} />
            {imageFile === "" || imageFile == null ? "" : (
              <img className="image-preview" src={imagePreview} />
            )}
            <button className="button" onClick={handleUpload}>Upload</button>
          </div>
          <div className="image-gallery">
            {images.map((image, index) => (
              <img
                key={index}
                src={`https://finalreadyvsr.onrender.com/${image.imagePath}`}
                alt={`Uploaded ${index}`}
              />
            ))}
          </div>
          <button className="button" onClick={() => setIsavatar(false)}>Back</button>
        </>
      ) : (isLandAllowed || isLand)  ? (
        <LandingPage />
      ) 
      // : isLand ? (
      //   <LandingPage />
      // ) 
      : (
        <div className="profile-container">
        {/* <div className="upper-img-div" style={{ height: "35vh", border: "1px solid black" }}>
        <button onClick={()=>setIsLand(true)}
              style={{width:"100px",height:"30px",borderRadius:"10px",backgroundColor:"black"}}>Back</button>
        </div> */}

        <div className="middle-div">
          <div className="middle-avatar-div">
          <button onClick={()=>setIsLand(true)}
      style={{
        alignSelf: "flex-start",
        marginBottom: "1rem",
        padding: "0.4rem 1rem",
        backgroundColor: "black",
        color: "white",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
      }}
    >
      Back
    </button>
            <Avatar
              className="profile-avatar"
              src={
                validUser && validUser.imagePath
                  ? `https://finalreadyvsr.onrender.com/${validUser.imagePath}`
                  // : imagePreview || logo
                  : curuser.imagePath
                  ? `https://finalreadyvsr.onrender.com/${curuser.imagePath}`
                  : logo
              }
              onClick={() => setIsavatar(true)}
              style={{width:"70px",height:'70px',marginRight:"20px"}}
            />
            <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
            <h2>{curuser.name}</h2>
            <button  onClick={() => setIsavatar(true)} 
            // style={{width:"100px",height:"30px",borderRadius:"10px",backgroundColor:"lightgreen"}}
            >
              Edit Avatar
            </button>
            </div>
          </div>

          <div className="lower-content-div">
            <div className="nav-options">
              <h2 onClick={() => setSelectedOption("account")} className='badhabe'>Account</h2>
              <h2 onClick={() => setSelectedOption("contact")}>Room Engagement Details</h2>
              <h2 onClick={() => setSelectedOption("logout")}>Logout</h2>
              <h2 onClick={() => setSelectedOption("switch")}>
                Switch Account
              </h2>
              <h2 onClick={() => setSelectedOption("notifications")}>
                Notifications
              </h2>
             
            </div>

            <div className="lower-right-div" style={{  bottom: 0, right: 0, width: "300px", height: "400px"}}>
               <div style={{ overflowY: "auto", height: "95%" }}>
    {renderContent()}
  </div></div>
          </div>
        </div>
          
      </div>
      )}
    </>
  );
};

export default ProfilePage;
