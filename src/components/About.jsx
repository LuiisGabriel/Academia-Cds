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
      <div className='bg-gray-800 h-auto min-h-screen'>

        <nav className="sticky top-0 z-50 bg-gray-800"
          style={{
            backgroundColor: navColor,
            transition: "all 1s"
          }}><VisitNavbar /></nav>

        <div className='flex justify-center items-center h-170 gap-16'>

        </div>
      </div>
    </>
  );
}
export default About;