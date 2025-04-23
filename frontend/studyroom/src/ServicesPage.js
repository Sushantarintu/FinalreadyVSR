import React from 'react';
import './serv.css'; // Link this to the CSS file below

const ServicesPage = () => {
  return (
    <div className='helaau'>
      {/* Hero Section */}
      <section className="services-hero">
        <h1>Our Services</h1>
        <p>Boost your study experience with powerful, smart, and secure virtual tools.</p>
      </section>

      {/* Services List */}
      <section className="services-section">
        <div className="services-grid">
          <div className="service-card">
            <h3>Virtual Study Rooms</h3>
            <p>
              Create secure, distraction-free study rooms. Invite peers and stay focused together with scheduled sessions.
            </p>
          </div>
          <div className="service-card">
            <h3>Speech-to-Text Notes</h3>
            <p>
              Automatically convert spoken words into digital notes in real-time—perfect for lectures and brainstorming.
            </p>
          </div>
          <div className="service-card">
            <h3>Smart Admin Dashboard</h3>
            <p>
              Admins get access to user analytics, engagement reports, and room activity to track productivity.
            </p>
          </div>
          <div className="service-card">
            <h3>Task and Timer Integration</h3>
            <p>
              Set daily goals, track time with Pomodoro sessions, and stay accountable with integrated task management.
            </p>
          </div>
          <div className="service-card">
            <h3>Collaborative Features</h3>
            <p>
              Chat, share notes, and track group progress in shared study rooms—all in real time.
            </p>
          </div>
          <div className="service-card">
            <h3>Privacy & Security</h3>
            <p>
              Only admins can create and control rooms. Your sessions are secure, encrypted, and invite-only.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="serv-footer">
        <p>&copy; 2025 Virtual Study Room. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ServicesPage;
