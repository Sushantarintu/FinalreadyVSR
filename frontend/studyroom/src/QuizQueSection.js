// import console from 'console';
import axios from 'axios';
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './quizque.css';

const QuizQueSection = () => {
  const [subname, setSubName] = useState('');
  const [que, setQue] = useState('');
  const [rightans, setRightAns] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [examDuration, setExamDuration] = useState(5);
  const [queSettingId, setQueSettingId] = useState(''); // User can enter or generate

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const generateRandomId = () => {
    setQueSettingId(uuidv4()); // Generate a new unique ID
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!queSettingId) {
      alert('Please enter or generate a unique Question Setting ID!');
      return;
    }

    const dataToSend = {
      queSettingId: queSettingId, // Include user-defined or generated ID
      topicName: subname,
      question: que,
      options: options,
      rightans: rightans,
      examDuration: examDuration,
    };

    console.log(dataToSend);

    axios.post('https://readyvsr.onrender.com/quizdata', dataToSend)
      .then((res) => {
        console.log(res.data.message);
        setSubName('');
        setQue('');
        setRightAns('');
        setOptions(['', '', '', '']);
        setExamDuration(5);
        setQueSettingId(''); // Clear the ID so the user can enter a new one
      })
      .catch((err) => {
        console.error('Error saving quiz data:', err);
      });
  };

  return (
    <div className="quizque-container">
       {/* Question Setting ID */}
      <div className="id-container">
        <input
          type='text'
          className='quiz-input'
          placeholder='Enter or Generate ID'
          value={queSettingId}
          onChange={(e) => setQueSettingId(e.target.value)}
        />
        <button className="quiz-btn" onClick={generateRandomId}>Generate ID</button>
      </div>
      <input
        type='text'
        className='quiz-input quiz-topic-input'
        placeholder='Enter subject'
        value={subname}
        onChange={(e) => setSubName(e.target.value)}
      />
      <h2 className="quiz-header">Question 1</h2>
      <input
        type='text'
        className='quiz-input'
        placeholder='Set Your Question'
        value={que}
        onChange={(e) => setQue(e.target.value)}
      />
      <h2 className="quiz-header">Options</h2>
      <div className="option-group">
        {options.map((option, index) => (
          <input
            key={index}
            type='text'
            className='quiz-input'
            placeholder={`Option ${index + 1}`}
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
          />
        ))}
      </div>
      <div className="right-answer-section">
        <h3 className="quiz-subheader">Do You Want to set the right answer here or check it manually</h3>
        <input
          type='text'
          className='quiz-input quiz-right-ans-input'
          placeholder='Set right answer'
          value={rightans}
          onChange={(e) => setRightAns(e.target.value)}
        />
      </div>
      <input
        type='number'
        className='quiz-input quiz-right-ans-input'
        placeholder='Exam Duration (minutes)'
        value={examDuration}
        onChange={(e) => setExamDuration(Number(e.target.value))}
      />
      

      <div className="button-group">
        <button className="quiz-btn" onClick={handleSave}>Save</button>
        <button className="quiz-btn">Previous</button>
        <button className="quiz-btn">Set More</button>
      </div>
    </div>
  );
};

export default QuizQueSection;
