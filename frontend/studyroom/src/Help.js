import React from 'react';

const Help = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 bg-white rounded-xl shadow-lg">
      <h1 className="text-4xl font-bold text-blue-700 text-center mb-8">📚 GrStudyPage: How to Create and Join a Room</h1>
      
      <p className="text-lg text-gray-700 mb-6">
        Welcome to <span className="font-semibold text-blue-600">GrStudyPage</span>! This guide will walk you through the steps of creating a study room, joining one, and exploring all the powerful features that enhance your study sessions.
      </p>

      {/* Step 1 */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-purple-700 mb-3">🧭 Step 1: Access the GrStudyPage</h2>
        <p className="text-base text-gray-800">
          After logging in, you'll land on the homepage. This gives you options to either create or join a room.
        </p>
      </section>

      {/* Step 2 */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-purple-700 mb-3">🛠️ Step 2: Create a Room (Admin)</h2>
        <ul className="list-disc list-inside text-base text-gray-800 space-y-2">
          <li className='kalkarbe'><span className="text-blue-600 font-medium">Location:</span> Top-right corner of the page.</li>
          <li className='kalkarbe'>Click the <span className="text-green-700 font-semibold">"Create Room"</span> button to open the form.</li>
          <li className='kalkarbe'><span className="font-medium">Room ID:</span> Generated automatically by the system.</li>
          <li className='kalkarbe'><span className="font-medium">Set Timer:</span> Select room duration. After time ends, all users will be disconnected.</li>
          <li className='kalkarbe'>Click <span className="text-green-700 font-semibold">"Create Room"</span> to finalize setup.</li>
          <li className='kalkarbe'>Copy and share the unique <span className="text-blue-600 font-medium">Room Link</span>.</li>
        </ul>
      </section>

      {/* Step 3 */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-purple-700 mb-3">🚪 Step 3: Join a Room (Participants)</h2>
        <ul className="list-disc list-inside text-base text-gray-800 space-y-2">
          <li className='kalkarbe'><span className="text-blue-600 font-medium">Location:</span> Beside the "Create Room" button.</li>
          <li className='kalkarbe'>Click the <span className="text-green-700 font-semibold">"Join Room"</span> button.</li>
          <li className='kalkarbe'>Set your <span className="font-medium">username</span> (only valid inside that room).</li>
          <li className='kalkarbe'>Click <span className="text-green-700 font-semibold">"Join"</span> at the bottom to enter the room.</li>
        </ul>
      </section>

      {/* Step 4 */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-purple-700 mb-3">✨ Step 4: Room Features and Interactions</h2>
        <ol className="list-decimal list-inside text-base text-gray-800 space-y-2">
          <li className='kalkarbe'><span className="font-medium text-blue-700">Video & Audio:</span> Real-time communication for discussions.</li>
          <li className='kalkarbe'><span className="font-medium text-blue-700">Screen Sharing:</span> Present your work visually.</li>
          <li className='kalkarbe'><span className="font-medium text-blue-700">Whiteboard:</span> Collaborate in real-time using drawings or notes.</li>
          <li className='kalkarbe'><span className="font-medium text-blue-700">Messaging:</span> Instant text communication with users.</li>
          <li className='kalkarbe'><span className="font-medium text-blue-700">Online Search:</span> Find study info without leaving the platform.</li>
          <li className='kalkarbe'><span className="font-medium text-blue-700">File/PDF Sharing:</span> Share study resources quickly.</li>
        </ol>
      </section>

      {/* Step 5 */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-purple-700 mb-3">👨‍🏫 Step 5: Admin's Role in the Room</h2>
        <p className="text-base text-gray-800 mb-2">
          Admins can view detailed user engagement analytics:
        </p>
        <ul className="list-disc list-inside text-base text-gray-800 space-y-1">
          <li className='kalkarbe'>Number of active events</li>
          <li className='kalkarbe'>User points earned</li>
          <li className='kalkarbe'>Types of events participated in</li>
        </ul>
      </section>

      {/* Step 6 */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-purple-700 mb-3">🔗 Step 6: Share the Room Link</h2>
        <ul className="list-disc list-inside text-base text-gray-800 space-y-2">
          <li className='kalkarbe'><span className="font-medium ">Find the Link:</span> Visible at the top-left of the room.</li>
          <li className='kalkarbe'><span className="font-medium " >Share:</span> Send the link to invite others.</li>
        </ul>
      </section>
    </div>
  );
};

export default Help;
