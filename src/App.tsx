/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  History, 
  MessageSquare, 
  Compass, 
  User, 
  Search, 
  ChevronRight, 
  ArrowLeft,
  Send,
  Loader2,
  Building2,
  Calendar,
  MapPin,
  Lightbulb,
  RefreshCcw,
  Sparkles,
  Download,
  Share2,
  Box,
  Moon,
  Sun
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Message, Period, Building } from './types';
import { sendMessage } from './services/gemini';
import { PERIODS, FAMOUS_BUILDINGS, ARCHITECTURAL_FACTS, ARCHITECTS, HISTORICAL_EVENTS } from './constants';

type Screen = 'home' | 'explore' | 'chat' | 'building-detail' | 'architects' | 'architect-detail' | 'search' | 'visionary';

const ModelViewer = 'model-viewer' as any;

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Welcome to the **Archivio**. I am your architectural historian. You can ask me about any era, specific buildings, or the lives of great architects. \n\nWhere shall we begin our journey through structural history?",
      timestamp: Date.now(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [selectedArchitect, setSelectedArchitect] = useState<any>(null);
  const [show3D, setShow3D] = useState(false);
  const [currentFact, setCurrentFact] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [architectSearch, setArchitectSearch] = useState('');
  const [visionPrompt, setVisionPrompt] = useState('');
  const [visionImage, setVisionImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVisions, setGeneratedVisions] = useState<{prompt: string, url: string}[]>([]);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);
  const [showShareToast, setShowShareToast] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    if (!selectedBuilding) return;
    
    const shareData = {
      title: `Archivio: ${selectedBuilding.name}`,
      text: `Check out the ${selectedBuilding.name} on Archivio!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShowShareToast(true);
        setTimeout(() => setShowShareToast(false), 2000);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const InteractiveTimeline = ({ buildingYear }: { buildingYear: number }) => {
    // Determine context window
    const windowSize = buildingYear < 0 ? 800 : 150;
    const min = buildingYear - windowSize / 2;
    const max = buildingYear + windowSize / 2;
    
    const relevantEvents = HISTORICAL_EVENTS.filter(e => e.year >= min && e.year <= max);
    
    return (
      <div className="space-y-4">
        <h2 className="text-sm uppercase font-bold tracking-widest text-[#38bdf8]">Timeline Context</h2>
        <div className="bg-[var(--bg-accent)] p-8 rounded-[40px] border border-[var(--border-color)] overflow-hidden">
          <div className="relative h-2 bg-[var(--text-main)]/10 rounded-full mb-12">
            {/* Building Indicator */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-1/2 -translate-y-1/2 h-6 w-6 bg-[#38bdf8] border-4 border-[var(--bg-accent)] rounded-full z-10 shadow-lg"
              style={{ left: `${((buildingYear - min) / (max - min)) * 100}%` }}
            >
              <div className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold text-[#38bdf8] uppercase tracking-tighter">
                Built {selectedBuilding?.year}
              </div>
            </motion.div>

            {/* Events */}
            {relevantEvents.map((event, idx) => {
              const pos = ((event.year - min) / (max - min)) * 100;
              return (
                <div 
                  key={idx}
                  className="absolute top-1/2 -translate-y-1/2 group"
                  style={{ left: `${pos}%` }}
                >
                  <div className={`w-1 h-3 ${event.type === 'movement' ? 'bg-[#38bdf8]/60' : 'bg-[var(--text-muted)]'} rounded-full`} />
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--bg-card)] border border-[var(--border-color)] px-2 py-1 rounded text-[8px] whitespace-nowrap z-20 shadow-xl pointer-events-none">
                    <span className="font-bold mr-1">{event.year < 0 ? Math.abs(event.year) + ' BC' : event.year}</span>
                    <span className="italic">{event.name}</span>
                  </div>
                  <div className={`absolute top-4 left-1/2 -translate-x-1/2 text-[8px] font-mono whitespace-pre text-center leading-none text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors ${idx % 2 === 0 ? 'mt-0' : 'mt-4'}`}>
                    {event.name.split(' ').join('\n')}
                  </div>
                </div>
              );
            })}

            {/* Scale extremes */}
            <div className="absolute -left-1 -bottom-6 text-[8px] font-mono text-[var(--text-muted)]">
              {min < 0 ? Math.abs(Math.floor(min)) + ' BC' : Math.floor(min)}
            </div>
            <div className="absolute -right-1 -bottom-6 text-[8px] font-mono text-[var(--text-muted)] text-right">
              {max < 0 ? Math.abs(Math.floor(max)) + ' BC' : Math.floor(max)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleGenerateVision = async () => {
    if (!visionPrompt.trim()) return;
    setIsGenerating(true);
    setVisionImage(null);

    // Using an educational/demo API endpoint for real-time generation
    const encodedPrompt = encodeURIComponent(visionPrompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=1000&model=flux&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;
    
    // Pre-load image to ensure it's ready before showing
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      setVisionImage(imageUrl);
      setGeneratedVisions(prev => [{ prompt: visionPrompt, url: imageUrl }, ...prev]);
      setIsGenerating(false);
    };
    img.onerror = () => {
      setIsGenerating(false);
      // Fallback or error state
    };
  };

  const refreshFact = () => {
    const randomIndex = Math.floor(Math.random() * ARCHITECTURAL_FACTS.length);
    setCurrentFact(ARCHITECTURAL_FACTS[randomIndex]);
  };

  useEffect(() => {
    if (currentScreen === 'home') {
      refreshFact();
    }
  }, [currentScreen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text?: string) => {
    const messageText = text || inputText;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    const response = await sendMessage([...messages, userMessage]);
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsTyping(false);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col p-6 space-y-8 overflow-y-auto pb-32 h-full"
          >
            <header className="flex justify-between items-start pt-4">
              <div className="space-y-2">
                <h1 className="text-4xl font-serif font-bold tracking-tight">Archivio</h1>
                <p className="text-[var(--text-muted)] font-medium uppercase tracking-widest text-[10px]">Architectural History Archives</p>
              </div>
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="w-10 h-10 rounded-full border border-[var(--border-color)] flex items-center justify-center hover:bg-[var(--bg-accent)] transition-colors"
              >
                {isDarkMode ? <Sun className="w-5 h-5 text-[#38bdf8]" /> : <Moon className="w-5 h-5 text-black/40" />}
              </button>
            </header>

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-serif">Historical Eras</h2>
                <button 
                  onClick={() => setCurrentScreen('explore')}
                  className="text-xs font-semibold text-[#38bdf8] flex items-center"
                >
                  View All <ChevronRight className="w-3 h-3 ml-1" />
                </button>
              </div>
              <div className="flex space-x-4 overflow-x-auto pb-4 no-scrollbar">
                {PERIODS.map((period) => (
                  <button 
                    key={period.id}
                    className="flex-shrink-0 w-64 group"
                    onClick={() => {
                      // Trigger a chat context or explore
                    }}
                  >
                    <div className="relative h-48 overflow-hidden rounded-3xl">
                      <img 
                        src={period.image} 
                        alt={period.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 text-left">
                        <p className="text-[10px] font-bold text-white/60 tracking-wider uppercase mb-1">{period.years}</p>
                        <h3 className="text-white text-xl font-serif font-medium">{period.name}</h3>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-serif">Did You Know?</h2>
                <button 
                  onClick={refreshFact}
                  className="p-2 rounded-full hover:bg-[var(--bg-accent)] transition-colors"
                >
                  <RefreshCcw className="w-4 h-4 text-[var(--text-muted)]" />
                </button>
              </div>
              <motion.div 
                key={currentFact}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-[#38bdf8]/10 p-6 rounded-[32px] border border-[#38bdf8]/20 relative overflow-hidden"
              >
                <Lightbulb className="absolute -right-4 -top-4 w-24 h-24 text-[#38bdf8]/10 rotate-12" />
                <p className="text-sm font-serif italic leading-relaxed text-[var(--text-main)]/80 relative z-10">
                  "{currentFact}"
                </p>
              </motion.div>
            </section>

            <section className="space-y-4">
              {FAMOUS_BUILDINGS.map((building) => (
                <div 
                  key={building.id}
                  className="arch-card cursor-pointer group"
                  onClick={() => {
                    setSelectedBuilding(building);
                    setShow3D(false);
                    setCurrentScreen('building-detail');
                  }}
                >
                  <div className="aspect-[16/9] w-full">
                    <img 
                      src={building.image} 
                      alt={building.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-serif font-bold">{building.name}</h3>
                      <span className="px-2 py-1 bg-[var(--primary)] text-[10px] text-[var(--primary-foreground)] rounded font-bold uppercase tracking-wider">{building.style}</span>
                    </div>
                    <p className="text-sm text-[var(--text-muted)] line-clamp-2 leading-relaxed">{building.description}</p>
                  </div>
                </div>
              ))}
            </section>
          </motion.div>
        );

      case 'explore':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col h-full bg-[var(--bg-main)] overflow-hidden pb-24"
          >
             <div className="p-6 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--nav-bg)] backdrop-blur-md sticky top-0 z-10">
                <h1 className="text-2xl font-serif font-bold italic">Explore Eras</h1>
             </div>
             <div className="overflow-y-auto p-4 space-y-4">
                {PERIODS.map((period) => (
                  <div 
                    key={period.id}
                    className="relative h-[240px] rounded-[32px] overflow-hidden group cursor-pointer"
                    onClick={() => {
                      const text = `Tell me about the ${period.name} period.`;
                      setCurrentScreen('chat');
                      handleSend(text);
                    }}
                  >
                    <img src={period.image} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" alt={period.name} referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                      <span className="text-[11px] font-bold text-white/80 tracking-[0.2em] uppercase mb-1">{period.years}</span>
                      <h3 className="text-3xl font-serif text-white mb-2">{period.name}</h3>
                      <p className="text-sm text-white/70 line-clamp-2 max-w-[80%] leading-relaxed">{period.description}</p>
                    </div>
                  </div>
                ))}
             </div>
          </motion.div>
        );

      case 'chat':
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-full bg-[var(--bg-main)] relative pb-24"
          >
            <div className="p-6 border-b border-[var(--border-color)] flex items-center bg-[var(--nav-bg)] backdrop-blur-md sticky top-0 z-10">
              <History className="w-5 h-5 mr-3 text-[#38bdf8]" />
              <div>
                <h1 className="text-lg font-serif font-bold leading-none">Archives Chat</h1>
                <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] mt-1 font-bold">Expert AI Historian</p>
              </div>
            </div>

            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6"
            >
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                  <MessageSquare className="w-12 h-12 stroke-[1px]" />
                  <p className="text-sm font-medium italic">Ask about a building, architect, or era...</p>
                </div>
              )}
              {messages.map((m) => (
                <div 
                  key={m.id}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-2xl ${
                    m.role === 'user' 
                      ? 'bg-[var(--primary)] text-[var(--primary-foreground)] rounded-tr-none' 
                      : 'bg-[var(--bg-card)] text-[var(--text-main)] rounded-tl-none border border-[var(--border-color)] shadow-sm'
                  }`}>
                    {m.role === 'assistant' ? (
                      <div className="prose-markdown text-sm leading-relaxed">
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                    )}
                    <time className={`text-[9px] mt-2 block opacity-40 font-mono ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                      {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </time>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[var(--bg-card)] p-4 rounded-2xl rounded-tl-none border border-[var(--border-color)] animate-pulse flex items-center">
                    <Loader2 className="w-4 h-4 animate-spin text-[var(--text-muted)]" />
                  </div>
                </div>
              )}
            </div>

            <div className="absolute bottom-28 left-6 right-6 flex items-center bg-[var(--bg-accent)] rounded-full p-2 pl-6 shadow-sm border border-[var(--border-color)]">
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ex: Who designed the Parthenon?"
                className="flex-1 bg-transparent border-none outline-none text-sm font-medium placeholder:text-[var(--text-muted)]"
              />
              <button 
                onClick={() => handleSend()}
                disabled={isTyping}
                className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-[var(--primary-foreground)] ml-2 transition-transform active:scale-90 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        );

      case 'building-detail':
        if (!selectedBuilding) return null;
        const selectedPeriod = selectedBuilding.periodId ? PERIODS.find(p => p.id === selectedBuilding.periodId) : null;
        return (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col h-full bg-[var(--bg-main)] overflow-y-auto no-scrollbar pb-32"
          >
            <div className="relative h-[60dvh] bg-black overflow-hidden">
              <button 
                onClick={() => { setCurrentScreen('home'); setShow3D(false); }}
                className="absolute top-12 left-6 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              {selectedBuilding.modelUrl && (
                <div className="absolute top-12 right-6 z-20 flex space-x-2">
                  <button 
                    onClick={handleShare}
                    className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:bg-white/30 transition-all"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setShow3D(!show3D)}
                    className={`px-4 py-2 rounded-full backdrop-blur-md flex items-center space-x-2 border transition-all ${show3D ? 'bg-[#38bdf8] text-white border-[#38bdf8]' : 'bg-white/20 text-white border-white/20'}`}
                  >
                    <Box className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{show3D ? 'View Image' : 'Explore in 3D'}</span>
                  </button>
                </div>
              )}

              {show3D && selectedBuilding.modelUrl ? (
                <div className="relative w-full h-full">
                  <ModelViewer
                    src={selectedBuilding.modelUrl}
                    camera-controls
                    auto-rotate
                    shadow-intensity="1"
                    style={{ width: '100%', height: '100%', backgroundColor: '#111' }}
                    alt={`3D model of ${selectedBuilding.name}`}
                  >
                    {selectedBuilding.hotspots?.map((hotspot) => (
                      <button
                        key={hotspot.slot}
                        slot={hotspot.slot}
                        data-position={hotspot.position}
                        data-normal={hotspot.normal}
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          setActiveHotspot(activeHotspot === hotspot.slot ? null : hotspot.slot);
                        }}
                        className="w-5 h-5 rounded-full bg-[#38bdf8] border-2 border-white shadow-[0_0_10px_rgba(56,189,248,0.5)] flex items-center justify-center cursor-pointer transition-transform hover:scale-125 focus:outline-none"
                      >
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        {activeHotspot === hotspot.slot && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.8, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-48 bg-black/90 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-white text-[10px] font-serif leading-relaxed z-50 shadow-2xl pointer-events-none"
                          >
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-black/90 border-r border-b border-white/20 rotate-45" />
                            {hotspot.data}
                          </motion.div>
                        )}
                      </button>
                    ))}
                  </ModelViewer>
                </div>
              ) : (
                <img src={selectedBuilding.image} className="w-full h-full object-cover" alt={selectedBuilding.name} referrerPolicy="no-referrer" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-main)] via-[var(--bg-main)]/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-[var(--text-main)]">
                <div className="bg-[#38bdf8] inline-block px-3 py-1 rounded text-[10px] font-bold text-white uppercase tracking-widest mb-4">
                  {selectedBuilding.style}
                </div>
                <h1 className="text-5xl font-serif font-bold italic-leading-none mb-2">{selectedBuilding.name}</h1>
                <div className="flex items-center text-[var(--text-muted)] text-sm font-medium">
                  <MapPin className="w-4 h-4 mr-1 text-[#38bdf8]" />
                  {selectedBuilding.location}
                </div>
              </div>
            </div>

            <div className="p-8 space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[var(--bg-accent)] p-6 rounded-[24px] space-y-2 border border-[var(--border-color)]">
                   <Calendar className="w-5 h-5 text-[#c0a080]" />
                   <p className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-muted)] leading-none">Completion</p>
                   <p className="text-xl font-serif font-bold">{selectedBuilding.year}</p>
                </div>
                <div className="bg-[var(--bg-accent)] p-6 rounded-[24px] space-y-2 border border-[var(--border-color)]">
                   <History className="w-5 h-5 text-[#c0a080]" />
                   <p className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-muted)] leading-none">Era</p>
                   <p className="text-xl font-serif font-bold">{selectedPeriod?.name || selectedBuilding.style}</p>
                </div>
              </div>

              <div className="prose prose-sm font-serif leading-relaxed text-[var(--text-main)]/70">
                <p className="text-lg first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:font-serif first-letter:text-[var(--text-main)]">
                  {selectedBuilding.description}
                </p>
              </div>

              {selectedBuilding.historicalContext && (
                <div className="space-y-4">
                  <h2 className="text-sm uppercase font-bold tracking-widest text-[#38bdf8]">Historical Context</h2>
                  <div className="bg-[var(--bg-accent)] p-6 rounded-[32px] border border-[var(--border-color)] relative overflow-hidden">
                    <History className="absolute -right-8 -bottom-8 w-32 h-32 text-[var(--text-main)]/[0.03] -rotate-12" />
                    <p className="text-sm font-serif leading-relaxed text-[var(--text-main)]/70 italic relative z-10">
                      "{selectedBuilding.historicalContext}"
                    </p>
                  </div>
                </div>
              )}

              {selectedBuilding.styleCharacteristics && (
                <div className="space-y-4">
                  <h2 className="text-sm uppercase font-bold tracking-widest text-[#38bdf8]">Architectural Movement</h2>
                  <div className="bg-[#0c4a6e] dark:bg-[#0f172a] p-8 rounded-[40px] text-white space-y-6">
                    <div className="flex justify-between items-end border-b border-white/10 pb-4">
                      <div>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-white/40 mb-1 leading-none">Style</p>
                        <h3 className="text-2xl font-serif italic leading-none">{selectedBuilding.style}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase font-bold tracking-widest text-white/40 mb-1 leading-none">Timeline</p>
                        <p className="text-xs font-mono">{selectedBuilding.styleTimeline}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-[10px] uppercase font-bold tracking-widest text-white/40 leading-none">Key Characteristics</p>
                      <ul className="grid grid-cols-1 gap-2">
                        {selectedBuilding.styleCharacteristics.map((trait, idx) => (
                          <li key={idx} className="flex items-center text-sm font-serif italic text-white/80">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] mr-3" />
                            {trait}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {selectedBuilding.galleryImages && selectedBuilding.galleryImages.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-sm uppercase font-bold tracking-widest text-[#c0a080]">Structural Gallery</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedBuilding.galleryImages.map((img, idx) => (
                      <motion.div 
                        key={idx} 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        viewport={{ once: true }}
                        onClick={() => setSelectedGalleryImage(img)}
                        className={`relative rounded-3xl overflow-hidden cursor-pointer active:scale-95 transition-transform ${idx === 0 ? 'col-span-2 aspect-video' : 'aspect-square'}`}
                      >
                        <img 
                          src={img} 
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" 
                          alt={`${selectedBuilding.name} view ${idx + 1}`} 
                          referrerPolicy="no-referrer"
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              <InteractiveTimeline buildingYear={selectedBuilding.yearNum} />

              <button 
                onClick={() => {
                  const text = `Tell me more about the history and structural details of the ${selectedBuilding.name}.`;
                  setCurrentScreen('chat');
                  handleSend(text);
                }}
                className="w-full py-5 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-3xl font-bold uppercase tracking-widest text-xs flex items-center justify-center space-x-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Deep Search Archive</span>
              </button>
            </div>
          </motion.div>
        );

      case 'architects':
        const filteredArchs = ARCHITECTS.filter(a => 
          a.name.toLowerCase().includes(architectSearch.toLowerCase()) ||
          a.notableWorks.some(work => work.toLowerCase().includes(architectSearch.toLowerCase()))
        );

        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col h-full bg-[var(--bg-main)] overflow-hidden pb-24"
          >
             <div className="p-6 border-b border-[var(--border-color)] space-y-4 bg-[var(--nav-bg)] backdrop-blur-md sticky top-0 z-10">
                <h1 className="text-2xl font-serif font-bold italic">Masters of Form</h1>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input 
                    type="text" 
                    placeholder="Search masters or works..."
                    className="w-full bg-[var(--bg-accent)] rounded-2xl py-2 pl-10 pr-4 text-xs font-medium border-none outline-none focus:ring-1 focus:ring-[#c0a080]/50"
                    value={architectSearch}
                    onChange={(e) => setArchitectSearch(e.target.value)}
                  />
                </div>
             </div>
             <div className="overflow-y-auto p-4 space-y-4">
                {filteredArchs.length > 0 ? (
                  filteredArchs.map((architect) => (
                    <div 
                      key={architect.id}
                      className="arch-card flex items-center p-4 cursor-pointer group"
                      onClick={() => {
                        setSelectedArchitect(architect);
                        setCurrentScreen('architect-detail');
                      }}
                    >
                      <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                        <img src={architect.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt={architect.name} referrerPolicy="no-referrer" />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-lg font-serif font-bold">{architect.name}</h3>
                        <p className="text-xs text-[var(--text-muted)] font-mono tracking-tight line-clamp-1">{architect.notableWorks.join(' • ')}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[var(--text-muted)]" />
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center space-y-2 opacity-30">
                    <History className="w-12 h-12 mx-auto stroke-[1px]" />
                    <p className="text-sm italic">No architects found in these archives.</p>
                  </div>
                )}
             </div>
          </motion.div>
        );

      case 'architect-detail':
        if (!selectedArchitect) return null;
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-full bg-[var(--bg-main)] overflow-y-auto no-scrollbar pb-32"
          >
             <div className="relative h-96 bg-black">
                <button 
                  onClick={() => setCurrentScreen('architects')}
                  className="absolute top-12 left-6 z-20 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <img src={selectedArchitect.image} className="w-full h-full object-cover opacity-80" alt={selectedArchitect.name} referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-main)] via-[var(--bg-main)]/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                   <h1 className="text-4xl font-serif font-bold mb-2 text-[var(--text-main)]">{selectedArchitect.name}</h1>
                   <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-[var(--text-muted)]">Renowned Visionary</p>
                </div>
             </div>

             <div className="p-8 space-y-8">
               <div className="space-y-4">
                  <h2 className="text-sm uppercase font-bold tracking-widest text-[#c0a080]">Biography</h2>
                  <p className="text-sm font-serif leading-relaxed text-[var(--text-main)]/70 italic">
                    {selectedArchitect.bio}
                  </p>
               </div>

               <div className="space-y-4">
                  <h2 className="text-sm uppercase font-bold tracking-widest text-[#c0a080]">Notable Masterpieces</h2>
                  <div className="flex flex-wrap gap-2">
                    {selectedArchitect.notableWorks.map((work: string) => (
                      <span key={work} className="px-4 py-2 bg-[var(--bg-accent)] border border-[var(--border-color)] rounded-full text-xs font-serif font-medium italic">
                        {work}
                      </span>
                    ))}
                  </div>
               </div>

               <button 
                onClick={() => {
                  const text = `I'd like to learn more about ${selectedArchitect.name}'s architectural philosophy and their impact on design history.`;
                  setCurrentScreen('chat');
                  handleSend(text);
                }}
                className="w-full py-5 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-3xl font-bold uppercase tracking-widest text-xs flex items-center justify-center space-x-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Philosophical Inquiry</span>
              </button>
             </div>
          </motion.div>
        );

      case 'search':
        const filteredEras = PERIODS.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase()));
        const filteredBuildings = FAMOUS_BUILDINGS.filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.style.toLowerCase().includes(searchQuery.toLowerCase()));
        const filteredArchitects = ARCHITECTS.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()));

        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-full bg-[var(--bg-main)] overflow-hidden pb-24"
          >
            <div className="p-6 border-b border-[var(--border-color)] bg-[var(--nav-bg)] backdrop-blur-md sticky top-0 z-10 space-y-4">
               <h1 className="text-2xl font-serif font-bold italic">Search Archives</h1>
               <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input 
                    type="text" 
                    placeholder="Search eras, buildings, or architects..."
                    className="w-full bg-[var(--bg-accent)] rounded-2xl py-3 pl-12 pr-4 text-sm font-medium border-none outline-none focus:ring-1 focus:ring-[#c0a080]/50 placeholder:text-[var(--text-muted)]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-8">
              {searchQuery.trim() === '' ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-20">
                  <Search className="w-16 h-16 mb-4 stroke-[1px]" />
                  <p className="text-sm font-medium">Start typing to search history...</p>
                </div>
              ) : (
                <>
                  {filteredEras.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-[10px] uppercase font-bold tracking-widest text-[#38bdf8] ml-2">Historical Eras</h3>
                      {filteredEras.map(era => (
                        <div key={era.id} onClick={() => setCurrentScreen('explore')} className="p-4 bg-[var(--bg-accent)] rounded-2xl flex items-center cursor-pointer border border-[var(--border-color)]">
                          <img src={era.image} className="w-12 h-12 rounded-xl object-cover mr-4" alt={era.name} referrerPolicy="no-referrer" />
                          <div className="flex-1">
                            <h4 className="font-serif font-bold">{era.name}</h4>
                            <p className="text-[10px] text-[var(--text-muted)]">{era.years}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
                        </div>
                      ))}
                    </div>
                  )}

                  {filteredBuildings.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-[10px] uppercase font-bold tracking-widest text-[#38bdf8] ml-2">Landmarks</h3>
                      {filteredBuildings.map(b => (
                        <div key={b.id} onClick={() => { setSelectedBuilding(b); setShow3D(false); setCurrentScreen('building-detail'); }} className="p-4 bg-[var(--bg-accent)] rounded-2xl flex items-center cursor-pointer border border-[var(--border-color)]">
                          <img src={b.image} className="w-12 h-12 rounded-xl object-cover mr-4" alt={b.name} referrerPolicy="no-referrer" />
                          <div className="flex-1">
                            <h4 className="font-serif font-bold">{b.name}</h4>
                            <p className="text-[10px] text-[var(--text-muted)]">{b.location}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
                        </div>
                      ))}
                    </div>
                  )}

                  {filteredArchitects.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-[10px] uppercase font-bold tracking-widest text-[#38bdf8] ml-2">Architects</h3>
                      {filteredArchitects.map(a => (
                        <div key={a.id} onClick={() => { setSelectedArchitect(a); setCurrentScreen('architect-detail'); }} className="p-4 bg-[var(--bg-accent)] rounded-2xl flex items-center cursor-pointer border border-[var(--border-color)]">
                          <img src={a.image} className="w-12 h-12 rounded-xl object-cover mr-4 grayscale" alt={a.name} referrerPolicy="no-referrer" />
                          <div className="flex-1">
                            <h4 className="font-serif font-bold">{a.name}</h4>
                            <p className="text-[10px] text-[var(--text-muted)] line-clamp-1">{a.notableWorks[0]}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
                        </div>
                      ))}
                    </div>
                  )}

                  {filteredEras.length === 0 && filteredBuildings.length === 0 && filteredArchitects.length === 0 && (
                    <div className="py-20 text-center space-y-4">
                      <p className="text-sm text-black/40 italic">"I'm sorry, I don't have that information in my archives. Please find your answer on Google."</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        );

      case 'visionary':
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-full bg-[var(--bg-main)] overflow-hidden pb-24"
          >
            <div className="p-6 border-b border-[var(--border-color)] bg-[var(--nav-bg)] backdrop-blur-md sticky top-0 z-10">
               <div className="flex items-center space-x-2">
                 <Sparkles className="w-5 h-5 text-[#38bdf8]" />
                 <h1 className="text-2xl font-serif font-bold italic">Visionary Lab</h1>
               </div>
               <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--text-muted)] mt-1">AI-Powered Architectural Projection</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div className="space-y-4">
                <p className="text-sm font-serif text-[var(--text-main)]/60 leading-relaxed italic">
                  Describe a structure yet unbuilt. Our neural archives will project a visual representation of your architectural concept.
                </p>
                <div className="relative">
                  <textarea 
                    value={visionPrompt}
                    onChange={(e) => setVisionPrompt(e.target.value)}
                    placeholder="Ex: A Brutalist skyscraper covered in vertical gardens, overlooking a neon sea during twilight..."
                    className="w-full h-32 bg-[var(--bg-accent)] rounded-3xl p-6 text-sm font-serif border border-[var(--border-color)] outline-none focus:ring-1 focus:ring-[#38bdf8]/50 resize-none text-[var(--text-main)] placeholder:text-[var(--text-muted)]"
                  />
                  <button 
                    onClick={handleGenerateVision}
                    disabled={isGenerating || !visionPrompt.trim()}
                    className="absolute bottom-4 right-4 bg-[var(--primary)] text-[var(--primary-foreground)] px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center space-x-2 disabled:opacity-50 transition-all active:scale-95"
                  >
                    {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                    <span>{isGenerating ? 'Projecting...' : 'Generate Vision'}</span>
                  </button>
                </div>
              </div>

              {visionImage ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <div className="relative rounded-[32px] overflow-hidden shadow-2xl bg-black aspect-[4/5]">
                    <img src={visionImage} className="w-full h-full object-cover" alt="Generated vision" referrerPolicy="no-referrer" />
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : isGenerating ? (
                <div className="aspect-[4/5] rounded-[32px] bg-[var(--bg-accent)] flex flex-col items-center justify-center space-y-4 border border-dashed border-[var(--border-color)]">
                   <div className="relative">
                      <Loader2 className="w-12 h-12 text-[#38bdf8] animate-spin" />
                      <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-[#38bdf8] animate-pulse" />
                   </div>
                   <p className="text-xs font-mono text-[var(--text-muted)] tracking-widest uppercase">Calculating Solidities...</p>
                </div>
              ) : null}

              {generatedVisions.length > 0 && (
                <div className="space-y-4 pt-4">
                  <h3 className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-muted)]">Past Visions</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {generatedVisions.map((vision, idx) => (
                      <div 
                        key={idx} 
                        className="aspect-square rounded-2xl overflow-hidden cursor-pointer active:scale-95 transition-transform"
                        onClick={() => setVisionImage(vision.url)}
                      >
                        <img src={vision.url} className="w-full h-full object-cover" alt="Past vision" referrerPolicy="no-referrer" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className={`min-h-screen bg-[var(--bg-main)] flex items-center justify-center md:py-10 transition-colors duration-500 ${isDarkMode ? 'dark' : ''}`}>
      <div className="mobile-container">
        {/* Screen Content */}
        <div className="h-full overflow-hidden">
          <AnimatePresence mode="wait">
            {renderScreen()}
          </AnimatePresence>
        </div>

        {/* Navigation Bar */}
        <div className="absolute bottom-0 left-0 right-0 glass-nav h-24 flex items-center justify-around px-2 z-50">
          <NavItem 
            active={currentScreen === 'home'} 
            onClick={() => setCurrentScreen('home')} 
            icon={<History className="w-6 h-6" />} 
            label="Past" 
          />
          <NavItem 
            active={currentScreen === 'explore'} 
            onClick={() => setCurrentScreen('explore')} 
            icon={<Compass className="w-6 h-6" />} 
            label="Eras" 
          />
          <NavItem 
            active={currentScreen === 'visionary'} 
            onClick={() => setCurrentScreen('visionary')} 
            icon={<Sparkles className="w-6 h-6" />} 
            label="Visions" 
          />
          <NavItem 
            active={currentScreen === 'search'} 
            onClick={() => setCurrentScreen('search')} 
            icon={<Search className="w-6 h-6" />} 
            label="Search" 
          />
          <NavItem 
            active={currentScreen === 'chat'} 
            onClick={() => setCurrentScreen('chat')} 
            icon={<MessageSquare className="w-6 h-6" />} 
            label="Chat" 
          />
        </div>
      </div>
      <AnimatePresence>
        {selectedGalleryImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedGalleryImage(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-full max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={selectedGalleryImage} 
                className="max-w-full max-h-[85dvh] rounded-2xl shadow-2xl object-contain border border-white/10" 
                alt="Architectural Detail Zoomed" 
                referrerPolicy="no-referrer"
              />
              <button 
                onClick={() => setSelectedGalleryImage(null)}
                className="absolute -top-12 right-0 flex items-center space-x-2 text-white/60 hover:text-white transition-colors"
              >
                <span className="text-[10px] font-bold uppercase tracking-widest">Close View</span>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <ArrowLeft className="w-4 h-4 rotate-90" />
                </div>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {showShareToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[110] bg-black/80 backdrop-blur-md text-white px-6 py-3 rounded-2xl border border-white/10 shadow-2xl flex items-center space-x-3"
          >
            <div className="w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Link Copied to Archive</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavItem({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center transition-all duration-300 ${active ? 'text-[#38bdf8] translate-y-[-4px]' : 'text-[var(--text-muted)]'}`}
    >
      <div className={`${active ? 'bg-[#38bdf8]/10 p-2 rounded-xl' : ''}`}>
        {icon}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest mt-1">{label}</span>
    </button>
  );
}

