import { act, fireEvent, render, screen } from '@testing-library/react';
import WorldMusic from './WorldMusic';

afterEach(()=>{delete window.SC;});

test('music follows world playback, preserves mute, and keeps the same player',()=>{
  const handlers={};
  const player={bind:jest.fn((event,fn)=>{handlers[event]=fn;}),unbind:jest.fn(),play:jest.fn(),pause:jest.fn(),setVolume:jest.fn()};
  window.SC={Widget:Object.assign(jest.fn(()=>player),{Events:{READY:'ready',PLAY:'play',PAUSE:'pause',ERROR:'error'}})};
  const onOpen=jest.fn();
  const {rerender,unmount}=render(<WorldMusic playing={false} onOpen={onOpen} />);
  const frame=screen.getByTitle(/music player/i);
  expect(frame).toHaveAttribute('src',expect.stringContaining('soundcloud.com'));
  act(()=>handlers.ready());
  expect(player.pause).toHaveBeenCalled();
  rerender(<WorldMusic playing onOpen={onOpen} />);
  expect(player.play).toHaveBeenCalledTimes(1);
  act(()=>handlers.play());
  const details=screen.getByLabelText('Music controls').parentElement;
  details.open=true;fireEvent(details,new Event('toggle'));
  expect(onOpen).toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button',{name:'Mute'}));
  expect(player.setVolume).toHaveBeenLastCalledWith(0);
  fireEvent.click(screen.getByRole('button',{name:'Pause music'}));
  act(()=>handlers.pause());
  fireEvent.click(screen.getByRole('button',{name:'Play music'}));
  rerender(<WorldMusic playing={false} onOpen={onOpen} />);
  expect(player.pause).toHaveBeenCalledTimes(3);
  rerender(<WorldMusic playing onOpen={onOpen} />);
  expect(player.play).toHaveBeenCalledTimes(3);
  expect(player.setVolume).toHaveBeenLastCalledWith(0);
  fireEvent.keyDown(details,{key:'Escape'});
  expect(details.open).toBe(false);
  expect(screen.getByTitle(/music player/i)).toBe(frame);
  unmount();expect(player.unbind).toHaveBeenCalledTimes(4);
});

test('a late-loading player respects the latest paused state',()=>{
  const handlers={};
  const player={bind:(event,fn)=>{handlers[event]=fn;},unbind:jest.fn(),play:jest.fn(),pause:jest.fn(),setVolume:jest.fn()};
  window.SC={Widget:Object.assign(()=>player,{Events:{READY:'ready',PLAY:'play',PAUSE:'pause',ERROR:'error'}})};
  const {rerender}=render(<WorldMusic playing onOpen={()=>{}} />);
  rerender(<WorldMusic playing={false} onOpen={()=>{}} />);
  act(()=>handlers.ready());
  expect(player.play).not.toHaveBeenCalled();
  expect(player.pause).toHaveBeenCalledTimes(1);
});
