import React from 'react';
import VisitNavbar from './VisitNavBar';
import { useState, useEffect } from 'react';

const About = () => {

    const [navColor, setnavColor] = useState("transparent");
    const listenScrollEvent = () => {
      window.scrollY > 10 ? setnavColor("#1e2939") : setnavColor("transparent");
    };
    useEffect(() => {
      window.addEventListener("scroll", listenScrollEvent);
      return () => {
        window.removeEventListener("scroll", listenScrollEvent);
      };
    }, []);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-gray-800"
        style={{
          backgroundColor: navColor,
          transition: "all 1s"
        }}><VisitNavbar /></nav>

      <div className='fixed h-auto h-screen w-screen top-0 py-70 items-center justify-center bg-gray-800'>
        <h1>Sobre</h1>
      </div>
    </>
  );
}
export default About;