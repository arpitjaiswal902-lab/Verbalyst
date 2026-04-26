tsx
import React from 'react';
import './index.css'; // Make sure your God-Mode CSS is in this file

function App() {
  return (
    <div className="landing-container">
      {/* --- LEFT SIDE: THE MARKETING HERO --- */}
      <section className="hero-content">
        <div className="badge">We improvise on feedbacks</div>
        <h1 className="hero-title">
          Land Your Dream Role. <br />
          <span className="gradient-text">Master the Interview.</span>
        </h1>
        <p className="hero-subtitle">
          Get AI-powered feedback, real-world mock interviews, and personalized coaching to ace your next tech interview.
        </p>
        
        <div className="social-proof">
          <p>TRUSTED BY CANDIDATES AT</p>
          <div className="logo-grid">
            <span>Google</span> <span>Meta</span> <span>Stripe</span> <span>Amazon</span>
          </div>
        </div>
      </section>

      {/* --- RIGHT SIDE: THE LOGIN BOX --- */}
      <section className="auth-section">
        <div className="ai-god-card">
          <h2 className="login-title">Welcome Back</h2>
          
          <div className="form-wrapper">
             {/* Replace this with your actual Login Component or Firebase Form */}
             <button className="google-btn">
                Continue with Google
             </button>
             
             <div className="divider">OR</div>
             
             <input type="email" placeholder="Email Address" className="form-input" />
             <input type="password" placeholder="Password" className="form-input" />
             
             <button className="continue-btn">
                Continue
             </button>
          </div>
          
          <p className="terms-text">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </section>
    </div>
  );
}

export default App;
