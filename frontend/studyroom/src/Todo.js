import React, { useEffect, useState,useContext } from 'react';
import axios from 'axios';
import './todo.css'
import LandingPage from './LandingPage';
import { StudyContext } from "./Store.js";

const Todo = () => {
    const [task, setTask] = useState('');
    const [allTasks, setAllTasks] = useState([]);
    const [back,setIsBack]= useState(false);
      const users = useContext(StudyContext);
    const [curtaskfetcher,setCurTaskFetcher]= useState('')

    // Fetch tasks from backend on component mount
    useEffect(() => {
        if (curtaskfetcher) {
            fetchTasks();
        }
    }, [curtaskfetcher]);
    // useEffect(() => {
    //         fetchTasks();       
    // }, []);
    
    useEffect(() => {
              if (users && users.ldata) {
                console.log("this is CurTaskFetcher",users.ldata.email)
                setCurTaskFetcher(users.ldata.email)
              }
          }, [users.ldata]);
          const fetchTasks = () => {
            axios.get("https://finalreadyvsr.onrender.com/getTasks")
                .then((res) => {
                    const validData = res.data.filter((task) => task.temail === curtaskfetcher);
                    setAllTasks(validData);
                })
                .catch((err) => console.log(err));
        };

    // Add task to backend
    const handleAdd = () => {
        if (task.trim() === '') return; // Avoid empty tasks

        axios.post("https://finalreadyvsr.onrender.com/tasks", { task,temail:curtaskfetcher })
            .then((res) => {
                console.log(res.data.message);
                setAllTasks([...allTasks, res.data.task]); // Add task to list
                setTask(''); // Clear input field
            })
            .catch((err) => console.log(err));
    };

    // Delete task from backend and update frontend
    const handleDel = (id) => {
        axios.delete(`https://finalreadyvsr.onrender.com/deleteTask/${id}`)
            .then((res) => {
                console.log(res.data.message);
                setAllTasks(allTasks.filter(task => task._id !== id)); // Remove from UI
            })
            .catch((err) => console.log(err));
    };

    // console.log("alltasks are",allTasks);
    
    return (
        <>
        {back ? (
            <LandingPage/>
            ):(
                <div className="todo-container">
            <h1 className="todo-title">Todo List</h1>
            <div className="input-section">
                <input
                    type='text'
                    placeholder='Input Task'
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                />
                <button onClick={handleAdd}>Add</button>
            </div>
            <h2 className="task-list-title">Task List</h2>
            {allTasks.length === 0 && <p className="no-task">No tasks available.</p>}
            {allTasks.map((curtask, index) => (
                <div key={curtask._id} className="task-item">
                    <span>{index + 1}. {curtask.name}</span>
                    <button onClick={() => handleDel(curtask._id)}>Delete</button>
                </div>
            ))}
            <button onClick={()=>setIsBack(true)}>Back</button>
        </div>
            )}
            </>
    );
    
};

export default Todo;
