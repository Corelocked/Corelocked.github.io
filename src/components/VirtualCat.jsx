import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import './VirtualCat.css';

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS - Easy tuning for all behavior timings and thresholds
// ═══════════════════════════════════════════════════════════════════════════════
const TIMING = {
  DIRECTION_CHANGE_INTERVAL: 4000,
  IDLE_CHECK_INTERVAL: 5000,
  EAT_CHECK_INTERVAL: 15000,
  PETTING_DELAY: 2000,
  PUNCH_COOLDOWN: 1200,
  PUNCH_DURATION: 450,
  IRRITATION_DURATION: 8000,
  SPEECH_BUBBLE_DURATION: 3500,
  STRETCH_DURATION: 2000,
  IDLE_ANIMATION_MIN: 3500,
  IDLE_ANIMATION_VARIANCE: 2500,
  FULLNESS_DECAY_INTERVAL: 30000,
  INACTIVITY_SLEEP_THRESHOLD: 45000, // Sleep after 45s of no mouse movement
};

const MOOD = {
  HAPPY_THRESHOLD: 70,
  GRUMPY_THRESHOLD: 30,
  PETTING_BOOST: 5,
  EATING_BOOST: 15,
  HAND_FED_BOOST: 25,
  CLICK_PENALTY: -5,
  WAKE_PENALTY: -3,
  CARRY_PENALTY: -2,
  DROPPED_FOOD_PENALTY: -5,
  BOWL_DROP_BOOST: 10,
};

const DISTANCE = {
  CURIOUS_MIN: 80,
  CURIOUS_MAX: 400,
  PUNCH_MIN: 50,
  PUNCH_MAX: 120,
  INVESTIGATE_THRESHOLD: 60,
  BOWL_APPROACH: 40,
};

const SPEED = {
  BASE: 1.5,
  CURIOUS: 0.9,
  BOWL_APPROACH: 1.2,
};

// Time-of-day periods
const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night'; // 21-6
};

