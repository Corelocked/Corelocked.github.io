import React, { useEffect, useRef, useState } from 'react';
import { getHighscore, setHighscore } from '../../utils/highscores';
import { blueprints, CREEPER_COUNT, MINE_SIZE, matchesBlueprint, neighbors, plantCreepers, revealTiles } from './arcadeRules';

const GAMES = [
  {id:'ore',title:'Ore Rush',symbol:'◆',tag:'MINING / 30 SECONDS',description:'Chase diamonds, collect gold, and keep your pick away from TNT.'},
  {id:'craft',title:'Crafting Bench',symbol:'▦',tag:'BUILDING / 4 BLUEPRINTS',description:'Choose your materials and rebuild each pattern, one square at a time.'},
  {id:'sweep',title:'Creeper Sweep',symbol:'☠',tag:'EXPLORATION / 64 TILES',description:'Read the numbers, mark the danger, and uncover a safe path through the mine.'},
];
const oreTypes = [
  {name:'Stone',symbol:'▪',points:1}, {name:'Gold',symbol:'▣',points:3},
  {name:'Diamond',symbol:'◆',points:5}, {name:'TNT',symbol:'TNT',points:-5},
];
const randomOre = () => { const n=Math.random();return n<.3?0:n<.65?1:n<.86?2:3; };
const materials = ['Empty','Wood','Stone','Gold','Diamond'];
const materialSymbols = ['','▥','▪','▣','◆'];

function OreRush() {
  const [tiles,setTiles]=useState(()=>Array.from({length:16},randomOre));
  const [phase,setPhase]=useState('ready');
  const [remaining,setRemaining]=useState(30);
  const [score,setScore]=useState(0);
  const [best,setBest]=useState(()=>getHighscore('voxel-ore'));
  const [notice,setNotice]=useState('Diamond +5 · Gold +3 · Stone +1 · TNT −5');
  const deadline=useRef(0), scoreRef=useRef(0), mined=useRef(new Set());
  useEffect(()=>{
    if (phase!=='playing') return;
    const timer=setInterval(()=>{
      const seconds=Math.max(0,Math.ceil((deadline.current-Date.now())/1000));
      setRemaining(seconds);
      if (!seconds) {
        setPhase('finished'); setHighscore('voxel-ore',scoreRef.current);setBest(getHighscore('voxel-ore'));
        setNotice(`Shift complete. You collected ${scoreRef.current} points. Ready for another run?`);
      }
    },100);
    const refill=setInterval(()=>{mined.current.clear();setTiles(Array.from({length:16},randomOre));},1600);
    return ()=>{clearInterval(timer);clearInterval(refill);};
  },[phase]);
  function start() {
    scoreRef.current=0;mined.current.clear();setScore(0);setRemaining(30);setTiles(Array.from({length:16},randomOre));
    deadline.current=Date.now()+30000;setPhase('playing');setNotice('Mine the good stuff. A fresh seam appears every 1.6 seconds.');
  }
  function mine(index) {
    if(phase!=='playing' || Date.now()>=deadline.current || mined.current.has(index))return;
    mined.current.add(index);
    const ore=oreTypes[tiles[index]];
    scoreRef.current=Math.max(0,scoreRef.current+ore.points);setScore(scoreRef.current);
    setNotice(`${ore.name}: ${ore.points>0?'+':''}${ore.points} points`);
    setTiles(previous=>previous.map((tile,i)=>i===index?-1:tile));
  }
  return <><div className="voxel-game-stats"><span>TIME <strong>{remaining}s</strong></span><span>LOOT <strong>{score}</strong></span><span>BEST <strong>{best}</strong></span></div>
    <div className="ore-board">{tiles.map((tile,index)=><button key={index} className={`ore-block ore-${tile}`} disabled={phase!=='playing'||tile<0} onClick={()=>mine(index)} aria-label={`Mine ${tile<0?'empty rock':oreTypes[tile].name}, block ${index+1}`}><span>{tile<0?'':oreTypes[tile].symbol}</span><small>{tile<0?'MINED':oreTypes[tile].name}</small></button>)}</div>
    <p className="voxel-game-notice" role="status">{notice}</p><button className="world-button" onClick={start}>{phase==='playing'?'Restart run':phase==='finished'?'Mine again':'Start mining'}</button><p className="voxel-game-tip">Click or tap blocks. Keyboard: Tab to a block, then Enter or Space. Leaving the game ends the run.</p></>;
}

