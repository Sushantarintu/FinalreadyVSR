import React, { createContext, useState, useEffect,useMemo } from 'react';
import axios from 'axios';

export const StudyContext = createContext();

export const MyProvider = ({ children }) => {
  const [ldata, setLData] = useState({user:'def',name:'guest'});
  const [examinerData, setExaminerData] = useState({});
  const [userData, setUserData] = useState([]);
  const [GRData, setGRData] = useState([]);
  const [curauth,setCurAuth]= useState({})

  useEffect(() => {
    let isMounted = true;
    axios.get('https://virtualstudyroom2.onrender.com/getUserData')
      .then((userdata) => {
        if (isMounted) setUserData(userdata.data);
      })
      .catch((err) => console.log(err));

    axios.get('https://virtualstudyroom2.onrender.com/getGrData')
      .then((grData) => {
        if (isMounted) setGRData(grData.data);
      })
      .catch((err) => console.log(err));


          // axios.get('http://localhost:3009/getloginers')
          // .then((res)=>{
          //   setAllLoginers(res.data)
          // })
          // .catch((err)=>{
          //     console.log(err)
          // })


    return () => {
      isMounted = false;
    };
  }, []);


  // const updateData = (newData) => {
  //   console.log("Previous data in context:", ldata);
  //   // setLData((prevData) => {
  //   //   const updatedData = { ...prevData, ...newData };
  //   //   console.log("Updated context data:", updatedData);
  //   //   return updatedData;
  //   // });
  //   axios.post('http://localhost:3009/curloginer', newData);
  // };

  const updateData = async (newData) => {
    try {
      console.log("Previous data in context:", ldata);
      await axios.post('https://virtualstudyroom2.onrender.com/curloginer', newData);
      console.log("Data sent successfully.");
  
      // Fetch the updated current user data after posting
      const response = await axios.get('https://virtualstudyroom2.onrender.com/getCuruserData');
      setLData(response.data);
      console.log("Fetched updated curUserData:", response.data);
  
    } catch (err) {
      console.log("Error updating data:", err);
    }
  };
  
const updateauthdata= async(newdata)=>{
  try{
    setCurAuth(newdata)
  }catch(err){
    console.log("ERROR",err);
    
  }
}
  // useEffect(()=>{
  //   let isMounted = true;
  //   axios.get('http://localhost:3009/getCuruserData')
  //   .then((curUserData) => {
  //     if (isMounted) {
  //       console.log("Fetched curUserData:", curUserData.data);
  //       setLData(curUserData.data);
  //     }
  //   })
  //   .catch((err) => console.log(err));
  //   return () => {
  //     isMounted = false;
  //   };
  // },[])

  const updateExaminerData =(newData)=>{
    setExaminerData((prevData) => {
      const updatedData = { ...prevData, ...newData };
      console.log("Updated examiner data:", updatedData);
      return updatedData;
    });
  }

  // console.log("Updated data is mine",ldata);
  
  // const appendData = (additionalData) => {
  //   setLData((prevData) => ({
  //     ...prevData,
  //     ...additionalData
  //   }));
  // };


  const contextValue = useMemo(
    () => ({ userData, GRData, updateData,examinerData,updateExaminerData,ldata,updateauthdata,curauth }),
    [userData, GRData,examinerData,ldata,curauth]
  );

  return (
    <StudyContext.Provider value={contextValue}>
      {children}
    </StudyContext.Provider>
  );
};

