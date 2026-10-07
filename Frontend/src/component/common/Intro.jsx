
import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./Intro.css";

function Intro({ onComplete }) {
  const introRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    // Select every individual letter
    const letters = textRef.current.querySelectorAll(".letter");

    // Create an animation timeline
    const timeline = gsap.timeline({
      onComplete: onComplete,
    });

    // STEP 1: Letters appear one by one
    timeline.fromTo(
      letters,
      {
        opacity: 0,
        y: 40,
        filter: "blur(12px)",
      },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
      }
    );

    // STEP 2: Keep the word on screen
    timeline.to({}, {
      duration: 1,
    });

    // STEP 3: Letters disappear
    timeline.to(letters, {
      opacity: 0,
      y: -30,
      filter: "blur(10px)",
      duration: 0.6,
      stagger: 0.06,
      ease: "power2.in",
    });

    // STEP 4: Fade out the intro screen
    timeline.to(introRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut",
    });

    // Cleanup animation when component unmounts
    return () => {
      timeline.kill();
    };
  }, [onComplete]);

  return (
    <div className="intro" ref={introRef}>
      <h1 ref={textRef}>
        {"popcorn".split("").map((letter, index) => (
          <span className="letter" key={index}>
            {letter}
          </span>
        ))}
      </h1>
    </div>
  );
}

export default Intro;

