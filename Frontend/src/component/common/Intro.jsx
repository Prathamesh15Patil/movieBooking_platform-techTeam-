import { useEffect, useRef } from "react";
import gsap from "gsap";
import Aurora from "./Aurora";
import "./Intro.css";

function Intro({ onComplete }) {
  const introRef = useRef(null);
  const textRef = useRef(null);
  const timelineRef = useRef(null);

  const handleFinish = () => {
    if (timelineRef.current) {
      timelineRef.current.kill();
    }
    if (onComplete) {
      onComplete();
    }
  };

  useEffect(() => {
    const letters = textRef.current.querySelectorAll(".letter");

    const timeline = gsap.timeline({
      onComplete: handleFinish,
    });
    timelineRef.current = timeline;

    // 1. Letters appear one by one
    timeline.fromTo(
      letters,
      {
        opacity: 0,
        y: 40,
        filter: "blur(15px)",
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
      }
    );

    // 2. Hold the logo
    timeline.to({}, {
      duration: 1.2,
    });

    // 3. Letters disappear
    timeline.to(letters, {
      opacity: 0,
      y: -35,
      filter: "blur(12px)",
      scale: 1.05,
      duration: 0.6,
      stagger: 0.05,
      ease: "power2.in",
    });

    // 4. Fade the entire intro
    timeline.to(introRef.current, {
      opacity: 0,
      duration: 0.6,
      ease: "power2.inOut",
    });

    return () => {
      timeline.kill();
    };
  }, []);

  return (
    <div className="intro cursor-pointer" ref={introRef} onClick={handleFinish} onTouchStart={handleFinish}>

      {/* Aurora background */}
      <div className="intro-aurora">
        <Aurora
          colorStops={["#7cff67", "#B497CF", "#5227FF"]}
          blend={0.5}
          amplitude={1.0}
          speed={1}
        />
      </div>

      {/* Dark overlay for better text visibility */}
      <div className="intro-overlay" />

      {/* Intro text */}
      <div className="intro-content">
        <h1 ref={textRef}>
          {"PopcornPass".split("").map((letter, index) => (
            <span className="letter" key={index}>
              {letter}
            </span>
          ))}
        </h1>
      </div>

    </div>
  );
}

export default Intro;