// ═══════════════════════════════════════════════════════════════════════════════
// MESSAGE SYSTEM - All dialogue organized by category and mood
// ═══════════════════════════════════════════════════════════════════════════════
const MESSAGES = {
  awake: {
    happy: ["You're home! 💕", "*runs to greet you*", "I missed you! 😽", "Time for cuddles?", "Let's watch anime! 📺", "TFT time? I'll watch! 🎮"],
    neutral: ["*stretches*", "Yuuki is awake.", "*yawns*", "Got any bread? 🍞"],
    grumpy: ["*death stare*", "You woke me up for THIS? 😒", "*aggressive tail flick*", "Ugh. What."],
  },
  sleep: {
    happy: ["*curls into cozy donut* 🍩", "*purrs softly* 💤", "Sweet dreams~ 😴", "So cozy... 💕"],
    neutral: ["*curls into donut* 🍩", "Five more minutes...", "Zzz... 😴", "Sleepy time."],
    grumpy: ["Don't even think about it.", "I'm ignoring you now. 💤", "Go away. Sleeping.", "*pretends you don't exist*"],
  },
  petting: {
    happy: ["*PURRRR* 😻", "Yuuki loves you! 💕", "*melts into cuddles*", "Best human ever! 🥰", "*gives you a kiss* 😽", "Never stop! 💗"],
    neutral: ["*purrrr* 😻", "That's nice.", "*happy purring*", "More pets please.", "*leans in*"],
    grumpy: ["*barely tolerates*", "One more minute. Then leave.", "*suspicious purring*", "...fine. But only because I'm cold."],
  },
  carrying: {
    happy: ["Wheee! 😻", "Carry me everywhere! ✨", "*happy dangling*", "To the couch! 📺", "I love this! 💕"],
    neutral: ["Where are we going?", "*dangles legs*", "Okay I guess.", "*tolerates being held*"],
    grumpy: ["Excuse me?! 😾", "I didn't consent to this.", "Put me DOWN.", "*judges you while dangling*"],
  },
  punch: {
    happy: ["*playful swipe* 👊", "Gotcha! 😸", "Play with me!", "*gentle bap*", "Tag! 💕"],
    neutral: ["*swipe* 👊", "*bap bap bap*", "Ha!", "*boop*"],
    grumpy: ["*SWIPE* 👊", "Back off! 😼", "Violence IS the answer!", "*aggressive boop*"],
  },
  curious: {
    happy: ["Ooh what's that? 👀", "*excited investigation*", "New anime?! 📺", "Is that for me? 🍞", "TFT? I wanna watch! 🎮"],
    neutral: ["What's this?", "*investigates*", "*sniff sniff*", "Hmm?"],
    grumpy: ["Is that bread? Give it. 🍞", "*suspicious sniff*", "You're playing without me?! 😾", "I'm supervising. Continue."],
  },
  grooming: {
    happy: ["*lick lick* 👅", "Gotta look cute for you~", "*grooms happily*", "Almost cuddle ready! ✨"],
    neutral: ["*grooms fur*", "*mlem mlem*", "Grooming time.", "*cleaning*"],
    grumpy: ["Don't look at me. I'm grooming.", "*grooms aggressively*", "Yes, I know I'm beautiful.", "*judges while grooming*"],
  },
  eating: {
    happy: ["*nom nom nom* 😻", "Yummy! 🍞", "So tasty! 😋", "*happy munching*", "Food is love! 💕"],
    neutral: ["*nom nom*", "*crunch crunch*", "Eating.", "*munch*"],
    grumpy: ["About time. 🍞", "Is this it? ...fine.", "More. Now.", "*eats aggressively*"],
  },
  handFed: {
    happy: ["For me?! 🥺💕", "*happy chomps* Thank you!", "You fed me! I love you! 😻", "Best human ever! 🥰", "*grateful purrs* 💖"],
    neutral: ["*chomp*", "Thanks.", "*takes food*", "Acceptable."],
    grumpy: ["For me? ...obviously. 😼", "I suppose you're useful.", "*takes food aggressively*", "Hand-fed. As I deserve. 👑"],
  },
  idle: {
    happy: ["*grooms fur happily*", "*watches you lovingly*", "*happy tail swish*", "*curls into cozy donut* 🍩", "*slow blink* I love you"],
    neutral: ["*grooms fur*", "*looks around*", "*tail flick*", "*blinks*"],
    grumpy: ["*judges your gameplay*", "*tail flick of disapproval*", "*stares judgmentally*", "*waits impatiently*"],
  },
  darkMode: {
    happy: ["Movie time! 🎬🌙", "*pupils dilate excitedly* 👀", "Anime marathon! 📺", "Perfect for cuddles! 💕", "Cozy time! 🥰"],
    neutral: ["Ooh, dark mode. 🌙", "*pupils dilate* 👀", "Night time.", "*adjusts to darkness*"],
    grumpy: ["Finally. Dark mode. 🌙", "Anime time. Move over.", "TFT? I'm watching. Don't int. 🎮", "*claims the warm spot*"],
  },
  lightMode: {
    happy: ["Good morning! ☀️", "*stretches in sunbeam*", "You're awake! 💕", "Sunny day! 😸", "Breakfast time? 🍞"],
    neutral: ["*stretches*", "Morning.", "*yawns*", "*finds sunny spot*"],
    grumpy: ["Ugh. Morning. ☀️", "You're awake. Feed me.", "Where's breakfast? 🍞😒", "*stares until fed*"],
  },
  investigate: [
    "*sniff* ...boring. 🐾",
    "*investigates* Hm. 🐾",
    "What are you doing? 👀",
    "*watches intently*",
    "Interesting... 🐱",
  ],
  notHungry: [
    "I'm not hungry... 😿",
    "*sniffs* Maybe later...",
    "Already ate! 🐱",
    "Full tummy~ 😴",
    "*looks away* Not now...",
    "Too full to eat! 💤",
  ],
  // Time-of-day specific messages
  timeOfDay: {
    morning: {
      happy: ["Good morning! ☀️", "Breakfast time! 🍞", "New day, new cuddles! 💕"],
      neutral: ["*yawns* Morning...", "Is it breakfast yet?", "*stretches in sunbeam*"],
      grumpy: ["Too early... 😾", "Feed me or let me sleep.", "Why are you up so early?"],
    },
    afternoon: {
      happy: ["Perfect nap weather! 😸", "Sunny spot acquired! ☀️", "Afternoon snuggles? 💕"],
      neutral: ["*sunbathing*", "Nice afternoon.", "*lounges*"],
      grumpy: ["Prime sleeping hours. Shh.", "*refuses to move from sunny spot*", "I'm busy being warm."],
    },
    evening: {
      happy: ["Anime time! 📺", "Cozy evening vibes~ 🌙", "Cuddle o'clock! 💕"],
      neutral: ["Evening.", "*settles in for the night*", "Dinner soon?"],
      grumpy: ["Don't bother me. It's chill time.", "You're still here?", "*claims the couch*"],
    },
    night: {
      happy: ["Sleepy time with you! 💕", "*soft purrs* 🌙", "Night night~ 😴"],
      neutral: ["*yawns* Getting late...", "Night mode activated. 🌙", "*eyelids getting heavy*"],
      grumpy: ["Go to sleep. I am.", "Why are you still awake?", "*judges your sleep schedule*"],
    },
  },
  // Rare special messages (1% chance)
  rare: [
    "Did you know I love you? 💖",
    "*finds the one crinkly thing in the house*",
    "I had a dream about infinite bread 🍞✨",
    "*sits in invisible box*",
    "Why is the red dot... uncatchable? 🔴",
    "*meows at 3am for no reason*",
    "I see a ghost. Just kidding. Or am I? 👻",
    "*knocks something off the table intentionally*",
    "Remember when you thought you were in charge? Cute. 😼",
    "I tolerate you. That's basically love. 💕",
    "*makes biscuits on your lap* 🍞",
    "Plot twist: the cardboard box IS the best gift.",
    "*stares at wall for 10 minutes* ...art.",
    "One day I will catch my tail. One day. 🌀",
  ],
  // Fun facts and meta messages (shown occasionally)
  funFacts: [
    "💡 Fun fact: You can feed Yuuki's wife, Yuumi by donating! 🍞",
    "💡 Did you know? The real Yuuki loves bread just as much!",
    "💡 Yuuki means 'snow' in Japanese! ❄️ Perfect for a white cat~",
    "💡 Fun fact: Real Yuuki judges TFT gameplay from the desk. 🎮",
    "💡 Did you know? Donations help buy real cat food! 😻",
    "💡 The real Yuuki prefers watching anime over being petted.",
    "💡 Fun fact: Yuuki's favorite spot is wherever you're sitting.",
    "💡 Did you know? The real Yuuki meows at 3am. Every. Night.",
    "💡 Fun fact: Real Yuuki loves sleeping next to his human! 😴💕",
    "💡 Support the Yuuki's Family! Check out the Support page! 💕",
    "💡 Fun fact: Real Yuuki has never caught the red dot. 🔴",
    "💡 The real Yuuki approves this virtual representation. 😼",
  ],
  inactivitySleep: [
    "*notices you're gone* 💤",
    "Guess I'll nap then... 😴",
    "*curls up alone* 🍩",
    "Wake me when you're back...",
    "*lonely yawn* 💤",
  ],
};

// Helper to get mood-based message
const getMoodMessage = (category, mood) => {
  const messages = MESSAGES[category];
  if (!messages) return "";
  
  // Handle non-mood-based arrays
  if (Array.isArray(messages)) {
    return messages[Math.floor(Math.random() * messages.length)];
  }
  
  let moodKey = 'neutral';
  if (mood > MOOD.HAPPY_THRESHOLD) moodKey = 'happy';
  else if (mood < MOOD.GRUMPY_THRESHOLD) moodKey = 'grumpy';
  
  const moodMessages = messages[moodKey];
  return moodMessages[Math.floor(Math.random() * moodMessages.length)];
};

