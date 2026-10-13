import { act, fireEvent, render, screen } from '@testing-library/react';
import VoxelArcade from './VoxelArcade';
import { blueprints, plantCreepers } from './arcadeRules';
import { getHighscore } from '../../utils/highscores';

afterEach(()=>{jest.restoreAllMocks();jest.useRealTimers();localStorage.clear();});

test('ore mining scores once per block, ends at thirty seconds, and saves the best',()=>{
  jest.useFakeTimers();jest.spyOn(Math,'random').mockReturnValue(.75);
  render(<VoxelArcade />);
  fireEvent.click(screen.getByRole('button',{name:/ore rush/i}));
  fireEvent.click(screen.getByRole('button',{name:'Start mining'}));
  const diamond=screen.getByRole('button',{name:'Mine Diamond, block 1'});
  fireEvent.click(diamond);fireEvent.click(diamond);
  act(()=>jest.advanceTimersByTime(30000));
  expect(screen.getByRole('status')).toHaveTextContent('5 points');
  expect(screen.getByRole('button',{name:'Mine again'})).toBeInTheDocument();
  expect(screen.getAllByRole('button',{name:/mine diamond/i})[0]).toBeDisabled();
  expect(getHighscore('voxel-ore')).toBe(5);
});

test('crafting rejects a wrong grid and progresses through all four blueprints',()=>{
  const {container}=render(<VoxelArcade />);
  fireEvent.click(screen.getByRole('button',{name:/crafting bench/i}));
  fireEvent.click(screen.getByRole('button',{name:'Craft item'}));
  expect(screen.getByRole('status')).toHaveTextContent('Not quite');
  blueprints.forEach(({pattern,name},level)=>{
    pattern.forEach((value,index)=>{
      fireEvent.click(container.querySelectorAll('.craft-materials button')[value]);
      fireEvent.click(container.querySelectorAll('.craft-grid button')[index]);
    });
    fireEvent.click(screen.getByRole('button',{name:'Craft item'}));
    expect(screen.getByRole('status')).toHaveTextContent(`${name} crafted!`);
    if(level<3)fireEvent.click(screen.getByRole('button',{name:'Next blueprint'}));
  });
  fireEvent.click(screen.getByRole('button',{name:'Play all blueprints again'}));
  expect(screen.getByRole('button',{name:'Craft item'})).toBeInTheDocument();
});

test('creeper sweep supports flags, losing, resetting, and winning',()=>{
  jest.spyOn(Math,'random').mockReturnValue(.5);
  const {container}=render(<VoxelArcade />);
  fireEvent.click(screen.getByRole('button',{name:/creeper sweep/i}));
  const cells=()=>container.querySelectorAll('.creeper-board button');
  const mines=plantCreepers(0,()=>.5),mine=[...mines][0];
  fireEvent.contextMenu(cells()[mine]);
  fireEvent.click(cells()[mine]);
  expect(cells()[mine]).toHaveAccessibleName(/Flagged/);
  fireEvent.click(cells()[0]);
  fireEvent.contextMenu(cells()[mine]);
  fireEvent.click(cells()[mine]);
  expect(screen.getByRole('status')).toHaveTextContent('Boom!');
  fireEvent.click(screen.getByRole('button',{name:'New mine'}));
  fireEvent.click(cells()[0]);
  for(let index=0;index<64;index++)if(!mines.has(index))fireEvent.click(cells()[index]);
  expect(screen.getByRole('status')).toHaveTextContent('Mine secured!');
  expect(cells()[0]).toBeDisabled();
});
