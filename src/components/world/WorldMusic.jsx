import React, { useEffect, useRef, useState } from 'react';

export default function WorldMusic({ playing, onOpen }) {
  const frame = useRef(null);
  const widget = useRef(null);
  const [ready, setReady] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let disposed = false;
    let player;
    let events;
    const connect = () => {
      if (disposed || !window.SC?.Widget) return;
      player = window.SC.Widget(frame.current);
      widget.current = player;
      events = window.SC.Widget.Events;
      player.bind(events.READY, () => { if (!disposed) setReady(true); });
      player.bind(events.PLAY, () => { if (!disposed) setAudioPlaying(true); });
      player.bind(events.PAUSE, () => { if (!disposed) setAudioPlaying(false); });
      player.bind(events.ERROR, () => { if (!disposed) { setError(true); setAudioPlaying(false); } });
    };
    let script;
    if (window.SC?.Widget) connect();
    else {
      script = document.createElement('script');
      script.src = 'https://w.soundcloud.com/player/api.js';
      script.async = true;
      script.onload = connect;
      script.onerror = () => { if (!disposed) setError(true); };
      document.body.appendChild(script);
    }
    return () => {
      disposed = true;
      if (player) { player.pause(); [events.READY, events.PLAY, events.PAUSE, events.ERROR].forEach(event => player.unbind(event)); }
      widget.current = null;
      script?.remove();
    };
  }, []);

  useEffect(() => { if (ready) widget.current.setVolume(muted ? 0 : 35); }, [ready, muted]);
  useEffect(() => {
    if (!ready) return;
    if (playing) widget.current.play();
    else widget.current.pause();
  }, [playing, ready]);

  return <details className="world-music" onToggle={event => {
    if (event.currentTarget.open) onOpen();
  }} onKeyDown={event => {
    if (event.key === 'Escape') { event.stopPropagation(); event.currentTarget.open = false; event.currentTarget.querySelector('summary').focus(); }
  }}>
    <summary aria-label="Music controls" title="Music" className={audioPlaying && !muted ? 'music-active' : ''}>♪</summary>
    <div className="world-music-player">
      <div className="world-music-controls"><button disabled={!ready || error} onClick={() => audioPlaying ? widget.current.pause() : widget.current.play()}>{audioPlaying ? 'Pause music' : 'Play music'}</button><button aria-pressed={muted} onClick={() => setMuted(!muted)}>{muted ? 'Unmute' : 'Mute'}</button></div>
      <iframe ref={frame} title="C418 — Minecraft Volume Alpha music player" src="https://w.soundcloud.com/player/?url=https%3A%2F%2Fsoundcloud.com%2Fc418%2Fsets%2Fminecraft-volume-alpha-4&auto_play=false&color=%2396b76c&show_artwork=true&show_user=true&show_reposts=false&show_comments=false&visual=false" allow="autoplay" />
      {error && <p role="status">Music is unavailable right now.</p>}
      <a href="https://soundcloud.com/c418/sets/minecraft-volume-alpha-4" target="_blank" rel="noreferrer">C418 · Minecraft Volume Alpha ↗</a>
    </div>
  </details>;
}
