import React, { useContext, useState } from 'react';
import axios from 'axios';
import './leaderbrd.css';
import { StudyContext } from "./Store.js";

const LeaderBoard = () => {
  const { ldata } = useContext(StudyContext);
  const [examinerRes, setExaminerRes] = useState([]);
  const [examinerSet, setExaminerSet] = useState(''); // Stores user input
  const [isShowRes, setIsShowRes] = useState(false);
  const [topic,setTopic]= useState('')

  const handleSearch = () => {
    axios
      .get("https://readyvsr.onrender.com/getexaminerdata2") // Fetch all data
      .then((response) => {
        // console.log("Backend Data Sample:", response.data.slice(0, 5)); // Log first 5 records for debugging

        // Log examinerSet values to check for missing ones
        // response.data.forEach(examiner => {
        //   console.log(`Examiner Set in Data: '${examiner.examinerset}'`);
        // });

        // Filter records where `examinerSet` exists and matches input
        const filteredData = response.data.filter(examiner => 
          examiner.examinerset && // Ensure the field exists
          examiner.examinerset.trim().toLowerCase() === examinerSet.trim().toLowerCase() && examiner.subject === topic
        );

        console.log("Filtered Data:", filteredData); // Debug filtered results

        // Sort filtered data by `correctPoint` in descending order
        const sortedData = filteredData.sort((a, b) => b.correctPoint - a.correctPoint);

        setExaminerRes(sortedData);
        setIsShowRes(true);
      })
      .catch((error) => {
        console.error("Error fetching examiner data:", error);
      });
  };

  return (
    <div className='mobody'>
      {isShowRes ? (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Email</th>
              <th>Correct Points</th>
            </tr>
          </thead>
          <tbody>
            {examinerRes.map((examiner, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{examiner.ename}</td>
                <td>{examiner.eemail}</td>
                <td>{examiner.correctPoint}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="leaderboard-container">
          <h1 className='moh1'>Leaderboard</h1>
          <input
            type="text"
            placeholder="Enter examiner set"
            value={examinerSet}
            onChange={(e) => setExaminerSet(e.target.value)} // Store input in state
          />
          <input
            type="text"
            placeholder="Enter topic name"
            value={topic}
            onChange={(e) => setTopic(e.target.value)} // Store input in state
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      )}
    </div>
  );
};

export default LeaderBoard;
