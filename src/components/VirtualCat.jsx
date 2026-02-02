import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import './VirtualCat.css';

const VirtualCat = () => {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [speechBubble, setSpeechBubble] = useState('');
  const [showBubble, setShowBubble] = useState(false);
  const [isAwake, setIsAwake] = useState(false);
  const [isPetting, setIsPetting] = useState(false);
  const [isCarrying, setIsCarrying] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isShocked, setIsShocked] = useState(false);
  const [isPunching, setIsPunching] = useState(false);
  const [punchDirection, setPunchDirection] = useState(1);
  const [isStretching, setIsStretching] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const [idleAnimation, setIdleAnimation] = useState('');
  const [isCurious, setIsCurious] = useState(false);
  const [mood, setMood] = useState(50); // 0-100, 50 is neutral
  const [isThemeReacting, setIsThemeReacting] = useState(false);
  const [isGrooming, setIsGrooming] = useState(false);
  const { darkMode } = useContext(ThemeContext);
  const prevDarkModeRef = useRef(darkMode);
  const catRef = useRef(null);
  const animationRef = useRef(null);
  const sleepTimeoutRef = useRef(null);
  const pettingTimeoutRef = useRef(null);
  const randomWakeRef = useRef(null);
  const idleTimeoutRef = useRef(null);
  const cursorTrackingRef = useRef(null);
  const punchCooldownRef = useRef(false);
  const isPunchingRef = useRef(false);
  const isStretchingRef = useRef(false);
  const isIdleRef = useRef(false);
  const isCuriousRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const currentMousePosRef = useRef({ x: 0, y: 0 });
  const isCarryingRef = useRef(false);
  const moodRef = useRef(50);
  const lastInteractionRef = useRef(Date.now());
  const behaviorStateRef = useRef('wandering'); // wandering, investigating, stalking, resting
  
  // Use refs for mutable values that shouldn't trigger re-renders
  const directionRef = useRef({ x: 1, y: 0 });
  const lastDirectionChangeRef = useRef(0);
  const positionRef = useRef({ x: 100, y: 100 });
  const isAwakeRef = useRef(false);
  const targetPosRef = useRef(null);

  // Dynamic messages based on mood
  const getAwakeMessage = useCallback(() => {
    const happyMessages = ["Meow! 👋", "Let's play! 🎉", "*excited chirp*", "I love it here! 💕"];
    const neutralMessages = ["*stretches*", "I'm awake now!", "*yawns*", "What's up?"];
    const grumpyMessages = ["*grumpy meow*", "What now? 😒", "*annoyed tail flick*", "Hmph."];
    
    if (moodRef.current > 70) return happyMessages[Math.floor(Math.random() * happyMessages.length)];
    if (moodRef.current < 30) return grumpyMessages[Math.floor(Math.random() * grumpyMessages.length)];
    return neutralMessages[Math.floor(Math.random() * neutralMessages.length)];
  }, []);

  const sleepMessages = [
    "Zzz... 😴",
    "*purrs softly*",
    "Five more minutes...",
    "So sleepy... 💤"
  ];

  const getPettingMessage = useCallback(() => {
    const happyPetting = ["*PURRRR* 😻", "I love you! 💕", "*melts*", "Best human ever! 🥰"];
    const neutralPetting = ["*purrrr* 😻", "That feels nice~", "*happy purring*", "More pets please!"];
    const grumpyPetting = ["*tolerates*", "Okay, that's nice...", "*warming up*", "...fine, continue."];
    
    if (moodRef.current > 70) return happyPetting[Math.floor(Math.random() * happyPetting.length)];
    if (moodRef.current < 30) return grumpyPetting[Math.floor(Math.random() * grumpyPetting.length)];
    return neutralPetting[Math.floor(Math.random() * neutralPetting.length)];
  }, []);

  const carryingMessages = [
    "Whoa! Put me down! 😾",
    "I'm flying! ✨",
    "*dangles legs*",
    "Where are we going?",
    "Hold me gently! 🐱"
  ];

  const punchMessages = [
    "*swipe!* 👊",
    "Back off! 😼",
    "Ha! Got you!",
    "*bap bap bap*",
    "Too slow! 🐱"
  ];

  const curiousMessages = [
    "What's that? 👀",
    "*investigates*",
    "Interesting...",
    "*sniff sniff*",
    "Hmm? 🤔"
  ];

  const groomingMessages = [
    "*lick lick* 👅",
    "Gotta stay clean~",
    "*grooms fur*",
    "Looking good! ✨",
    "*mlem mlem*",
    "Squeaky clean! 🧼"
  ];

  const idleMessages = [
    "*grooms fur*",
    "*looks around*",
    "*tail flick*",
    "*ear twitch*",
    "*blinks slowly*"
  ];

  const darkModeMessages = [
    "Ooh, it's dark now! 🌙",
    "*pupils dilate* 👀",
    "Night mode activated! 🦉",
    "I can see better now! ✨",
    "*nocturnal instincts engage*"
  ];

  const lightModeMessages = [
    "Ah! So bright! ☀️",
    "*squints* Too sunny...",
    "Good morning! 🌅",
    "*stretches in sunlight*",
    "Time to nap in a sunbeam! 😸"
  ];

  // Update mood (clamped 0-100)
  const updateMood = useCallback((delta) => {
    moodRef.current = Math.max(0, Math.min(100, moodRef.current + delta));
    setMood(moodRef.current);
  }, []);

  // Collision detection
  const checkCollision = useCallback((newX, newY) => {
    const catSize = 70;
    const margin = 30;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (newX < margin) return 'left';
    if (newX > viewportWidth - catSize - margin) return 'right';
    if (newY < margin) return 'top';
    if (newY > viewportHeight - catSize - margin) return 'bottom';

    return false;
  }, []);

  // Show message
  const showMessage = useCallback((message) => {
    setSpeechBubble(message);
    setShowBubble(true);
    setTimeout(() => setShowBubble(false), 2500);
  }, []);

  // Schedule random wake up - cat will randomly wake up on its own
  const scheduleRandomWake = useCallback(() => {
    if (randomWakeRef.current) {
      clearTimeout(randomWakeRef.current);
    }
    
    // Wake delay influenced by mood - happier cats are more active
    const basedelay = moodRef.current > 50 ? 6000 : 10000;
    const wakeDelay = basedelay + Math.random() * 10000;
    
    randomWakeRef.current = setTimeout(() => {
      // Only wake up if not already awake or being carried
      if (!isAwakeRef.current && !isCarryingRef.current) {
        isAwakeRef.current = true;
        setIsAwake(true);
        behaviorStateRef.current = 'wandering';
        
        // Start with a stretch
        isStretchingRef.current = true;
        setIsStretching(true);
        showMessage("*stretches* 🐱");
        
        // End stretching after animation
        setTimeout(() => {
          isStretchingRef.current = false;
          setIsStretching(false);
          
          // Decide initial behavior based on cursor proximity
          const catX = positionRef.current.x + 35;
          const catY = positionRef.current.y + 35;
          const mouseX = currentMousePosRef.current.x;
          const mouseY = currentMousePosRef.current.y;
          const distToCursor = Math.sqrt(Math.pow(mouseX - catX, 2) + Math.pow(mouseY - catY, 2));
          
          // If cursor is nearby, might investigate
          if (distToCursor < 300 && Math.random() < 0.4) {
            behaviorStateRef.current = 'curious';
            isCuriousRef.current = true;
            setIsCurious(true);
            targetPosRef.current = { x: mouseX - 35, y: mouseY - 35 };
            showMessage(curiousMessages[Math.floor(Math.random() * curiousMessages.length)]);
          } else {
            // Set a random direction
            const angle = Math.random() * Math.PI * 2;
            directionRef.current = { x: Math.cos(angle), y: Math.sin(angle) };
          }
        }, 800);
        
        // Longer awake time - 5-12 seconds
        const sleepDelay = 5000 + Math.random() * 7000;
        sleepTimeoutRef.current = setTimeout(() => {
          if (!isCarryingRef.current && !isPunchingRef.current) {
            isAwakeRef.current = false;
            setIsAwake(false);
            setIsCurious(false);
            isCuriousRef.current = false;
            setIsIdle(false);
            isIdleRef.current = false;
            behaviorStateRef.current = 'sleeping';
            const sleepMsg = sleepMessages[Math.floor(Math.random() * sleepMessages.length)];
            showMessage(sleepMsg);
            
            // Schedule next random wake
            scheduleRandomWake();
          }
        }, sleepDelay);
      } else {
        // If already awake, try again later
        scheduleRandomWake();
      }
    }, wakeDelay);
  }, [showMessage]);

  // Wake up the cat (from user interaction)
  const wakeUp = useCallback(() => {
    lastInteractionRef.current = Date.now();
    
    // Clear any pending random wake since we're waking up now
    if (randomWakeRef.current) {
      clearTimeout(randomWakeRef.current);
    }
    
    if (!isAwakeRef.current) {
      isAwakeRef.current = true;
      setIsAwake(true);
      behaviorStateRef.current = 'wandering';
      const message = getAwakeMessage();
      showMessage(message);
      
      // Set a random direction
      const angle = Math.random() * Math.PI * 2;
      directionRef.current = { x: Math.cos(angle), y: Math.sin(angle) };
    }
    
    // Reset states
    setIsCurious(false);
    isCuriousRef.current = false;
    setIsIdle(false);
    isIdleRef.current = false;
    
    // Reset sleep timer
    if (sleepTimeoutRef.current) {
      clearTimeout(sleepTimeoutRef.current);
    }
    
    // Longer awake time when user interacts - 6-10 seconds
    const sleepDelay = 6000 + Math.random() * 4000;
    sleepTimeoutRef.current = setTimeout(() => {
      if (!isCarryingRef.current && !isPunchingRef.current) {
        isAwakeRef.current = false;
        setIsAwake(false);
        setIsCurious(false);
        isCuriousRef.current = false;
        setIsIdle(false);
        isIdleRef.current = false;
        behaviorStateRef.current = 'sleeping';
        const message = sleepMessages[Math.floor(Math.random() * sleepMessages.length)];
        showMessage(message);
        
        // Schedule next random wake up
        scheduleRandomWake();
      }
    }, sleepDelay);
  }, [showMessage, scheduleRandomWake, getAwakeMessage]);

  // Start the random wake cycle on mount
  useEffect(() => {
    scheduleRandomWake();
    
    return () => {
      if (randomWakeRef.current) {
        clearTimeout(randomWakeRef.current);
      }
    };
  }, [scheduleRandomWake]);

  // React to theme changes
  useEffect(() => {
    // Skip on initial render
    if (prevDarkModeRef.current === darkMode) return;
    
    prevDarkModeRef.current = darkMode;
    
    // Trigger theme reaction
    setIsThemeReacting(true);
    
    // Wake up if sleeping
    if (!isAwakeRef.current) {
      isAwakeRef.current = true;
      setIsAwake(true);
    }
    
    // Show appropriate message
    const messages = darkMode ? darkModeMessages : lightModeMessages;
    const message = messages[Math.floor(Math.random() * messages.length)];
    showMessage(message);
    
    // Reset sleep timer
    if (sleepTimeoutRef.current) {
      clearTimeout(sleepTimeoutRef.current);
    }
    
    // End reaction animation after a bit
    setTimeout(() => {
      setIsThemeReacting(false);
    }, 1200);
    
    // Go back to sleep after reaction
    sleepTimeoutRef.current = setTimeout(() => {
      if (!isCarryingRef.current && !isPunchingRef.current) {
        isAwakeRef.current = false;
        setIsAwake(false);
        behaviorStateRef.current = 'sleeping';
        showMessage("*settles back down* 💤");
        scheduleRandomWake();
      }
    }, 4000);
  }, [darkMode, showMessage, scheduleRandomWake]);

  // Handle scroll - earthquake effect
  useEffect(() => {
    let scrollTimeout;
    let shakeTimeout;
    const handleScroll = () => {
      // Start shaking immediately
      setIsShaking(true);
      clearTimeout(shakeTimeout);
      
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        wakeUp();
      }, 100);
      
      // Stop shaking after scroll stops
      shakeTimeout = setTimeout(() => {
        setIsShaking(false);
      }, 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
      clearTimeout(shakeTimeout);
    };
  }, [wakeUp]);

  // Movement animation - smart AI behavior
  useEffect(() => {
    const baseSpeed = 1.5;
    const directionChangeInterval = 2000;
    let lastIdleCheck = 0;
    let pauseUntil = 0;

    const animate = (currentTime) => {
      // Skip if not in active state
      if (!isAwakeRef.current || isCarryingRef.current || isPunchingRef.current || isStretchingRef.current) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      // Handle idle state - cat pauses and does idle animation
      if (isIdleRef.current) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      // Check if we should pause (random idle behavior)
      if (currentTime < pauseUntil) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      // Random chance to start idle animation
      if (currentTime - lastIdleCheck > 3000 && Math.random() < 0.01) {
        lastIdleCheck = currentTime;
        const idleAnimations = ['grooming', 'looking', 'tail-flick', 'ear-twitch'];
        const randomIdle = idleAnimations[Math.floor(Math.random() * idleAnimations.length)];
        
        isIdleRef.current = true;
        setIsIdle(true);
        setIdleAnimation(randomIdle);
        
        // Show grooming state with tongue
        if (randomIdle === 'grooming') {
          setIsGrooming(true);
          // Higher chance to show grooming message
          if (Math.random() < 0.5) {
            showMessage(groomingMessages[Math.floor(Math.random() * groomingMessages.length)]);
          }
        } else if (Math.random() < 0.3) {
          // Chance to show idle message for other animations
          showMessage(idleMessages[Math.floor(Math.random() * idleMessages.length)]);
        }
        
        // Resume after idle animation
        setTimeout(() => {
          isIdleRef.current = false;
          setIsIdle(false);
          setIdleAnimation('');
          setIsGrooming(false);
        }, 1500 + Math.random() * 1000);
        
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const pos = positionRef.current;
      const catX = pos.x + 35;
      const catY = pos.y + 35;
      const mouseX = currentMousePosRef.current.x;
      const mouseY = currentMousePosRef.current.y;
      
      let speed = baseSpeed;
      let dir = directionRef.current;

      // Curious behavior - slowly approach cursor
      if (isCuriousRef.current && targetPosRef.current) {
        const target = targetPosRef.current;
        const dx = target.x - pos.x;
        const dy = target.y - pos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > 50) {
          // Move towards target slowly
          speed = 0.8;
          dir = { x: dx / dist, y: dy / dist };
          directionRef.current = dir;
        } else {
          // Reached target, stop being curious
          isCuriousRef.current = false;
          setIsCurious(false);
          targetPosRef.current = null;
          behaviorStateRef.current = 'wandering';
          
          // Pause briefly to "investigate"
          pauseUntil = currentTime + 1000;
          showMessage("*sniff sniff* 👃");
        }
      } else {
        // Normal wandering with smarter direction changes
        let newX = pos.x + dir.x * speed;
        let newY = pos.y + dir.y * speed;

        const collision = checkCollision(newX, newY);
        
        if (collision) {
          // Bounce off walls with some randomness
          if (collision === 'left' || collision === 'right') {
            dir = { x: -dir.x, y: dir.y + (Math.random() - 0.5) * 0.8 };
          } else {
            dir = { x: dir.x + (Math.random() - 0.5) * 0.8, y: -dir.y };
          }
          // Normalize direction
          const length = Math.sqrt(dir.x ** 2 + dir.y ** 2);
          dir.x /= length;
          dir.y /= length;
          directionRef.current = dir;
          
          newX = Math.max(30, Math.min(window.innerWidth - 100, newX));
          newY = Math.max(30, Math.min(window.innerHeight - 100, newY));
          
          lastDirectionChangeRef.current = currentTime;
        }

        // Periodic direction changes with varying probability
        if (currentTime - lastDirectionChangeRef.current > directionChangeInterval) {
          const changeProbability = 0.015 + (moodRef.current > 50 ? 0.01 : 0);
          
          if (Math.random() < changeProbability) {
            // Sometimes look towards cursor if nearby
            const distToCursor = Math.sqrt(Math.pow(mouseX - catX, 2) + Math.pow(mouseY - catY, 2));
            
            if (distToCursor < 400 && Math.random() < 0.25) {
              // Head towards cursor area (not directly at it)
              const angleToMouse = Math.atan2(mouseY - catY, mouseX - catX);
              const offset = (Math.random() - 0.5) * Math.PI / 2;
              dir = { x: Math.cos(angleToMouse + offset), y: Math.sin(angleToMouse + offset) };
            } else {
              // Random direction
              const angle = Math.random() * Math.PI * 2;
              dir = { x: Math.cos(angle), y: Math.sin(angle) };
            }
            directionRef.current = dir;
            lastDirectionChangeRef.current = currentTime;
          }
        }

        positionRef.current = { x: newX, y: newY };
        setPosition({ x: newX, y: newY });
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (sleepTimeoutRef.current) {
        clearTimeout(sleepTimeoutRef.current);
      }
    };
  }, [checkCollision]);

  // Handle click
  const handleClick = () => {
    lastInteractionRef.current = Date.now();
    
    if (isAwakeRef.current) {
      // Clicking while awake decreases mood slightly
      updateMood(-5);
      const grumpyChance = moodRef.current < 40 ? 0.5 : 0.2;
      if (Math.random() < grumpyChance) {
        showMessage("Hey! Quit it! 😾");
      } else {
        showMessage("Hey! Don't poke me! 😺");
      }
    } else {
      // Shocked reaction when waking from sleep
      updateMood(-3);
      setIsShocked(true);
      showMessage("MEOW?! 😱");
      
      // Remove shocked state after animation
      setTimeout(() => {
        setIsShocked(false);
        wakeUp();
      }, 500);
    }
  };

  // Handle petting (hover)
  const handleMouseEnter = () => {
    lastInteractionRef.current = Date.now();
    setIsPetting(true);
    
    // Petting increases mood
    updateMood(5);
    
    // Show petting message after a short delay
    if (pettingTimeoutRef.current) {
      clearTimeout(pettingTimeoutRef.current);
    }
    pettingTimeoutRef.current = setTimeout(() => {
      const message = getPettingMessage();
      showMessage(message);
    }, 300);
  };

  const handleMouseLeave = () => {
    setIsPetting(false);
    if (pettingTimeoutRef.current) {
      clearTimeout(pettingTimeoutRef.current);
    }
  };

  // Handle carrying (mouse down/up)
  const handleMouseDown = (e) => {
    e.preventDefault();
    lastInteractionRef.current = Date.now();
    isCarryingRef.current = true;
    setIsCarrying(true);
    setIsPetting(false);
    
    // Carrying slightly decreases mood unless cat is happy
    if (moodRef.current < 60) {
      updateMood(-2);
    }
    
    const message = carryingMessages[Math.floor(Math.random() * carryingMessages.length)];
    showMessage(message);
    
    // Cancel sleep timer while carrying
    if (sleepTimeoutRef.current) {
      clearTimeout(sleepTimeoutRef.current);
    }
  };

  // Track mouse position globally
  useEffect(() => {
    const trackMouse = (e) => {
      currentMousePosRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', trackMouse, { passive: true });
    return () => window.removeEventListener('mousemove', trackMouse);
  }, []);

  // Handle mouse move while carrying
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isCarryingRef.current) {
        const newX = e.clientX - 35; // Center the cat on cursor
        const newY = e.clientY - 35;
        positionRef.current = { x: newX, y: newY };
        setPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      if (isCarryingRef.current) {
        isCarryingRef.current = false;
        setIsCarrying(false);
        showMessage("*lands on feet* 🐱");
        
        // Wake up the cat after being put down
        isAwakeRef.current = true;
        setIsAwake(true);
        
        // Set a random direction after being put down
        const angle = Math.random() * Math.PI * 2;
        directionRef.current = { x: Math.cos(angle), y: Math.sin(angle) };
        
        // Start sleep timer
        if (sleepTimeoutRef.current) {
          clearTimeout(sleepTimeoutRef.current);
        }
        sleepTimeoutRef.current = setTimeout(() => {
          isAwakeRef.current = false;
          setIsAwake(false);
          const message = sleepMessages[Math.floor(Math.random() * sleepMessages.length)];
          showMessage(message);
        }, 2500);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [showMessage]);

  // Detect cursor approaching while awake - punch!
  useEffect(() => {
    const handleCursorApproach = (e) => {
      // Only punch if awake, not carrying, not already punching, not stretching, and not on cooldown
      if (!isAwakeRef.current || isCarryingRef.current || punchCooldownRef.current || isStretchingRef.current || isPunchingRef.current) {
        lastMousePosRef.current = { x: e.clientX, y: e.clientY };
        return;
      }

      const catX = positionRef.current.x + 35; // Center of cat
      const catY = positionRef.current.y + 35;
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      // Calculate cursor velocity (is it approaching?)
      const lastMouse = lastMousePosRef.current;
      const prevDistance = Math.sqrt(
        Math.pow(lastMouse.x - catX, 2) + Math.pow(lastMouse.y - catY, 2)
      );
      const currentDistance = Math.sqrt(
        Math.pow(mouseX - catX, 2) + Math.pow(mouseY - catY, 2)
      );
      
      // Update last position
      lastMousePosRef.current = { x: mouseX, y: mouseY };
      
      // Check if cursor is approaching (getting closer) and within punch range
      const isApproaching = currentDistance < prevDistance;
      const inPunchRange = currentDistance > 60 && currentDistance < 130;
      
      if (isApproaching && inPunchRange) {
        // Make cat face the cursor direction
        const punchDir = mouseX > catX ? 1 : -1;
        directionRef.current = { x: punchDir, y: 0 };
        setPunchDirection(punchDir);
        
        // Start punching
        setIsPunching(true);
        isPunchingRef.current = true;
        punchCooldownRef.current = true;

        const message = punchMessages[Math.floor(Math.random() * punchMessages.length)];
        showMessage(message);

        // End punch animation
        setTimeout(() => {
          setIsPunching(false);
          isPunchingRef.current = false;
        }, 450);

        // Cooldown before next punch
        setTimeout(() => {
          punchCooldownRef.current = false;
        }, 1200);
      }
    };

    window.addEventListener('mousemove', handleCursorApproach);
    return () => window.removeEventListener('mousemove', handleCursorApproach);
  }, [showMessage]);

  return (
    <div
      ref={catRef}
      className={`virtual-cat ${isAwake ? 'walking' : 'sleeping'} ${isPetting ? 'petting' : ''} ${isCarrying ? 'carrying' : ''} ${isShaking ? 'earthquake' : ''} ${isShocked ? 'shocked' : ''} ${isPunching ? 'punching' : ''} ${isStretching ? 'stretching' : ''} ${isIdle ? `idle ${idleAnimation}` : ''} ${isCurious ? 'curious' : ''} ${mood > 70 ? 'happy' : ''} ${mood < 30 ? 'grumpy' : ''} ${isThemeReacting ? (darkMode ? 'theme-dark' : 'theme-light') : ''} ${isGrooming ? 'grooming-active' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `scaleX(${directionRef.current.x >= 0 ? 1 : -1})`
      }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
    >
      <div className="cat-body">
        <div className="cat-head">
          <div className="cat-ears">
            <div className="ear left"></div>
            <div className="ear right"></div>
          </div>
          <div className="cat-face">
            <div className="cat-eyes">
              <div className="eye left"></div>
              <div className="eye right"></div>
            </div>
            <div className="cat-nose"></div>
            <div className="cat-mouth"></div>
            <div className="cat-tongue"></div>
            <div className="cat-whiskers">
              <div className="whisker-left"></div>
              <div className="whisker-right"></div>
            </div>
          </div>
        </div>
        <div className="cat-tail"></div>
        <div className="cat-legs">
          <div className="leg front-left"></div>
          <div className="leg front-right"></div>
          <div className="leg back-left"></div>
          <div className="leg back-right"></div>
        </div>
        <div className="cat-paw-punch"></div>
        <div className="cat-impact"></div>
      </div>

      {showBubble && (
        <div 
          className="speech-bubble"
          style={{ transform: `translateX(-50%) scaleX(${directionRef.current.x >= 0 ? 1 : -1})` }}
        >
          <div className="speech-text">{speechBubble}</div>
          <div className="speech-arrow"></div>
        </div>
      )}
    </div>
  );
};

export default VirtualCat;