function CraftingBench() {
  const [level,setLevel]=useState(0),[grid,setGrid]=useState(Array(9).fill(0)),[selected,setSelected]=useState(1),[crafted,setCrafted]=useState(false),[notice,setNotice]=useState('Copy the blueprint into your crafting grid.');
  const blueprint=blueprints[level];
  function craft() {
    if (!matchesBlueprint(grid,blueprint.pattern)) {setNotice('Not quite. Compare your grid with the blueprint, including the empty slots.');return;}
    setCrafted(true);setHighscore('voxel-crafting',level+1);setNotice(`${blueprint.name} crafted! ${level+1} of ${blueprints.length} blueprints complete.`);
  }
  function next() {setLevel((level+1)%blueprints.length);setGrid(Array(9).fill(0));setCrafted(false);setNotice('A fresh blueprint. Let’s build it.');}
  return <><div className="voxel-game-stats"><span>BLUEPRINT <strong>{level+1} / {blueprints.length}</strong></span><span>BUILD <strong>{blueprint.name}</strong></span></div><div className="craft-workspace"><div><h3>Blueprint</h3><div className="craft-grid craft-reference">{blueprint.pattern.map((value,index)=><div key={index} className={`material-${value}`} aria-label={`Row ${Math.floor(index/3)+1}, column ${index%3+1}: ${materials[value]}`}><span aria-hidden="true">{materialSymbols[value]}</span></div>)}</div></div><span className="craft-arrow" aria-hidden="true">→</span><div><h3>Your crafting grid</h3><div className="craft-grid">{grid.map((value,index)=><button key={index} className={`material-${value}`} onClick={()=>{if(!crafted)setGrid(previous=>previous.map((v,i)=>i===index?selected:v));}} disabled={crafted} aria-label={`Row ${Math.floor(index/3)+1}, column ${index%3+1}: ${materials[value]}`}><span aria-hidden="true">{materialSymbols[value]}</span></button>)}</div></div></div>
    <div className="craft-materials" aria-label="Choose a material">{materials.map((name,index)=><button key={name} aria-pressed={selected===index} onClick={()=>setSelected(index)}><span className={`material-${index}`}>{materialSymbols[index]||'×'}</span>{name==='Empty'?'Eraser':name}</button>)}</div><p className="voxel-game-notice" role="status">{notice}</p><button className="world-button" onClick={crafted?next:craft}>{crafted?(level===blueprints.length-1?'Play all blueprints again':'Next blueprint'):'Craft item'}</button><p className="voxel-game-tip">Select a material, then a square to place it. These are pattern puzzles inspired by block crafting.</p></>;
}

