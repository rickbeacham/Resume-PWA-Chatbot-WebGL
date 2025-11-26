import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { RESUME_DATA, EXPERIENCE_DATA, SKILLS_DATA, EDUCATION_DATA } from './constants';
import { SectionId, ChatMessage } from './types';

// --- Shader Background Component ---
const ShaderBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    // Vertex Shader: Simple full-screen quad
    const vsSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Fragment Shader: Mesh Gradient / Aurora Effect
    const fsSource = `
      precision mediump float;
      uniform vec2 u_resolution;
      uniform float u_time;

      void main() {
        // Normalize coordinates with aspect ratio correction
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        st.x *= u_resolution.x / u_resolution.y;

        // Base background color (White)
        vec3 color = vec3(1.0);

        float t = u_time * 0.4;

        // Blob 1: Apple Blue
        // Circular motion with varying radius
        vec2 pos1 = vec2(0.5 + 0.3 * sin(t), 0.5 + 0.2 * cos(t * 0.8));
        float d1 = length(st - pos1);
        // Gaussian falloff for smooth mesh gradient look - Increased opacity
        color = mix(color, vec3(0.0, 0.47, 0.95), 0.20 * exp(-d1 * 2.5)); 

        // Blob 2: Purple/Pink
        vec2 pos2 = vec2(0.6 + 0.4 * sin(t * 0.7 + 2.0), 0.4 + 0.3 * sin(t * 0.5 + 1.0));
        float d2 = length(st - pos2);
        color = mix(color, vec3(0.7, 0.2, 0.9), 0.15 * exp(-d2 * 3.0));

        // Blob 3: Soft Cyan/Mint
        vec2 pos3 = vec2(0.4 + 0.3 * cos(t * 0.6 + 4.0), 0.6 + 0.3 * cos(t * 0.9 + 2.0));
        float d3 = length(st - pos3);
        color = mix(color, vec3(0.2, 0.9, 0.85), 0.18 * exp(-d3 * 2.5));

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    // Helper to compile shaders
    const compileShader = (source: string, type: number) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(vsSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(fsSource, gl.FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    // Set up buffers (Full screen quad)
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
       1.0,  1.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // Attribute/Uniform Locations
    const positionLocation = gl.getAttribLocation(program, 'position');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const timeLocation = gl.getUniformLocation(program, 'u_time');

    let animationFrameId: number;
    const startTime = Date.now();

    const render = () => {
      // Resize handling
      const displayWidth = window.innerWidth;
      const displayHeight = window.innerHeight;
      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, displayWidth, displayHeight);
      }

      gl.useProgram(program);
      gl.enableVertexAttribArray(positionLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, (Date.now() - startTime) * 0.001);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};

// --- Chat Component ---
const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '0', role: 'model', text: 'Hi! I am Rick\'s AI assistant. Ask me anything about his experience or skills.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        throw new Error("API Key not configured");
      }
      
      const ai = new GoogleGenAI({ apiKey });
      
      const context = `
        You are an AI assistant for Rick Beacham. 
        Summary: ${RESUME_DATA.about}
        Skills: ${SKILLS_DATA.map(s => s.items.join(', ')).join(', ')}.
        Experience: ${EXPERIENCE_DATA.map(e => `${e.role} at ${e.company} (${e.period}): ${e.details.join(' ')}`).join('\n')}
        Education: ${EDUCATION_DATA[0].degree} from ${EDUCATION_DATA[0].school}.
        
        Answer questions concisely and professionally based ONLY on this info.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        config: { systemInstruction: context },
        contents: userMsg.text,
      });

      const modelMsg: ChatMessage = { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        text: response.text || "I couldn't generate a response." 
      };
      setMessages(prev => [...prev, modelMsg]);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: "Sorry, I'm currently offline. Please contact Rick directly via email." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[350px] max-w-[90vw] bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl overflow-hidden flex flex-col animate-fade-in-up origin-bottom-right">
          <div className="bg-gray-100/50 p-4 border-b border-gray-200/50 flex justify-between items-center">
            <h3 className="font-semibold text-sm text-gray-800">Assistant</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-800">&times;</button>
          </div>
          <div className="h-80 overflow-y-auto p-4 space-y-4 bg-white/40">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-3 bg-gray-50/50 border-t border-gray-200/50">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about Rick..."
                className="flex-1 bg-white border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="bg-blue-600 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? '...' : '↑'}
              </button>
            </div>
          </div>
        </div>
      )}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-900 text-white rounded-full p-4 shadow-lg hover:scale-105 transition-transform duration-300 flex items-center gap-2"
        aria-label="Open Chat"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
      </button>
    </div>
  );
};

