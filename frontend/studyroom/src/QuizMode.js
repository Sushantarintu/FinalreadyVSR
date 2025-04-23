import React, { useState, useEffect, useContext,useRef } from 'react';
import { StudyContext } from "./Store.js";
import axios from 'axios';
import LeaderBoard from './LeaderBoard.js'
import formimg from './exam-form.jpg'
import './quizMode.css'; // Import the CSS file
import LandingPage from './LandingPage.js';

const Timer = ({ timeLeft }) => (
  <div>Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}s</div>
);

const QuizMode = () => {
  const { ldata,updateExaminerData,examinerData } = useContext(StudyContext);
  const [back,setIsBack]= useState(false)
  const timerIdRef = useRef(null); // Keep track of the timer
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [correctPoint, setCorrectPoint] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0); // Initialize timer with zero
  const [loginer, setLoginer] = useState({});
  const [saveMsg, setSavemsg] = useState('');
  const [examinerSet,setExaminerSet]= useState('')
  const [isleaderBoard,setIsLeaderBoard]=useState(false)
  const [examiner, setExaminer] = useState({
    ename: '',
    eemail: '',
    ephno: '',
    eregd: '',
    correctPoint: 0,
  });
  const [queSettingId, setQueSettingId] = useState('');
  const [subject, setSubject] = useState('');
  const [isStExam, setIsStExam] = useState(false);
  // const [examDuration, setExamDuration] = useState(5); // Default duration in minutes

  useEffect(() => {
    if (Object.keys(ldata).length > 0) {
      setLoginer(ldata);
    }
  }, [ldata]);

  useEffect(() => {
    let isMounted = true;
    axios
      .get('https://virtualstudyroom2.onrender.com/getquizques')
      .then((quizdata) => {
        if (isMounted) setQuizQuestions(quizdata.data);
      })
      .catch((err) => {
        console.log(err.message);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (isStExam && timeLeft > 0) {
      timerIdRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (isStExam && timeLeft <= 0) {
      alert('Time is up! Submitting your exam.');
      handleSubmitExam();
    }
    return () => clearTimeout(timerIdRef.current); // Clear the timer
  }, [timeLeft, isStExam]);
  

  const isExaminerValid = () => {
    return examiner.ename && examiner.eemail && examiner.ephno && examiner.eregd;
  };

  // const handleStartExam = () => {
  //   if (isExaminerValid()) {
  //     if (quizQuestions.length > 0) {
  //       setIsStExam(true);
  //       const examDurationInSeconds = quizQuestions[0].examDuration * 60; // Assuming all questions share same duration
  //       setTimeLeft(examDurationInSeconds);
  //     } else {
  //       alert("No quiz questions available!");
  //     }
  //   } else {
  //     alert('Please fill all details before starting the exam.');
  //   }
  // };

  const handleStartExam = () => {
    if (!isExaminerValid()) {
      alert('Please fill all details before starting the exam.');
      return;
    }

    const filteredQuestions = quizQuestions.filter(q => q.queSettingId === queSettingId
      && q.topicName === subject
    );
    
    if (filteredQuestions.length > 0) {
      setQuizQuestions(filteredQuestions);
      setIsStExam(true);
      setTimeLeft(filteredQuestions[0].examDuration * 60);
    } else {
      alert("Invalid Question Setting ID! Please enter a valid one.");
    }
  };
  const handleChange = (e) => {
    setExaminer({ ...examiner, [e.target.name]: e.target.value });
  };


  const handleOptionChange = (event) => {
    const updatedOptions = [...selectedOptions];
    updatedOptions[currentIndex] = event.target.value;
    setSelectedOptions(updatedOptions);
  };

  const handleSave = () => {
    if (selectedOptions[currentIndex] === quizQuestions[currentIndex].rightans) {
      setCorrectPoint((prev) => {
        const updatedPoints = prev + 1;
        setExaminer((prevExaminer) => ({
          ...prevExaminer,
          correctPoint: updatedPoints,
        }));
        return updatedPoints;
      });
    }
    setSavemsg("Saved");
  };
  const handleSaveNext = () => {
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setSavemsg("");
    } else {
      alert('You have completed the quiz!');
      handleSubmitExam();
      setIsLeaderBoard(true)
    }
  };

  const handleSubmitExam = () => {
    clearTimeout(timerIdRef.current); // Clear the timer
    setIsStExam(false); // Stop the exam mode
    console.log("Exam submitted successfully.");

    const finalExaminer = { ...examiner, subject };
    console.log('Final Examiner Data:', finalExaminer);
    
    updateExaminerData(examiner)
    axios.post("http://localhost:10000/examinerdata2", finalExaminer)
      .then((res) => {
        console.log(res.data.message);
      })
      .catch((err) => {
        console.error("Error during API request:", err);
        alert("Failed to submit data. Please try again later.");
      });
  };
  

  return (
    <>
    {back ? (
      <LandingPage/>
      ):isleaderBoard?(
      <LeaderBoard />
    ):
    isStExam ? (
      <div className='jabe'>
      <div className="quiz-container">
        <h1>Quiz</h1>
        {quizQuestions.length > 0 && (
          <div>
            <div className="quiz-topic">
              <h2>{quizQuestions[currentIndex].topicName}</h2>
            </div>
            <div className="question-header">
              <h3>
                Question {currentIndex + 1}/{quizQuestions.length}
              </h3>
            </div>
            <h2 className="quiz-question">
              Q{currentIndex + 1}. {quizQuestions[currentIndex].question}
            </h2>
            <Timer timeLeft={timeLeft} />

            <div className="quiz-options">
              {quizQuestions[currentIndex].options.map((option, ind) => (
                <div className="quiz-option" key={ind}>
                  <label>
                    <input
                      type="radio"
                      name="quiz-option"
                      value={option}
                      checked={selectedOptions[currentIndex] === option}
                      onChange={handleOptionChange}
                    />
                    {option}
                  </label>
                </div>
              ))}
            </div>
            <button className="next-button" onClick={handleSave} disabled={saveMsg === "Saved"}>Save</button>
            <button className="next-button" onClick={handleSaveNext}
              disabled={!selectedOptions[currentIndex]}
            >
              Next
            </button>
          </div>
        )}
        {/* <div>Welcome, {examinerData.name}!</div> */}
        <h2 style={{ color: 'green' }}>{saveMsg}</h2>
      </div>
      </div>
    ) : (
      <div className='sidekune'>
      <div className='mocontainer'>
      <div className='left-inp-div'>
        <input
          type='text'
          placeholder='Enter Full Name'
          name='ename'
          value={examiner.ename}
          onChange={handleChange}
        />
        <input
          type='text'
          placeholder='Email Id'
          name='eemail'
          value={examiner.eemail}
          onChange={handleChange}
        />
        <input
          type='text'
          placeholder='Phone no.'
          name='ephno'
          value={examiner.ephno}
          onChange={handleChange}
        />
        <input
          type='text'
          placeholder='Regd No.'
          name='eregd'
          value={examiner.eregd}
          onChange={handleChange}
        />
         <input
                type='text'
                placeholder='Enter Question ID'
                value={queSettingId}
                onChange={(e) => setQueSettingId(e.target.value)}
              />
               <input
                type='text'
                placeholder='Enter Subject'
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
               <input
                type='text'
                placeholder='Enter examiner set'
                name='examinerset'
                value={examiner.examinerSet}
                onChange={handleChange}
              />
        <button onClick={handleStartExam} className='mobutton'>Start Exam</button>
        <button onClick={()=>setIsBack(true)} className='mobutton'>Back</button>
      </div>
      <div className='right-im-div'>
          <img src={formimg}/>
        </div>
      </div>
      {/* <a href='/leaderboard'>Leaderboard</a> */}
      </div>
    )}
    </>
  );
};

export default QuizMode;
