import './Blog.css';
import { useEffect } from 'react';

export default function Blog() {
  useEffect(() => {
    // Debug function to check if images are loading
    const checkImages = () => {
      const abdalradyImg = new Image();
      const shamelImg = new Image();
      
      abdalradyImg.onload = () => console.log('Abdalrady image loaded successfully');
      abdalradyImg.onerror = () => console.error('Error loading Abdalrady image');
      shamelImg.onload = () => console.log('Shamel image loaded successfully');
      shamelImg.onerror = () => console.error('Error loading Shamel image');

      abdalradyImg.src = 'https://res.cloudinary.com/dsobcez1a/image/upload/v1749697049/IMG-20250612-WA0022_mp7k0t.jpg';
      shamelImg.src = 'https://res.cloudinary.com/dsobcez1a/image/upload/v1749696772/IMG-20250611-WA0010_mqbs6l.jpg';
    };

    checkImages();
  }, []);

  return (
    <div className="profile-cards-container">
      {/* Top Row - 3 cards */}
      <div className="top-row">
        <div className="profile-card abdalrady">
          <div className="profile-info">
            <span className="profile-name">ABD-ALRADY</span>
            <span className="profile-role">Frontend Developer</span>
            <div className="profile-extra">Front-End DEV. Skilled in APIs.</div>
          </div>
        </div>
        <div className="profile-card shamel">
          <div className="profile-info">
            <span className="profile-name">SHAMEL</span>
            <span className="profile-role">Machine Learning Engineer</span>
            <div className="profile-extra">Ai Developer.</div>
          </div>
        </div>
        <div className="profile-card magdy">
          <div className="profile-info">
            <span className="profile-name">MAGDY</span>
            <span className="profile-role">Backend Developer</span>
            <div className="profile-extra"></div>
          </div>
        </div>
      </div>

      {/* Bottom Row - 3 cards */}
      <div className="bottom-row">
        <div className="profile-card fathi">
          <div className="profile-info">
            <span className="profile-name">FATHI</span>
            <span className="profile-role">Backend Developer</span>
            <div className="profile-extra">Backend Developer. Node.js.</div>
          </div>
        </div>
        <div className="profile-card samy">
          <div className="profile-info">
            <span className="profile-name">SAMY</span>
            <span className="profile-role">Machine Learning Engineer</span>
            <div className="profile-extra"></div>
          </div>
        </div>
        <div className="profile-card elsaid">
          <div className="profile-info">
            <span className="profile-name">ELSAID</span>
            <span className="profile-role">Frontend Developer</span>
            <div className="profile-extra"></div>
          </div>
        </div>
      </div>
    </div>
  );
}