// --- Main App Component ---
export default function App() {
  const [activeSection, setActiveSection] = useState<SectionId>(SectionId.HERO);

  const scrollTo = (id: SectionId) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(id);
  };

  const handleDownloadResume = () => {
    // In a real app, this would link to a static PDF file.
    // For this portfolio demo, we trigger print dialog which allows "Save as PDF".
    window.print();
  };

  return (
    <div className="min-h-screen bg-transparent font-sans text-gray-900 relative">
      <ShaderBackground />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 glass h-14 flex items-center justify-center transition-all duration-300">
        <div className="max-w-4xl w-full px-6 flex justify-between items-center">
          <div className="text-sm font-semibold tracking-tight text-gray-900 cursor-pointer" onClick={() => scrollTo(SectionId.HERO)}>
            {RESUME_DATA.name}
          </div>
          <div className="hidden md:flex gap-6 text-xs font-medium text-gray-500">
            {[SectionId.ABOUT, SectionId.EXPERIENCE, SectionId.SKILLS, SectionId.EDUCATION].map((id) => (
              <button 
                key={id} 
                onClick={() => scrollTo(id)}
                className={`capitalize hover:text-gray-900 transition-colors ${activeSection === id ? 'text-gray-900' : ''}`}
              >
                {id}
              </button>
            ))}
          </div>
          <button 
            onClick={() => window.open(`mailto:${RESUME_DATA.contact.email}`)}
            className="text-xs bg-gray-900 text-white px-3 py-1.5 rounded-full hover:bg-gray-700 transition-colors"
          >
            Contact
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-32 pb-24 space-y-32 relative z-10">
        {/* Hero */}
        <section id={SectionId.HERO} className="min-h-[60vh] flex flex-col justify-center items-start animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
            Full-Stack Developer.<br />
            SRE Expert.<br />
            <span className="text-gray-400">Builder.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 max-w-2xl leading-relaxed mb-8">
            {RESUME_DATA.tagline}
          </p>
          <button 
            onClick={handleDownloadResume}
            className="group bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Download Resume
          </button>
        </section>

        {/* About */}
        <section id={SectionId.ABOUT} className="space-y-8">
          <h2 className="text-3xl font-bold tracking-tight">About</h2>
          <div className="prose prose-lg text-gray-600 leading-relaxed bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-sm">
            <p>{RESUME_DATA.about}</p>
          </div>
          <div className="flex gap-4">
             {RESUME_DATA.socials.linkedin && (
                 <a href={RESUME_DATA.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">LinkedIn</a>
             )}
             {RESUME_DATA.socials.github && (
                 <a href={RESUME_DATA.socials.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">GitHub</a>
             )}
          </div>
        </section>

        {/* Experience */}
        <section id={SectionId.EXPERIENCE} className="space-y-12">
          <h2 className="text-3xl font-bold tracking-tight">Experience</h2>
          <div className="space-y-16">
            {EXPERIENCE_DATA.map((job) => (
              <div key={job.id} className="group grid md:grid-cols-[1fr_3fr] gap-6">
                <div className="text-sm text-gray-400 font-medium pt-1">
                  {job.period}
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{job.role}</h3>
                    <div className="text-gray-500 font-medium">{job.company}</div>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <p className="text-gray-600 leading-relaxed mb-4">{job.description}</p>
                    <ul className="space-y-2 mb-4">
                      {job.details.map((detail, idx) => (
                        <li key={idx} className="text-gray-600 text-sm leading-relaxed flex items-start">
                          <span className="mr-2 text-gray-300">•</span>
                          {detail}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-2">
                      {job.technologies?.map(tech => (
                        <span key={tech} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section id={SectionId.SKILLS} className="space-y-12">
          <h2 className="text-3xl font-bold tracking-tight">Skills</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {SKILLS_DATA.map((skillGroup) => (
              <div key={skillGroup.category} className="p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm hover:shadow-md transition-all duration-300">
                <h3 className="font-semibold text-gray-900 mb-4">{skillGroup.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {skillGroup.items.map((skill) => (
                    <span key={skill} className="px-3 py-1.5 bg-white border border-gray-200 shadow-sm rounded-full text-sm text-gray-700">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section id={SectionId.EDUCATION} className="space-y-8 pb-12 border-b border-gray-100">
          <h2 className="text-3xl font-bold tracking-tight">Education</h2>
          {EDUCATION_DATA.map((edu, idx) => (
            <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{edu.school}</h3>
                <div className="text-gray-600">{edu.degree}</div>
              </div>
              <div className="text-gray-400 text-sm mt-2 md:mt-0">{edu.year}</div>
            </div>
          ))}
        </section>

        {/* Footer */}
        <footer className="pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} {RESUME_DATA.name}. All rights reserved.</p>
          <p className="mt-2 text-xs">Built with React, Tailwind, and Gemini.</p>
        </footer>
      </main>

      <ChatWidget />
    </div>
  );
}