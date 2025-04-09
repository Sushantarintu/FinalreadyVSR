import React, { useContext, useEffect, useState } from "react";
import { StudyContext } from "./Store.js";
import axios from "axios";
// import GroupChatting from "./GroupChatting.js";

const GroupCreation = ({ builder }) => {
  const users = useContext(StudyContext); // Assuming this is an array of user objects
  const [gname, setGname] = useState("");
  const [gcap, setGcap] = useState("");
  const [group, setGroup] = useState(null);
  const [grmems, setGrmems] = useState([]);
  const [actGrmems, setActGrmems] = useState([]); // Active group members
  const [ismems, setIsMems] = useState(false);
  const [avlGrps, setAvlGrps] = useState([]);
  const [isShowGr, setIsShowGr] = useState(false);

  useEffect(() => {
    if (Array.isArray(users.userData) && Array.isArray(users.GRData)) {
      setGrmems(users.userData); // Set available members
      setAvlGrps(users.GRData); // Set available groups
    } else {
      console.warn("Users from StudyContext is not an array:", users);
    }
  }, [users]);

  const handleCreate = () => {
    if (!gname.trim() || !gcap.trim()) {
      alert("Please fill in all group details.");
      return;
    }
  
    if (actGrmems.length === 0) {
      alert("Please add members to the group.");
      return;
    }
  
    console.log("Active gr members are:-",actGrmems);
    
    const newGroup = {
      gname,
      gcapacity: Number(gcap),
      builder,
      gdate: new Date().toISOString(),
      grmembers: actGrmems.map((mem) => mem.name), // Ensure this is populated
    };
  
    console.log("New Group:", newGroup);  // Log to check if grmembers are populated
  
    axios
      .post("https://virtualstudyroom2.onrender.com", newGroup)
      .then((res) => console.log(res.message))
      .catch((err) => console.log(err));
    
    setGroup(newGroup);
    alert("Group created successfully!");
    setGname("");
    setGcap("");
  };
  

  const handlememlist = (index) => {
    const selectedMember = grmems[index];
    console.log("Selected Member:", grmems[index]);

  
    setActGrmems((prev) => {
      // Check for duplicates in the latest state
      // if (prev.some((mem) => mem.id === selectedMember.id)) {
      //   console.log("Member already added:", selectedMember);
      //   return prev; // Return the previous state unchanged
      // }
  
      const updatedMembers = [...prev, selectedMember];
      console.log("Updated Active Members:", updatedMembers); // Debug the new state
      return updatedMembers; // Return the new state with the added member
    });
 
  };

  useEffect(() => {
    console.log("Active gr members changed:", actGrmems);
  }, [actGrmems]);
  

  // const handleTarget = (idx) => {
  //   alert(`Group ${idx} selected.`);
  //   setIsChat(true);
  // };

  return (
    <>
     {ismems ? (
        <div>
          <h4>Available Members</h4>
          <ul>
            {grmems.map((curmem, index) => (
              <li
                key={index}
                style={{
                  border: "1px solid black",
                  padding: "5px",
                  margin: "5px 0",
                  cursor: "pointer",
                }}
                onClick={() => handlememlist(index)}
              >
                {curmem.name || "Unnamed Member"}
              </li>
            ))}
          </ul>
          <button onClick={() => setIsMems(false)}>Done Adding Members</button>
        </div>
      ) : isShowGr ? (
        <div>
          <h2>Groups</h2>
          <ul>
            {avlGrps.map((curGr, index) => (
              <li key={index} >
                {curGr.gname}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <h3>Create a Group</h3>
          <input
            type="text"
            value={gname}
            onChange={(e) => setGname(e.target.value)}
            placeholder="Group Name"
          />
          <input
            type="text"
            value={gcap}
            onChange={(e) => setGcap(e.target.value)}
            placeholder="Group Capacity"
          />
          <div>
            <button onClick={() => setIsMems(true)}>Show Members</button>
          </div>
          <button onClick={handleCreate}>Create Group</button>
          <button onClick={() => setIsShowGr(true)}>Show Current Groups</button>

          {group && (
            <div>
              <h4>Group Details</h4>
              <p>
                <strong>Name:</strong> {group.gname}
              </p>
              <p>
                <strong>Capacity:</strong> {group.gcapacity}
              </p>
              <p>
                <strong>Builder:</strong> {group.builder}
              </p>
              <p>
                <strong>Members:</strong>{" "}
                {group.grmembers.map((mem, index) => (
                  <span key={index}>{mem} </span>
                ))}
              </p>
            </div>
          )}
        </div>
      )}
      <a href="/grchat">Group Chatting</a>
    </>
  );
};

export default GroupCreation;