function CreeperSweep() {
  const [mines,setMines]=useState(null),[revealed,setRevealed]=useState(new Set()),[flags,setFlags]=useState(new Set()),[flagMode,setFlagMode]=useState(false),[phase,setPhase]=useState('ready');
  const lost=phase==='lost',won=phase==='won';
  function mark(index) {
    if(lost||won||revealed.has(index))return;
    setFlags(previous=>{const next=new Set(previous);if(next.has(index))next.delete(index);else if(next.size<CREEPER_COUNT)next.add(index);return next;});
  }
  function reveal(index) {
    if(lost||won||flags.has(index)||revealed.has(index))return;
    const planted=mines||plantCreepers(index);if(!mines)setMines(planted);
    if(planted.has(index)){setPhase('lost');return;}
    const next=revealTiles(index,planted,revealed,flags);setRevealed(next);
    if(next.size===MINE_SIZE*MINE_SIZE-CREEPER_COUNT){setPhase('won');setHighscore('voxel-sweep',1);}else setPhase('playing');
  }
  function reset(){setMines(null);setRevealed(new Set());setFlags(new Set());setPhase('ready');setFlagMode(false);}
  return <><div className="voxel-game-stats"><span>CREEPERS <strong>{CREEPER_COUNT}</strong></span><span>FLAGS <strong>{flags.size} / {CREEPER_COUNT}</strong></span><span>CLEARED <strong>{revealed.size} / {MINE_SIZE*MINE_SIZE-CREEPER_COUNT}</strong></span></div><div className="sweep-controls"><button aria-pressed={flagMode} onClick={()=>setFlagMode(!flagMode)}>{flagMode?'⚑ Flag mode':'⛏ Dig mode'} · Switch</button><button onClick={reset}>New mine</button></div><div className="creeper-board">{Array.from({length:MINE_SIZE*MINE_SIZE},(_,index)=>{
    const visible=revealed.has(index),isMine=mines?.has(index),count=mines?neighbors(index).filter(i=>mines.has(i)).length:0;
    const label=visible?`${count} nearby creepers`:lost&&isMine?'Creeper':flags.has(index)?'Flagged':'Unexplored';
    return <button key={index} className={`${visible?'revealed':''} ${lost&&isMine?'exploded':''}`} data-count={visible?count:''} onClick={()=>flagMode?mark(index):reveal(index)} onContextMenu={event=>{event.preventDefault();mark(index);}} disabled={lost||won} aria-label={`Row ${Math.floor(index/MINE_SIZE)+1}, column ${index%MINE_SIZE+1}: ${label}`}>{lost&&isMine?'☠':flags.has(index)?'⚑':visible?(count||'·'):''}</button>;
  })}</div><p className="voxel-game-notice" role="status">{lost?'Boom! A creeper found you. Start a new mine to try again.':won?'Mine secured! Every safe tile is uncovered.':phase==='ready'?'Your first dig and its neighbors are always safe.':'Numbers count nearby creepers. Clear every safe tile to win.'}</p><p className="voxel-game-tip">Click to dig. Right-click to flag, or switch to Flag mode on touch screens. Flagged squares are protected from digging.</p></>;
}

export default function VoxelArcade() {
  const [active,setActive]=useState(null);
  const heading=useRef(null);
  useEffect(()=>{
    heading.current?.focus({preventScroll:true});
    const dialog=heading.current?.closest('dialog');
    if(dialog)dialog.scrollTop=0;
  },[active]);
  const game=GAMES.find(item=>item.id===active);
  return <div className="world-collection voxel-arcade"><h1 ref={heading} tabIndex={-1}>{game?game.title:'Try a game.'}</h1><p className="world-panel-intro">{game?game.description:'A few mini-games I made for this site.'}</p>
    {game?<><button className="voxel-arcade-back" onClick={()=>setActive(null)}>← All mini-games</button><div className={`voxel-game-stage game-${active}`} key={active}>{active==='ore'?<OreRush />:active==='craft'?<CraftingBench />:<CreeperSweep />}</div></>:<div className="voxel-arcade-grid">{GAMES.map(item=><button key={item.id} className={`voxel-game-card card-${item.id}`} onClick={()=>setActive(item.id)}><div className="voxel-game-art" aria-hidden="true"><span>{item.symbol}</span><i /><i /><i /></div><small>{item.tag}</small><h2>{item.title}</h2><p>{item.description}</p><strong>Play game →</strong></button>)}</div>}
    <p className="voxel-game-tip">Personal bests are saved only in this browser.</p>
  </div>;
}
