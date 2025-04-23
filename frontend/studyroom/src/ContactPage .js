import React, { useState } from 'react';
import './contact.css'; // Link to the CSS file below
import axios from 'axios';

const ContactPage = () => {
const [repName,setRepName]= useState('')
const [repemail,setRepemail]= useState('')
const [repmsg,setRepMsg]= useState('')


const handlrepsubmit=()=>{
    const repdata={
        repName:repName,
        repemail:repemail,
        repmsg:repmsg
    }
    axios.post("http://localhost:10000/report",repdata)
    .then((res)=>{
        console.log(res)
        if(res.data.message === "Your response has been saved "){
            alert("Your response has been saved ")
        }
    })
    .catch((err)=>{
        console.log(err);      
    })
}
  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <h1>Contact Us</h1>
        <p>We’d love to hear from you! Reach out with questions, feedback, or support inquiries.</p>
      </section>

      {/* Contact Form Section */}
      <section className="contact-container">
        <div className="contact-form">
          <h2>Send us a message</h2>
          <form>
            <label htmlFor="name">Your Name</label>
            <input type="text" id="name" name="name" placeholder="Enter your name" required onChange={(e)=>setRepName(e.target.value)}/>

            <label htmlFor="email">Your Email</label>
            <input type="email" id="email" name="email" placeholder="Enter your email" required onChange={(e)=>setRepemail(e.target.value)}/>

            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" placeholder="Write your message..." rows="5" required onChange={(e)=>setRepMsg(e.target.value)}></textarea>

            <button type="submit" onClick={handlrepsubmit}>Send Message</button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="contact-info">
          <h2>Get in Touch</h2>
          <p className='kalakare'><strong>Email:</strong> support@virtualstudyroom.com</p>
          <p className='kalakare'><strong>Phone:</strong> +123 456 7890</p>
          <p className='kalakare'><strong>Address:</strong> Kathmandu, Nepal</p>
          <p className='kalakare'>Feel free to reach out to us anytime. We typically respond within 24 hours.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="con-footer">
        <p>&copy; 2025 Virtual Study Room. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ContactPage;
