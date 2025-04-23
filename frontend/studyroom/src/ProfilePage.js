import React, { useState,useContext,useEffect ,useMemo} from 'react';
import { StudyContext } from "./Store.js";
import LandingPage from './LandingPage.js';
import logo from './default-profileimg.webp'
import {Avatar} from "@mui/material"
import './profile2.css'
import boyimg from './profilepage-boy-img.jpg'
import axios from 'axios';

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

   useEffect(() => {
          if (users && users.ldata) {
              console.log("Updated curUserData:", users.ldata);
              setCurUser(users.ldata);
              setsignedUsers(users.userData)
              // setAllloginers(users.allLoginers)
          }
      }, [users.ldata]);
      

useEffect(()=>{
  axios.get('https://virtualstudyroom2.onrender.com/getloginers')
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
  fetch('https://virtualstudyroom2.onrender.com/images')
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

    } else {
      alert('No Such User Exists');
    }
};


const handleUpload = () => {
  const formData = new FormData();
  formData.append('file', imageFile);
  formData.append('email',curuser.email );

  fetch('https://virtualstudyroom2.onrender.com/upload-image', {
    method: 'POST',
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      if (data.status === "ok") {
        setCurUser(data.updatedUser);
        alert('Image uploaded and user updated successfully!');
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
        <div >
          Account Details
        <div className="profile-info">
          <h2>{curuser.name}</h2>
          <h2>{curuser.email}</h2>
          <button className="button">Add Account</button>
        </div>
      </div>
      );
    case "contact":
      return (
        <div>
          <h2>Contact Information</h2>
          <p>Email: {curuser.email}</p>
          <p>Support: support@example.com</p>
        </div>
      );
    case "logout":
      return <h2>You have been logged out.</h2>;
    case "switch":
      return (
        <>
        <h1 style={{fontSize:"20px"}}>Choose Account</h1>
        <div className="account-list">
          {allAccounts.map((curloginer, index) => (
            <div key={index} className="account-item" onClick={() => handleChooseLogin(index)}>
              <Avatar src={curloginer.imagePath ? `https://virtualstudyroom2.onrender.com/${curloginer.imagePath}` : logo} />
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
                src={`https://virtualstudyroom2.onrender.com/${image.imagePath}`}
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
                  ? `https://virtualstudyroom2.onrender.com/${validUser.imagePath}`
                  : imagePreview || logo
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
              <h2 onClick={() => setSelectedOption("contact")}>Contact</h2>
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
