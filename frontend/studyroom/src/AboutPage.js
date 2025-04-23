import React from 'react';
import './about.css'; // Make sure this path matches your project structure

const AboutPage = () => {
  return (
    <div className='badhia'>
      {/* Hero Section */}
      <section className="hero">
        <h1>About Virtual Study Room</h1>
        <p>
          Empowering your study sessions with focus, collaboration, and intelligent insights.
        </p>
      </section>

      {/* About Section */}
      <section className="about">
        <h2>Our Mission</h2>
        <p>
          The Virtual Study Room is designed to create a distraction-free digital space for students and learners.
          Whether you're studying solo or in a group, our platform supports your goals by enabling speech-to-text
          note taking, real-time collaboration, and powerful engagement analytics for admins.
        </p>
      </section>

      {/* Highlights Section */}
      <section className="highlights">
        <h2>Why Choose Us?</h2>
        <div className="highlights-grid">
          <div className="card">
            <h3>Smart Admin Dashboard</h3>
            <p>
              Admins can track user engagement and session activity to better understand productivity patterns.
            </p>
          </div>
          <div className="card">
            <h3>Speech-to-Text Integration</h3>
            <p>
              Capture your thoughts effortlessly—our speech-to-text helps you focus on ideas, not typing.
            </p>
          </div>
          <div className="card">
            <h3>Secure Study Rooms</h3>
            <p>
              Only admins can create rooms and share access, ensuring a safe and focused study environment.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mo-footer">
        <p>&copy; 2025 Virtual Study Room. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AboutPage;