// Get time-appropriate message
const getTimeMessage = (mood) => {
  const timeOfDay = getTimeOfDay();
  const messages = MESSAGES.timeOfDay[timeOfDay];
  
  let moodKey = 'neutral';
  if (mood > MOOD.HAPPY_THRESHOLD) moodKey = 'happy';
  else if (mood < MOOD.GRUMPY_THRESHOLD) moodKey = 'grumpy';
  
  const moodMessages = messages[moodKey];
  return moodMessages[Math.floor(Math.random() * moodMessages.length)];
};

// Check for rare message (1% chance) or fun fact (0.5% chance)
const tryRareMessage = () => {
  const roll = Math.random();
  if (roll < 0.005) {
    // Fun fact (0.5% chance)
    return MESSAGES.funFacts[Math.floor(Math.random() * MESSAGES.funFacts.length)];
  } else if (roll < 0.015) {
    // Rare message (1% chance)
    return MESSAGES.rare[Math.floor(Math.random() * MESSAGES.rare.length)];
  }
  return null;
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
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
  const [isStretching, setIsStretching] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const [idleAnimation, setIdleAnimation] = useState('');
  const [isCurious, setIsCurious] = useState(false);
  const [mood, setMood] = useState(50); // 0-100, 50 is neutral
  const [isThemeReacting, setIsThemeReacting] = useState(false);
  const [isGrooming, setIsGrooming] = useState(false);
  const [isEating, setIsEating] = useState(false);
  const [holdingFood, setHoldingFood] = useState(false);
  const [foodPosition, setFoodPosition] = useState({ x: 0, y: 0 });
  const [isBeingFed, setIsBeingFed] = useState(false);
  const [isWatchingFood, setIsWatchingFood] = useState(false);
  const [fullness, setFullness] = useState(0); // 0-100, increases when eating
  const [isIrritated, setIsIrritated] = useState(false); // True after being poked/carried
  const [facingRight, setFacingRight] = useState(true); // Track facing direction for text flip
  const { darkMode } = useContext(ThemeContext);
  const prevDarkModeRef = useRef(darkMode);
  const catRef = useRef(null);
  const bowlRef = useRef(null);
  const animationRef = useRef(null);
  const sleepTimeoutRef = useRef(null);
  const pettingTimeoutRef = useRef(null);
  const randomWakeRef = useRef(null);
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
  const isEatingRef = useRef(false);
  const holdingFoodRef = useRef(false);
  const foodPositionRef = useRef({ x: 0, y: 0 });
  const isIrritatedRef = useRef(false);
  const irritatedTimeoutRef = useRef(null);
  const fullnessRef = useRef(0);
  const lastMouseMoveRef = useRef(Date.now()); // Track last mouse activity for inactivity detection
  const inactivityCheckRef = useRef(null);

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

  // Show message with optional rare message chance
  const showMessage = useCallback((message, checkRare = true) => {
    // Small chance for a rare special message instead
    if (checkRare) {
      const rareMsg = tryRareMessage();
      if (rareMsg) {
        message = rareMsg;
      }
    }
    setSpeechBubble(message);
    setShowBubble(true);
    setTimeout(() => setShowBubble(false), TIMING.SPEECH_BUBBLE_DURATION);
  }, []);

  // Schedule random wake up - cat will randomly wake up on its own
  const scheduleRandomWake = useCallback(() => {
    if (randomWakeRef.current) {
      clearTimeout(randomWakeRef.current);
    }
    
    // Wake delay influenced by mood and time of day
    // Sleepier at night, more active during day
    const timeOfDay = getTimeOfDay();
    let timeMultiplier = 1;
    if (timeOfDay === 'night') timeMultiplier = 2.5; // Much sleepier at night
    else if (timeOfDay === 'morning') timeMultiplier = 0.7; // More active in morning
    else if (timeOfDay === 'evening') timeMultiplier = 1.3; // Bit sleepier in evening
    
    const basedelay = moodRef.current > 50 ? 15000 : 25000;
    const wakeDelay = (basedelay + Math.random() * 20000) * timeMultiplier;
    
    randomWakeRef.current = setTimeout(() => {
      // Only wake up if not already awake or being carried
      if (!isAwakeRef.current && !isCarryingRef.current) {
        isAwakeRef.current = true;
        setIsAwake(true);
        behaviorStateRef.current = 'wandering';
        
        // Start with a stretch
        isStretchingRef.current = true;
        setIsStretching(true);
        showMessage("*stretches* ✨");
        
        // End stretching after animation
        setTimeout(() => {
          isStretchingRef.current = false;
          setIsStretching(false);
          showMessage("*yawns* 😺");
          
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
            showMessage(getMoodMessage('curious', moodRef.current));
          } else {
            // Set a random direction
            const angle = Math.random() * Math.PI * 2;
            directionRef.current = { x: Math.cos(angle), y: Math.sin(angle) };
            setFacingRight(Math.cos(angle) >= 0);
          }
        }, TIMING.STRETCH_DURATION);
        
        // Longer awake time - 15-35 seconds for more interaction
        const sleepDelay = 15000 + Math.random() * 20000;
        sleepTimeoutRef.current = setTimeout(() => {
          if (!isCarryingRef.current && !isPunchingRef.current) {
            isAwakeRef.current = false;
            setIsAwake(false);
            setIsCurious(false);
            isCuriousRef.current = false;
            setIsIdle(false);
            isIdleRef.current = false;
            behaviorStateRef.current = 'sleeping';
            showMessage(getMoodMessage('sleep', moodRef.current));
            
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
    lastMouseMoveRef.current = Date.now();
    
    // Clear any pending random wake since we're waking up now
    if (randomWakeRef.current) {
      clearTimeout(randomWakeRef.current);
    }
    
    if (!isAwakeRef.current) {
      isAwakeRef.current = true;
      setIsAwake(true);
      behaviorStateRef.current = 'wandering';
      // Sometimes use time-of-day message instead
      const message = Math.random() < 0.3 ? getTimeMessage(moodRef.current) : getMoodMessage('awake', moodRef.current);
      showMessage(message);
      
      // Set a random direction
      const angle = Math.random() * Math.PI * 2;
      directionRef.current = { x: Math.cos(angle), y: Math.sin(angle) };
      setFacingRight(Math.cos(angle) >= 0);
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
    
    // Longer awake time when user interacts - 12-20 seconds
    const sleepDelay = 12000 + Math.random() * 8000;
    sleepTimeoutRef.current = setTimeout(() => {
      if (!isCarryingRef.current && !isPunchingRef.current) {
        isAwakeRef.current = false;
        setIsAwake(false);
        setIsCurious(false);
        isCuriousRef.current = false;
        setIsIdle(false);
        isIdleRef.current = false;
        behaviorStateRef.current = 'sleeping';
        showMessage(getMoodMessage('sleep', moodRef.current));
        
        // Schedule next random wake up
        scheduleRandomWake();
      }
    }, sleepDelay);
  }, [showMessage, scheduleRandomWake]);

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
    const message = darkMode ? getMoodMessage('darkMode', moodRef.current) : getMoodMessage('lightMode', moodRef.current);
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
        showMessage(getMoodMessage('sleep', moodRef.current));
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

  // Scheduled hunger - Yuuki gets hungry every 30 mins (Philippine time: UTC+8)
  useEffect(() => {
    const checkHungerSchedule = () => {
      // Get current time in Philippine timezone (UTC+8)
      const now = new Date();
      const philippineTime = new Date(now.getTime() + (8 * 60 * 60 * 1000) + (now.getTimezoneOffset() * 60 * 1000));
      const minutes = philippineTime.getMinutes();
      const seconds = philippineTime.getSeconds();
      
      // Check if it's exactly :00 or :30 (within first 10 seconds to avoid multiple triggers)
      if ((minutes === 0 || minutes === 30) && seconds < 10) {
        // Make Yuuki hungry!
        fullnessRef.current = 0;
        setFullness(0);
        
        // Wake up and show hungry message if sleeping
        if (!isAwakeRef.current && !isCarryingRef.current) {
          isAwakeRef.current = true;
          setIsAwake(true);
          behaviorStateRef.current = 'wandering';
        }
        
        const hungryMessages = [
          "It's feeding time! 🍞",
          "*stomach growls* Feed me! 😿",
          "I'm STARVING! 🍞😾",
          "*looks at empty bowl dramatically*",
          "Is it dinner time yet?! 😻",
          "Food! Now! Please! 🥺",
        ];
        showMessage(hungryMessages[Math.floor(Math.random() * hungryMessages.length)]);
      }
    };
    
    // Check every 5 seconds for hunger schedule
    const hungerScheduleInterval = setInterval(checkHungerSchedule, 5000);
    
    // Also do gradual decay between scheduled times
    const hungerDecayInterval = setInterval(() => {
      if (fullnessRef.current > 0) {
        fullnessRef.current = Math.max(0, fullnessRef.current - 5);
        setFullness(fullnessRef.current);
      }
    }, 60000); // Slower decay - every 60 seconds instead of 30

    return () => {
      clearInterval(hungerScheduleInterval);
      clearInterval(hungerDecayInterval);
    };
  }, [showMessage]);

  // Movement animation - smart AI behavior
  useEffect(() => {
    const baseSpeed = 1.5;
    const directionChangeInterval = 4000; // Longer between direction changes
    let lastIdleCheck = 0;
    let lastEatCheck = 0;
    let pauseUntil = 0;

    const animate = (currentTime) => {
      // Skip if not in active state
      if (!isAwakeRef.current || isCarryingRef.current || isPunchingRef.current || isStretchingRef.current || isEatingRef.current) {
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

      // Random chance to go eat from bowl (less frequent, only if not full)
      if (currentTime - lastEatCheck > 15000 && Math.random() < 0.005 && fullnessRef.current < 80) {
        lastEatCheck = currentTime;
        // Bowl is at bottom-left: x=30, y = viewport height - 80
        const bowlX = 30;
        const bowlY = window.innerHeight - 80;
        behaviorStateRef.current = 'going-to-bowl';
        targetPosRef.current = { x: bowlX + 20, y: bowlY - 40 };
      }

      // Random chance to become curious about the cursor and track it
      if (!isCuriousRef.current && behaviorStateRef.current === 'wandering') {
        const catX = positionRef.current.x + 35;
        const catY = positionRef.current.y + 35;
        const mouseX = currentMousePosRef.current.x;
        const mouseY = currentMousePosRef.current.y;
        const distToCursor = Math.sqrt(Math.pow(mouseX - catX, 2) + Math.pow(mouseY - catY, 2));
        
        // More likely to be curious if cursor is nearby, and happier cats are more curious
        const curiosityChance = moodRef.current > 50 ? 0.008 : 0.004;
        if (distToCursor < 400 && distToCursor > 80 && Math.random() < curiosityChance) {
          isCuriousRef.current = true;
          setIsCurious(true);
          behaviorStateRef.current = 'curious';
          targetPosRef.current = { x: mouseX - 35, y: mouseY - 35 };
          showMessage(getMoodMessage('curious', moodRef.current));
        }
      }

      // Random chance to start idle animation (less frequent)
      if (currentTime - lastIdleCheck > 5000 && Math.random() < 0.01) {
        lastIdleCheck = currentTime;
        const idleAnimations = ['grooming', 'grooming', 'looking', 'tail-flick', 'ear-twitch', 'looking'];
        const randomIdle = idleAnimations[Math.floor(Math.random() * idleAnimations.length)];
        
        isIdleRef.current = true;
        setIsIdle(true);
        setIdleAnimation(randomIdle);
        
        // Show grooming state with tongue
        if (randomIdle === 'grooming') {
          setIsGrooming(true);
          // Lower chance to show grooming message
          if (Math.random() < 0.3) {
            showMessage(getMoodMessage('grooming', moodRef.current));
          }
        } else if (Math.random() < 0.2) {
          // Lower chance to show idle message for other animations
          showMessage(getMoodMessage('idle', moodRef.current));
        }
        
        // Resume after idle animation (longer duration)
        setTimeout(() => {
          isIdleRef.current = false;
          setIsIdle(false);
          setIdleAnimation('');
          setIsGrooming(false);
        }, 3500 + Math.random() * 2500);
        
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

      // Going to bowl behavior
      if (behaviorStateRef.current === 'going-to-bowl' && targetPosRef.current) {
        const target = targetPosRef.current;
        const dx = target.x - pos.x;
        const dy = target.y - pos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > 40) {
          // Move towards bowl
          speed = 1.2;
          dir = { x: dx / dist, y: dy / dist };
          directionRef.current = dir;
          setFacingRight(dir.x >= 0);
        } else {
          // Reached bowl, start eating
          behaviorStateRef.current = 'eating';
          targetPosRef.current = null;
          isEatingRef.current = true;
          setIsEating(true);
          
          // Face the bowl (face right towards bowl)
          directionRef.current = { x: 1, y: 0 };
          setFacingRight(true);
          
          showMessage(getMoodMessage('eating', moodRef.current));
          
          // Eat for a few seconds
          const eatDuration = 3000 + Math.random() * 3000;
          setTimeout(() => {
            isEatingRef.current = false;
            setIsEating(false);
            behaviorStateRef.current = 'wandering';
            updateMood(15); // Eating makes Yuuki happy!
            
            // Increase fullness
            fullnessRef.current = Math.min(100, fullnessRef.current + 20);
            setFullness(fullnessRef.current);
            
            // Sometimes show satisfied message after eating
            if (Math.random() < 0.6) {
              showMessage("*satisfied purr* 😻");
            }
          }, eatDuration);
        }
        
        positionRef.current = { x: pos.x + dir.x * speed, y: pos.y + dir.y * speed };
        setPosition({ x: pos.x + dir.x * speed, y: pos.y + dir.y * speed });
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      // Curious behavior - slowly approach cursor (dynamically tracks cursor movement)
      if (isCuriousRef.current && targetPosRef.current) {
        // Update target to current cursor position for active tracking
        const mouseX = currentMousePosRef.current.x;
        const mouseY = currentMousePosRef.current.y;
        targetPosRef.current = { x: mouseX - 35, y: mouseY - 35 };
        
        const target = targetPosRef.current;
        const dx = target.x - pos.x;
        const dy = target.y - pos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > 60) {
          // Move towards cursor slowly
          speed = 0.9;
          dir = { x: dx / dist, y: dy / dist };
          directionRef.current = dir;
          setFacingRight(dir.x >= 0);
          
          positionRef.current = { x: pos.x + dir.x * speed, y: pos.y + dir.y * speed };
          setPosition({ x: pos.x + dir.x * speed, y: pos.y + dir.y * speed });
        } else {
          // Reached cursor, stop being curious
          isCuriousRef.current = false;
          setIsCurious(false);
          targetPosRef.current = null;
          behaviorStateRef.current = 'wandering';
          
          // Pause briefly to "investigate"
          pauseUntil = currentTime + 1500;
          const investigateMessages = [
            "*sniff* ...boring. 🐾",
            "*investigates* Hm. 🐾",
            "What are you doing? 👀",
            "*watches intently*",
            "Interesting... 🐱"
          ];
          showMessage(investigateMessages[Math.floor(Math.random() * investigateMessages.length)]);
        }
        
        animationRef.current = requestAnimationFrame(animate);
        return;
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
          setFacingRight(dir.x >= 0);
          
          newX = Math.max(30, Math.min(window.innerWidth - 100, newX));
          newY = Math.max(30, Math.min(window.innerHeight - 100, newY));
          
          lastDirectionChangeRef.current = currentTime;
        }

        // Periodic direction changes with varying probability
        if (currentTime - lastDirectionChangeRef.current > directionChangeInterval) {
          const changeProbability = 0.02 + (moodRef.current > 50 ? 0.015 : 0);
          
          if (Math.random() < changeProbability) {
            // Sometimes look towards cursor if nearby (more likely now)
            const distToCursor = Math.sqrt(Math.pow(mouseX - catX, 2) + Math.pow(mouseY - catY, 2));
            
            if (distToCursor < 500 && Math.random() < 0.4) {
              // Head towards cursor area (wants to be near you)
              const angleToMouse = Math.atan2(mouseY - catY, mouseX - catX);
              const offset = (Math.random() - 0.5) * Math.PI / 3;
              dir = { x: Math.cos(angleToMouse + offset), y: Math.sin(angleToMouse + offset) };
            } else {
              // Random direction
              const angle = Math.random() * Math.PI * 2;
              dir = { x: Math.cos(angle), y: Math.sin(angle) };
            }
            directionRef.current = dir;
            lastDirectionChangeRef.current = currentTime;
            
            // Update facing direction only when direction changes
            setFacingRight(dir.x >= 0);
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
        showMessage("Excuse me?! 😾");
      } else {
        showMessage("Do you mind?! 😼");
      }
    } else {
      // Shocked reaction when waking from sleep
      updateMood(-3);
      setIsShocked(true);
      showMessage("WHAT?! I WAS SLEEPING! 😱");
      
      // Remove shocked state after animation
      setTimeout(() => {
        setIsShocked(false);
        wakeUp();
      }, 500);
    }
  };

  // Handle petting (hover for 2 seconds)
  const handleMouseEnter = () => {
    lastInteractionRef.current = Date.now();
    
    // Start petting timer - requires 2 seconds of hovering
    if (pettingTimeoutRef.current) {
      clearTimeout(pettingTimeoutRef.current);
    }
    pettingTimeoutRef.current = setTimeout(() => {
      // Only trigger petting if not being carried
      if (!isCarryingRef.current) {
        setIsPetting(true);
        
        // Petting increases mood
        updateMood(MOOD.PETTING_BOOST);
        
        showMessage(getMoodMessage('petting', moodRef.current));
      }
    }, TIMING.PETTING_DELAY);
  };

  const handleMouseLeave = () => {
    setIsPetting(false);
    if (pettingTimeoutRef.current) {
      clearTimeout(pettingTimeoutRef.current);
    }
  };

  // Handle carrying (mouse down/up) - works for both mouse and touch
  const handleMouseDown = (e) => {
    e.preventDefault();
    lastInteractionRef.current = Date.now();
    lastMouseMoveRef.current = Date.now();
    isCarryingRef.current = true;
    setIsCarrying(true);
    setIsPetting(false);
    
    // Carrying slightly decreases mood unless cat is happy
    if (moodRef.current < 60) {
      updateMood(-2);
      
      // Make Yuuki irritated when picked up in bad mood
      if (moodRef.current < 50) {
        isIrritatedRef.current = true;
        setIsIrritated(true);
        
        // Clear previous irritation timeout
        if (irritatedTimeoutRef.current) {
          clearTimeout(irritatedTimeoutRef.current);
        }
        
        // Stay irritated for 8 seconds
        irritatedTimeoutRef.current = setTimeout(() => {
          isIrritatedRef.current = false;
          setIsIrritated(false);
        }, TIMING.IRRITATION_DURATION);
      }
    }
    
    showMessage(getMoodMessage('carrying', moodRef.current));
    
    // Cancel sleep timer while carrying
    if (sleepTimeoutRef.current) {
      clearTimeout(sleepTimeoutRef.current);
    }
  };

  // Track mouse/touch position globally and detect inactivity
  useEffect(() => {
    const trackMouse = (e) => {
      currentMousePosRef.current = { x: e.clientX, y: e.clientY };
      lastMouseMoveRef.current = Date.now();
    };
    
    const trackTouch = (e) => {
      if (e.touches.length > 0) {
        currentMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        lastMouseMoveRef.current = Date.now();
      }
    };
    
    window.addEventListener('mousemove', trackMouse, { passive: true });
    window.addEventListener('touchmove', trackTouch, { passive: true });
    window.addEventListener('touchstart', trackTouch, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', trackMouse);
      window.removeEventListener('touchmove', trackTouch);
      window.removeEventListener('touchstart', trackTouch);
    };
  }, []);

  // Inactivity detection - Yuuki falls asleep if no mouse movement for a while
  useEffect(() => {
    const checkInactivity = () => {
      const now = Date.now();
      const timeSinceLastMove = now - lastMouseMoveRef.current;
      
      // If awake and no mouse activity for threshold, fall asleep
      if (isAwakeRef.current && !isCarryingRef.current && !isEatingRef.current && 
          timeSinceLastMove > TIMING.INACTIVITY_SLEEP_THRESHOLD) {
        isAwakeRef.current = false;
        setIsAwake(false);
        setIsCurious(false);
        isCuriousRef.current = false;
        setIsIdle(false);
        isIdleRef.current = false;
        behaviorStateRef.current = 'sleeping';
        
        // Use inactivity-specific message
        const inactivityMsg = MESSAGES.inactivitySleep[Math.floor(Math.random() * MESSAGES.inactivitySleep.length)];
        showMessage(inactivityMsg, false); // Don't check for rare message here
        
        // Schedule next random wake
        scheduleRandomWake();
      }
    };
    
    inactivityCheckRef.current = setInterval(checkInactivity, 10000); // Check every 10 seconds
    
    return () => {
      if (inactivityCheckRef.current) {
        clearInterval(inactivityCheckRef.current);
      }
    };
  }, [showMessage, scheduleRandomWake]);

  // Handle mouse/touch move while carrying
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isCarryingRef.current) {
        const newX = e.clientX - 35; // Center the cat on cursor
        const newY = e.clientY - 35;
        positionRef.current = { x: newX, y: newY };
        setPosition({ x: newX, y: newY });
      }
    };
    
    const handleTouchMove = (e) => {
      if (isCarryingRef.current && e.touches.length > 0) {
        e.preventDefault(); // Prevent scrolling while carrying
        const newX = e.touches[0].clientX - 35;
        const newY = e.touches[0].clientY - 35;
        positionRef.current = { x: newX, y: newY };
        setPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      if (isCarryingRef.current) {
        isCarryingRef.current = false;
        setIsCarrying(false);
        
        // Check if dropped into/near the bowl (bowl is at left: 30px, bottom: 30px, 50x35px)
        // Using larger hitbox for easier detection
        const catX = positionRef.current.x + 35;
        const catY = positionRef.current.y + 70; // Check bottom of cat, not center
        
        // Generous bowl bounds for easier dropping
        const bowlLeft = 0;
        const bowlRight = 150;
        const bowlTop = window.innerHeight - 150;
        const bowlBottom = window.innerHeight;
        
        const inBowl = catX >= bowlLeft && catX <= bowlRight && catY >= bowlTop && catY <= bowlBottom;
        
        if (inBowl) {
          // Dropped into the bowl!
          // Check if too full (higher chance to refuse if fullness > 70)
          if (fullnessRef.current > 70 && Math.random() < 0.4) {
            const notHungryMessages = [
              "I'm not hungry... 😿",
              "*sniffs* Maybe later...",
              "Already ate! 🐱",
              "Full tummy~ 😴",
              "*looks away* Not now...",
              "Too full to eat! 💤"
            ];
            showMessage(notHungryMessages[Math.floor(Math.random() * notHungryMessages.length)]);
            
            // Wake up and wander away
            isAwakeRef.current = true;
            setIsAwake(true);
            const angle = Math.random() * Math.PI * 2;
            directionRef.current = { x: Math.cos(angle), y: Math.sin(angle) };
            setFacingRight(Math.cos(angle) >= 0);
          } else {
            // Position cat at bowl and eat
            const bowlEatY = window.innerHeight - 100;
            positionRef.current = { x: 30, y: bowlEatY };
            setPosition({ x: 30, y: bowlEatY });
            
            // Face the bowl
            directionRef.current = { x: 1, y: 0 };
            setFacingRight(true);
            
            isEatingRef.current = true;
            setIsEating(true);
            isAwakeRef.current = true;
            setIsAwake(true);
            behaviorStateRef.current = 'eating';
            
            // Increase fullness
            fullnessRef.current = Math.min(100, fullnessRef.current + 25);
            setFullness(fullnessRef.current);
            
            // Increase mood from being fed
            updateMood(10);
            
            // Reset irritation - food makes everything better!
            isIrritatedRef.current = false;
            setIsIrritated(false);
            if (irritatedTimeoutRef.current) {
              clearTimeout(irritatedTimeoutRef.current);
            }
            
            showMessage(getMoodMessage('eating', moodRef.current));
            
            // Eat for a while
            const eatDuration = 3000 + Math.random() * 2000;
            setTimeout(() => {
              isEatingRef.current = false;
              setIsEating(false);
              behaviorStateRef.current = 'wandering';
              
              // Random direction after eating
              const angle = Math.random() * Math.PI * 2;
              directionRef.current = { x: Math.cos(angle), y: Math.sin(angle) };
              setFacingRight(Math.cos(angle) >= 0);
              
              // Start sleep timer after eating
              if (sleepTimeoutRef.current) {
                clearTimeout(sleepTimeoutRef.current);
              }
              sleepTimeoutRef.current = setTimeout(() => {
                isAwakeRef.current = false;
                setIsAwake(false);
                showMessage(getMoodMessage('sleep', moodRef.current));
              }, 5000);
            }, eatDuration);
          }
          
          // Don't run the rest of the drop logic when eating
          return;
        } else {
          showMessage("*lands gracefully* 😼");
        }
        
        // Wake up the cat after being put down (only if not eating)
        isAwakeRef.current = true;
        setIsAwake(true);
        
        // Set a random direction after being put down
        const angle = Math.random() * Math.PI * 2;
        directionRef.current = { x: Math.cos(angle), y: Math.sin(angle) };
        setFacingRight(Math.cos(angle) >= 0);
        
        // Start sleep timer
        if (sleepTimeoutRef.current) {
          clearTimeout(sleepTimeoutRef.current);
        }
        sleepTimeoutRef.current = setTimeout(() => {
          if (!isEatingRef.current) {
            isAwakeRef.current = false;
            setIsAwake(false);
            showMessage(getMoodMessage('sleep', moodRef.current));
          }
        }, 4000);
      }
    };
    
    const handleTouchEnd = () => {
      handleMouseUp();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [showMessage]);

  // Detect cursor near cat while irritated and not in good mood - slap!
  useEffect(() => {
    const handleCursorApproach = (e) => {
      // Only punch if awake, irritated, not in good mood, not carrying, not eating, not already punching, not stretching, and not on cooldown
      if (!isAwakeRef.current || isCarryingRef.current || isEatingRef.current || punchCooldownRef.current || isStretchingRef.current || isPunchingRef.current) {
        lastMousePosRef.current = { x: e.clientX, y: e.clientY };
        return;
      }
      
      // Don't slap if in good mood or not irritated
      if (moodRef.current >= 60 || !isIrritatedRef.current) {
        lastMousePosRef.current = { x: e.clientX, y: e.clientY };
        return;
      }
      
      // Don't slap if cursor is near the bowl (feeding area)
      const bowlLeft = 0;
      const bowlRight = 150;
      const bowlTop = window.innerHeight - 150;
      const inBowlArea = e.clientX >= bowlLeft && e.clientX <= bowlRight && e.clientY >= bowlTop;
      if (inBowlArea) {
        lastMousePosRef.current = { x: e.clientX, y: e.clientY };
        return;
      }

      const catX = positionRef.current.x + 35; // Center of cat
      const catY = positionRef.current.y + 35;
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const currentDistance = Math.sqrt(
        Math.pow(mouseX - catX, 2) + Math.pow(mouseY - catY, 2)
      );
      
      // Update last position
      lastMousePosRef.current = { x: mouseX, y: mouseY };
      
      // Check if cursor is within punch range - slap immediately when irritated!
      const inPunchRange = currentDistance > 50 && currentDistance < 120;
      
      if (inPunchRange) {
        const punchDir = mouseX > catX ? 1 : -1;
        directionRef.current = { x: punchDir, y: 0 };
        setFacingRight(punchDir > 0);
        
        // Start punching
        setIsPunching(true);
        isPunchingRef.current = true;
        punchCooldownRef.current = true;

        showMessage(getMoodMessage('punch', moodRef.current));

        // End punch animation
        setTimeout(() => {
          setIsPunching(false);
          isPunchingRef.current = false;
        }, TIMING.PUNCH_DURATION);

        // Cooldown before next punch
        setTimeout(() => {
          punchCooldownRef.current = false;
        }, TIMING.PUNCH_COOLDOWN);
      }
    };

    window.addEventListener('mousemove', handleCursorApproach);
    return () => {
      window.removeEventListener('mousemove', handleCursorApproach);
    };
  }, [showMessage]);

  // Handle picking up food from bowl (works for both mouse and touch)
  const handleFoodPickup = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Get coordinates from touch or mouse event
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    if (!holdingFoodRef.current) {
      holdingFoodRef.current = true;
      setHoldingFood(true);
      foodPositionRef.current = { x: clientX - 10, y: clientY - 10 };
      setFoodPosition({ x: clientX - 10, y: clientY - 10 });
      
      // Yuuki notices the food!
      setIsWatchingFood(true);
      
      // Wake up if sleeping
      if (!isAwakeRef.current) {
        isAwakeRef.current = true;
        setIsAwake(true);
        showMessage("Is that food?! GIVE. 👀");
      } else {
        showMessage("Food! Hand it over! 😼");
      }
    }
  }, [showMessage]);

  // Handle food following cursor/touch
  useEffect(() => {
    if (!holdingFood) return;

    const handleMouseMove = (e) => {
      foodPositionRef.current = { x: e.clientX - 10, y: e.clientY - 10 };
      setFoodPosition({ x: e.clientX - 10, y: e.clientY - 10 });
      
      // Make Yuuki face towards the food
      const catCenterX = positionRef.current.x + 35;
      if (e.clientX > catCenterX) {
        directionRef.current = { x: 1, y: directionRef.current.y };
        setFacingRight(true);
      } else {
        directionRef.current = { x: -1, y: directionRef.current.y };
        setFacingRight(false);
      }
    };
    
    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const clientX = e.touches[0].clientX;
        const clientY = e.touches[0].clientY;
        foodPositionRef.current = { x: clientX - 10, y: clientY - 10 };
        setFoodPosition({ x: clientX - 10, y: clientY - 10 });
        
        // Make Yuuki face towards the food
        const catCenterX = positionRef.current.x + 35;
        if (clientX > catCenterX) {
          directionRef.current = { x: 1, y: directionRef.current.y };
          setFacingRight(true);
        } else {
          directionRef.current = { x: -1, y: directionRef.current.y };
          setFacingRight(false);
        }
      }
    };

    const handleDrop = (dropX, dropY) => {
      // Check if dropped on cat - use larger detection area
      const catX = positionRef.current.x;
      const catY = positionRef.current.y;
      
      // More generous detection (cat is 70x70, give 30px margin all around)
      const isOnCat = dropX >= catX - 30 && dropX <= catX + 100 && 
                      dropY >= catY - 30 && dropY <= catY + 100;
      
      if (isOnCat) {
        // Fed the cat!
        setIsBeingFed(true);
        setIsWatchingFood(false);
        
        // Show happy message
        showMessage(getMoodMessage('handFed', moodRef.current));
        
        // Big mood boost for hand feeding!
        updateMood(MOOD.HAND_FED_BOOST);
        
        // Reset sleep timer - Yuuki stays awake longer after being fed
        if (sleepTimeoutRef.current) {
          clearTimeout(sleepTimeoutRef.current);
        }
        sleepTimeoutRef.current = setTimeout(() => {
          if (!isCarryingRef.current && !isPunchingRef.current) {
            isAwakeRef.current = false;
            setIsAwake(false);
            behaviorStateRef.current = 'sleeping';
            showMessage("*food coma* Don't bother me. 😴");
            scheduleRandomWake();
          }
        }, 10000 + Math.random() * 5000);
        
        // Play eating animation
        setTimeout(() => {
          setIsBeingFed(false);
        }, 2000);
      } else {
        // Dropped but not on cat
        setIsWatchingFood(false);
        if (isAwakeRef.current) {
          showMessage("You DROPPED it?! Unbelievable. 😾");
          updateMood(MOOD.DROPPED_FOOD_PENALTY);
        }
      }
      
      // Release food
      holdingFoodRef.current = false;
      setHoldingFood(false);
    };
    
    const handleMouseUp = (e) => {
      handleDrop(e.clientX, e.clientY);
    };
    
    const handleTouchEnd = (e) => {
      // Use the last known touch position
      handleDrop(foodPositionRef.current.x + 10, foodPositionRef.current.y + 10);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [holdingFood, showMessage, updateMood, scheduleRandomWake]);

  return (
    <>
    {/* Floating food piece when holding */}
    {holdingFood && (
      <div 
        className="floating-food"
        style={{
          left: `${foodPosition.x}px`,
          top: `${foodPosition.y}px`
        }}
      />
    )}
    
    {/* Food Bowl */}
    <div 
      ref={bowlRef}
      className={`pet-bowl ${fullness < 50 ? 'bowl-full' : fullness < 80 ? 'bowl-half' : 'bowl-empty'}`}
      onMouseDown={handleFoodPickup}
      onTouchStart={handleFoodPickup}
    >
      <div className="bowl-rim"></div>
      <div className="bowl-inner">
        <div className="bowl-food">
          <div className="food-piece"></div>
          <div className="food-piece"></div>
          <div className="food-piece"></div>
          <div className="food-piece"></div>
          <div className="food-piece"></div>
        </div>
      </div>
      <div className="bowl-base"></div>
      <div className="bowl-label">Yuuki</div>
    </div>
    
    <div
      ref={catRef}
      className={`virtual-cat ${isAwake ? 'walking' : 'sleeping'} ${isPetting ? 'petting' : ''} ${isCarrying ? 'carrying' : ''} ${isShaking ? 'earthquake' : ''} ${isShocked ? 'shocked' : ''} ${isPunching ? 'punching' : ''} ${isStretching ? 'stretching' : ''} ${isIdle ? `idle ${idleAnimation}` : ''} ${isCurious ? 'curious' : ''} ${mood > 70 ? 'happy' : ''} ${mood < 30 ? 'grumpy' : ''} ${isThemeReacting ? (darkMode ? 'theme-dark' : 'theme-light') : ''} ${isGrooming ? 'grooming-active' : ''} ${isEating ? 'eating' : ''} ${isBeingFed ? 'being-fed' : ''} ${isWatchingFood ? 'watching-food' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `scaleX(${facingRight ? 1 : -1})`
      }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
    >
      <div 
        className="cat-nametag"
        style={{ '--flip': facingRight ? 1 : -1 }}
      >
        Yuuki
      </div>
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
          style={{ '--flip': facingRight ? 1 : -1 }}
        >
          <div className="speech-text">{speechBubble}</div>
          <div className="speech-arrow"></div>
        </div>
      )}
    </div>
    </>
  );
};

export default VirtualCat;