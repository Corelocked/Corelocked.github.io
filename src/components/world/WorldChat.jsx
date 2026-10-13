import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCareerAssistantReply } from '../../utils/careerAssistant';
import { projects } from '../../data/projects';
import { certificateDetails } from '../../data/certificates';
import { skillCategories } from '../Skills';

export default function WorldChat({ open, onClose }) {
  const [messages, setMessages] = useState([{ author: 'Assistant', text: 'Hi! Ask me about Cedric’s work or experience.' }]);
  const [draft, setDraft] = useState('');
  const context = useRef({});
  const input = useRef(null);
  const log = useRef(null);
  const panel = useRef(null);
  useEffect(() => {
    if (open) { if (!panel.current.open) panel.current.showModal(); input.current?.focus(); }
    else if (panel.current.open) panel.current.close();
  }, [open]);
  useEffect(() => { if (open && log.current) log.current.scrollTop = log.current.scrollHeight; }, [open,messages]);
  const close = (resume = true) => { panel.current.close(); onClose(resume); };
  const send = event => {
    event.preventDefault();
    const question = draft.trim();
    if (!question) return;
    setDraft('');
    if (question.toLowerCase() === '/clear') { setMessages([{ author:'Assistant',text:'Chat cleared.' }]); context.current={}; return; }
    let response;
    if (question.toLowerCase() === '/help') response={text:'Ask about projects, skills, experience, awards, or contact. /clear clears the conversation. Escape closes chat. T opens it again.'};
    else {
      response=getCareerAssistantReply(question,context.current,projects,skillCategories,certificateDetails.map(certificate=>({text:`${certificate.title}. ${certificate.description}`,href:'/#certificates',label:'Achievements'})));
      context.current={lastIntent:response.intent,lastTopic:response.topic};
    }
    setMessages(previous=>[...previous.slice(-78),{author:'You',text:question},{author:'Assistant',text:response.text,references:response.references}]);
  };
  return <dialog ref={panel} aria-labelledby="world-chat-title" className="world-chat" onCancel={event=>{event.preventDefault();close();}} onKeyDown={event=>event.stopPropagation()}>
    <header><div><h2 id="world-chat-title">ASK ABOUT CEDRIC</h2><p>Portfolio assistant</p></div><button onClick={()=>close()} aria-label="Close chat">×</button></header>
    <div className="world-chat-log" ref={log} role="log" aria-live="polite" aria-relevant="additions">{messages.map((message,index)=><div className={`world-chat-message ${message.author==='You'?'from-player':''}`} key={index}><strong>&lt;{message.author}&gt;</strong> {message.text}{message.references?.length>0 && <nav aria-label="Related portfolio pages">{message.references.map(reference=><Link key={reference.href} to={reference.href} onClick={()=>close(false)}>{reference.label} ↗</Link>)}</nav>}</div>)}</div>
    <form onSubmit={send}><span aria-hidden="true">&gt;</span><input ref={input} aria-label="Message the portfolio assistant" placeholder="Ask a question…" value={draft} onChange={event=>setDraft(event.target.value)} maxLength={500} autoComplete="off" /><button type="submit" disabled={!draft.trim()}>Send ↵</button></form>
    <p className="world-chat-hint">Esc to close · /help for commands</p>
  </dialog>;
}
