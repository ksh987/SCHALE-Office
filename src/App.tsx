import React, { useState } from 'react';
import { 
  X, Clock, Heart, ClipboardList, CalendarRange, Check, ChevronLeft, ChevronRight, PenTool
} from 'lucide-react';

// --- UI 공통 컴포넌트 (정적 선언) ---

// 1. 글래스모피즘 래퍼 컴포넌트
const GlassPanel = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl ${className}`}>
    {children}
  </div>
);

// 2. 비눗방울 스타일 버튼 컴포넌트
const BubbleButton = ({ onClick, label, positionClass }: { onClick: () => void; label: string; positionClass: string }) => {
  return (
    <button 
      onClick={onClick}
      className={`absolute ${positionClass} flex flex-col items-center justify-center w-[22%] aspect-square rounded-full pointer-events-auto transition-all duration-500 hover:scale-110 active:scale-95 group overflow-hidden
        bg-gradient-to-br from-white/15 via-sky-100/5 to-transparent
        border border-white/45
        shadow-[inset_0_8px_16px_rgba(255,255,255,0.4),_inset_0_-8px_16px_rgba(147,197,253,0.15),_0_15px_30px_rgba(14,165,233,0.1)]
        backdrop-blur-[2px]`}
    >
      {/* 비눗방울 상단 하이라이트 광택 */}
      <span className="absolute top-[10%] left-[10%] w-[30%] h-[15%] rounded-full bg-gradient-to-b from-white/70 to-transparent rotate-[-15deg] blur-[0.5px]" />
      
      {/* 비눗방울 하단 영롱한 오로라/무지개 반사광 */}
      <span className="absolute bottom-[10%] right-[10%] w-[45%] h-[20%] rounded-full bg-gradient-to-t from-pink-300/30 via-indigo-300/20 to-transparent rotate-[-15deg] blur-[2px]" />
      <span className="absolute bottom-[8%] left-[20%] w-[35%] h-[15%] rounded-full bg-gradient-to-t from-emerald-300/20 to-transparent rotate-[15deg] blur-[2px]" />

      {/* 텍스트 스타일: 영롱한 입체 텍스트 */}
      <span className="relative z-10 text-white font-extrabold text-lg sm:text-2xl lg:text-3xl tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] group-hover:text-sky-100 transition-colors">
        {label}
      </span>
    </button>
  );
};

// 3. 16:9 목업 맞춤형 액션 버튼 레이아웃
const ActionMenu = ({ 
  isMenuOpen, 
  handleActionSelect 
}: { 
  isMenuOpen: boolean; 
  handleActionSelect: (action: string) => void; 
}) => {
  return (
    <div className={`absolute inset-0 z-20 pointer-events-none transition-opacity duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}>
      <BubbleButton 
        onClick={() => handleActionSelect("함께 업무")}
        label="함께 업무"
        positionClass="top-[12%] left-[10%]"
      />
      <BubbleButton 
        onClick={() => handleActionSelect("함께 운동")}
        label="함께 운동"
        positionClass="top-[12%] right-[10%]"
      />
      <BubbleButton 
        onClick={() => handleActionSelect("함께 공부")}
        label="함께 공부"
        positionClass="bottom-[18%] left-[4%]"
      />
      <BubbleButton 
        onClick={() => handleActionSelect("함께 수면")}
        label="함께 수면"
        positionClass="bottom-[18%] right-[4%]"
      />
    </div>
  );
};

export default function App() {
  // --- 상태 관리 (State Management) ---
  const [currentDialogue, setCurrentDialogue] = useState("선생님, 오늘도 수고가 많아.");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null); // 'timer', 'summary', 'exit'
  const [selectedTime, setSelectedTime] = useState(15);
  const [isInteracting, setIsInteracting] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  // --- '주간 계획' 및 '스탬프 달력' 모달 상태 및 데이터 ---
  const [isWeeklyModalOpen, setIsWeeklyModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  
  const [weeklyTasks, setWeeklyTasks] = useState([
    { id: 1, text: "그와 5분 이상 동반 1회", isCompleted: false, rewardImg: "./gift_box.png", rewardCount: 1 },
    { id: 2, text: "1회 동반에서 그와 공부 혹은 업무 5분", isCompleted: false, rewardImg: "./blue_cube.png", rewardCount: 1 },
    { id: 3, text: "1회 동반에서 그와 운동 5분", isCompleted: false, rewardImg: "./green_cube.png", rewardCount: 1 }
  ]);

  const [calendarStamps, setCalendarStamps] = useState<number[]>([29, 30, 31]);
  const [calendarEvents, setCalendarEvents] = useState([
    { id: 1, title: "식사 약속 계획", date: "5.28", time: "12:23", icon: "clock" },
    { id: 2, title: "기념일", date: "5.28", time: "12:27", icon: "notepad" }
  ]);

  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [editingEventTitle, setEditingEventTitle] = useState("");

  const handleStartEditEvent = (id: number, currentTitle: string) => {
    setEditingEventId(id);
    setEditingEventTitle(currentTitle);
  };

  const handleSaveEvent = (id: number) => {
    setCalendarEvents(prev => prev.map(ev => ev.id === id ? { ...ev, title: editingEventTitle } : ev));
    setEditingEventId(null);
  };

  // --- 캐릭터 표정 상태 (00번부터 08번 파일 대응 - 원본 PNG 포맷) ---
  const [charFrame, setCharFrame] = useState('shiroko_default_00.png');

  // --- 이벤트 핸들러 ---
  const handleCharacterClick = () => {
    if (activeModal || isInteracting) return;
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      setCurrentDialogue("갑자기 왜 찾은 거야? 혹시... 은행 털러 가는 거야?");
      setCharFrame('shiroko_default_04.png'); // 즉시 놀람/호기심 표정으로 전환
    } else {
      setCurrentDialogue("선생님, 오늘도 수고가 많아.");
      setCharFrame('shiroko_default_00.png'); // 즉시 기본 표정으로 복구
    }
  };

  const handleActionSelect = (action: string) => {
    setSelectedAction(action);
    setIsMenuOpen(false);
    setCurrentDialogue(`응, 알았어. [${action}] 목표가 정해졌다면 바로 실행에 옮기자.\n지체할 시간 없어.`);
    setCharFrame('shiroko_default_07.png'); // 즉시 진지한 표정
    setTimeout(() => {
      setActiveModal('timer');
    }, 1200);
  };

  const handleStartInteraction = () => {
    setActiveModal(null);
    setIsInteracting(true);
    setCurrentDialogue(`선생님, 집중해. 방심하면 당해.`);
    setCharFrame('shiroko_default_06.png'); // 즉시 엄격한 표정
    
    // 시뮬레이션: 일정 시간 후 종료 프롬프트 팝업
    setTimeout(() => {
      setActiveModal('exit');
    }, 4000);
  };

  const handleFinishInteraction = () => {
    setActiveModal('summary');
    setIsInteracting(false);
    setCurrentDialogue("작전 종료. 수고했어, 선생님.\n다음 작전 때도 나를 불러줘.");
    setCharFrame('shiroko_default_08.png'); // 즉시 미소 표정

    // 주간 미션 완료 및 달력 스탬프 업데이트 연동
    setWeeklyTasks(prev => prev.map(task => {
      if (task.id === 1) return { ...task, isCompleted: true };
      if (task.id === 2 && (selectedAction === "함께 업무" || selectedAction === "함께 공부")) return { ...task, isCompleted: true };
      if (task.id === 3 && selectedAction === "함께 운동") return { ...task, isCompleted: true };
      return task;
    }));

    if (!calendarStamps.includes(28)) {
      setCalendarStamps(prev => [...prev, 28]);
    }
  };

  const resetState = () => {
    setActiveModal(null);
    setIsMenuOpen(false);
    setSelectedAction(null);
    setCurrentDialogue("기다리고 있었어. 오늘은 어떤 일상을 함께할까?");
    setCharFrame('shiroko_default_00.png'); 
  };



  return (
    <div className="flex items-center justify-center w-full h-screen bg-[#0a0a0a] select-none overflow-hidden">
      {/* 16:9 비율을 꽉 채우며 유지하는 컨테이너 */}
      <div 
        className="relative overflow-hidden bg-gray-900 font-sans shadow-2xl rounded-lg border border-white/5"
        style={{ width: '100%', maxWidth: 'calc(100vh * (16 / 9))', aspectRatio: '16 / 9' }}
      >
        
        {/* --- 배경 --- */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-100 transition-transform duration-1000 ease-out scale-100 hover:scale-105"
          style={{ backgroundImage: "url('./office.webp')" }}
        />

        {/* --- 캐릭터 영역 (PNG 형식 및 믹스 블렌드 모드 제거) --- */}
        <div className="absolute inset-0 z-10 flex justify-center items-end pointer-events-none">
          <div 
            className="w-[35%] h-[95%] bg-contain bg-bottom bg-no-repeat cursor-pointer pointer-events-auto transition-transform duration-300 hover:scale-[1.02] active:scale-[0.99]"
            style={{ 
              backgroundImage: `url('./${charFrame}')`,
              maskImage: "linear-gradient(to top, transparent 1%, black 10%)",
              WebkitMaskImage: "linear-gradient(to top, transparent 1%, black 10%)",
              filter: "drop-shadow(0 0 15px rgba(0,0,0,0.5))"
            }}
            onClick={handleCharacterClick}
          />
        </div>

        {/* --- 상호작용 레이어 --- */}
        <ActionMenu isMenuOpen={isMenuOpen} handleActionSelect={handleActionSelect} />

        {/* --- 모달: 시간 설정 --- */}
        {activeModal === 'timer' && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
            <GlassPanel className="w-96 p-8 flex flex-col items-center text-white text-center border-t-2 border-t-indigo-400">
              <Clock className="mb-4 text-indigo-300 animate-pulse" size={32} />
              <h2 className="text-xl font-bold mb-2">시간 설정</h2>
              <p className="text-sm text-gray-300 mb-8">[업무] 동반을 함께할 시간은?</p>
              
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {[5, 10, 15, 20, 25, 30].map(time => (
                  <button 
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`w-12 h-12 rounded-full border transition-all ${selectedTime === time ? 'bg-indigo-500 border-indigo-400 text-white scale-110 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-transparent border-gray-400 text-gray-300 hover:border-white hover:text-white'}`}
                  >
                    {time}
                  </button>
                ))}
              </div>

              <div className="flex w-full gap-4">
                <button onClick={() => setActiveModal(null)} className="flex-1 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">취소</button>
                <button onClick={handleStartInteraction} className="flex-1 py-3 rounded-lg bg-indigo-500 hover:bg-indigo-600 font-bold transition-colors">확인</button>
              </div>
            </GlassPanel>
          </div>
        )}

        {/* --- 모달: 종료 프롬프트 --- */}
        {activeModal === 'exit' && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
            <GlassPanel className="w-80 p-8 flex flex-col items-center text-white text-center">
              <p className="text-lg mb-8 leading-relaxed">동반 시간이 5분 이하입니다.<br/>나가시겠습니까?</p>
              <div className="flex w-full gap-4">
                <button onClick={() => setActiveModal(null)} className="flex-1 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">취소</button>
                <button onClick={handleFinishInteraction} className="flex-1 py-3 rounded-lg bg-red-500/80 hover:bg-red-500 font-bold transition-colors">확인</button>
              </div>
            </GlassPanel>
          </div>
        )}

        {/* --- 모달: 요약 결과창 --- */}
        {activeModal === 'summary' && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity" onClick={resetState}>
            <GlassPanel className="w-[28rem] h-[36rem] p-8 flex flex-col relative overflow-hidden">
              {/* 장식용 배경 이펙트 */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />
              
              <div className="flex justify-between items-start mb-12 relative z-10">
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-widest">업무 계획</h2>
                  <p className="text-indigo-300 text-sm mt-1">오늘</p>
                </div>
                <button onClick={resetState} className="text-white/50 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 flex flex-col justify-center items-center relative z-10">
                <div className="w-24 h-24 rounded-full border-4 border-indigo-400/50 p-1 mb-6 flex items-center justify-center relative">
                   <div className="absolute inset-0 border-4 border-indigo-400 rounded-full border-t-transparent animate-spin" />
                   <Heart className="text-indigo-400" size={32} />
                </div>
                <p className="text-gray-300 text-lg mb-2">시로코와(과) 알찬 시간을 보냈다</p>
                <div className="text-5xl font-light text-white tracking-tighter">
                  <span className="font-bold">1</span>분 <span className="font-bold">0</span>초
                </div>
              </div>

              <div className="mt-auto text-center text-gray-400 text-sm relative z-10 border-t border-white/10 pt-6">
                미완료 계획은 나중에 계속해 보세요.
              </div>
            </GlassPanel>
          </div>
        )}

        {/* --- 우측 상단 퀵버튼 (주간 계획, 스탬프 달력) --- */}
        <div className="absolute top-[8%] right-[4%] z-30 flex flex-col gap-5 items-center pointer-events-auto">
          {/* 주간 계획 버튼 */}
          <button 
            onClick={() => setIsWeeklyModalOpen(true)}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-[#47c2f0] flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(71,194,240,0.8),_inset_0_4px_8px_rgba(255,255,255,0.5)] group-active:scale-95
              bg-gradient-to-b from-[#47c2f0]/40 via-[#1e72b8]/60 to-[#0e3b68]/80 backdrop-blur-sm
              shadow-[inset_0_4px_8px_rgba(255,255,255,0.4),_0_6px_12px_rgba(0,0,0,0.3)]"
            >
              <ClipboardList size={26} className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] group-hover:text-[#bceaff] transition-colors" />
            </div>
            <span className="mt-1 text-white text-[11px] md:text-[13px] font-black tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] group-hover:text-[#bceaff] transition-colors">
              주간 계획
            </span>
          </button>

          {/* 스탬프 달력 버튼 */}
          <button 
            onClick={() => setIsCalendarModalOpen(true)}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-[#47c2f0] flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(71,194,240,0.8),_inset_0_4px_8px_rgba(255,255,255,0.5)] group-active:scale-95
              bg-gradient-to-b from-[#47c2f0]/40 via-[#1e72b8]/60 to-[#0e3b68]/80 backdrop-blur-sm
              shadow-[inset_0_4px_8px_rgba(255,255,255,0.4),_0_6px_12px_rgba(0,0,0,0.3)]"
            >
              <CalendarRange size={26} className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] group-hover:text-[#bceaff] transition-colors" />
            </div>
            <span className="mt-1 text-white text-[11px] md:text-[13px] font-black tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] group-hover:text-[#bceaff] transition-colors">
              스탬프 달력
            </span>
          </button>
        </div>

        {/* --- 모달: 주간 계획 --- */}
        {isWeeklyModalOpen && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity">
            <div className="w-[32rem] max-w-[90%] bg-gradient-to-br from-[#0c1d33]/95 via-[#071322]/98 to-[#030911]/99 border border-[#47c2f0]/40 text-white rounded-3xl shadow-[0_10px_40px_rgba(71,194,240,0.15)] p-8 relative overflow-hidden flex flex-col max-h-[85%]">
              {/* Glow effect */}
              <div className="absolute -top-32 -left-32 w-80 h-80 bg-[#47c2f0]/10 rounded-full blur-[80px] pointer-events-none" />
              <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-[#2798e6]/5 rounded-full blur-[80px] pointer-events-none" />
              
              {/* Header */}
              <div className="flex justify-between items-start mb-6 z-10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#47c2f0] text-2xl font-serif">“</span>
                    <h2 className="text-3xl font-extrabold tracking-widest bg-gradient-to-r from-white via-[#b2e5fc] to-[#47c2f0] bg-clip-text text-transparent">주간 계획</h2>
                    <span className="text-[#47c2f0] text-2xl font-serif">”</span>
                  </div>
                  <p className="text-xs text-[#6ba4c7] mt-1 tracking-wider uppercase">Deep Space / Daily Protocol</p>
                </div>
                <button onClick={() => setIsWeeklyModalOpen(false)} className="text-[#47c2f0] hover:text-[#b2e5fc] p-2 hover:bg-[#1a3854]/50 rounded-full transition-all">
                  <X size={24} />
                </button>
              </div>

              {/* Main List */}
              <div className="flex-1 space-y-4 z-10 overflow-y-auto pr-1">
                {weeklyTasks.map(task => (
                  <div 
                    key={task.id} 
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${task.isCompleted ? 'bg-[#132c4a]/50 border-[#47c2f0]/40 shadow-[0_4px_12px_rgba(71,194,240,0.15)]' : 'bg-[#0a1524]/60 border-[#47c2f0]/15'}`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Reward Box */}
                      <div className="relative w-16 h-16 bg-[#040810]/80 border border-[#47c2f0]/30 rounded-xl flex items-center justify-center p-1 overflow-hidden shadow-inner">
                        <img src={task.rewardImg} alt="reward" className="w-12 h-12 object-contain" />
                        <span className="absolute bottom-0.5 right-1.5 text-xs text-[#47c2f0] font-bold font-mono">{task.rewardCount}</span>
                      </div>
                      
                      {/* Mission Text */}
                      <div>
                        <p className={`text-sm sm:text-base font-semibold transition-colors ${task.isCompleted ? 'text-white' : 'text-[#a5c2d6]'}`}>
                          {task.text}
                        </p>
                        <span className="text-[10px] text-[#527094] tracking-wider block mt-0.5">WEEKLY TARGET</span>
                      </div>
                    </div>

                    {/* Status Button/Label */}
                    <div>
                      {task.isCompleted ? (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2798e6]/25 border border-[#47c2f0]/60 rounded-full text-[#47c2f0] text-xs font-black shadow-[0_0_8px_rgba(71,194,240,0.3)] animate-pulse">
                          <Check size={12} strokeWidth={4} />
                          <span>달성 완료</span>
                        </div>
                      ) : (
                        <div className="text-xs text-[#6ba4c7] font-bold px-3 py-1.5 bg-[#040810]/40 border border-[#47c2f0]/20 rounded-full flex items-center gap-1">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#47c2f0] animate-ping" />
                          <span>•• 미달성</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Footer info */}
              <div className="mt-6 pt-4 border-t border-[#47c2f0]/15 flex justify-between items-center text-[10px] text-[#527094] z-10">
                <span>선생님과 함께한 활동을 완료하면 미션이 달성됩니다.</span>
                <span>SCHALE OFFICE</span>
              </div>
            </div>
          </div>
        )}

        {/* --- 모달: 스탬프 달력 --- */}
        {isCalendarModalOpen && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity">
            <div className="w-[30rem] max-w-[95%] bg-[#f0f4f8] border-2 border-[#b0c8df] text-[#1e324a] rounded-3xl shadow-[0_10px_35px_rgba(30,50,74,0.15)] p-6 relative overflow-hidden flex flex-col max-h-[90%] font-sans">
              {/* Grid pattern background */}
              <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#2798e6 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

              {/* Header */}
              <div className="flex justify-between items-center mb-4 z-10">
                <div className="flex items-end">
                  <span className="text-5xl font-black text-[#2798e6] leading-none tracking-tight">5</span>
                  <div className="ml-2 flex flex-col justify-end">
                    <span className="text-xs font-bold text-[#527094] leading-none uppercase">May</span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <CalendarRange size={14} className="text-[#527094]" />
                      <span className="text-sm font-extrabold text-[#527094]">올해</span>
                    </div>
                  </div>
                </div>
                
                {/* Month switcher & Close */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-[#c0d5eb] rounded-full bg-white p-0.5">
                    <button className="p-1 hover:bg-[#e0edf7] rounded-full text-[#527094] transition-colors"><ChevronLeft size={16} /></button>
                    <span className="px-2 text-xs font-bold text-[#527094]">2026</span>
                    <button className="p-1 hover:bg-[#e0edf7] rounded-full text-[#527094] transition-colors"><ChevronRight size={16} /></button>
                  </div>
                  <button onClick={() => setIsCalendarModalOpen(false)} className="text-[#527094] hover:text-[#1e324a] p-2 hover:bg-[#c0d5eb]/40 rounded-full transition-all">
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Weekday Labels */}
              <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-[#7ca2c4] mb-2 z-10">
                <div>일</div><div>월</div><div>화</div><div>수</div><div>목</div><div>금</div><div>토</div>
              </div>

              {/* Calendar Grid (May starting on Thursday) */}
              <div className="grid grid-cols-7 gap-1 z-10 bg-[#dbe6f0] p-1 rounded-2xl border border-[#c0d5eb]">
                {/* Empty cells for Thu start */}
                {[...Array(4)].map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square bg-[#f0f4f8]/50 rounded-lg" />
                ))}
                {/* Days 1 to 31 */}
                {[...Array(31)].map((_, i) => {
                  const day = i + 1;
                  const isToday = day === 28;
                  const hasStamp = calendarStamps.includes(day);

                  return (
                    <div 
                      key={`day-${day}`}
                      className={`aspect-square rounded-xl flex flex-col justify-between p-1.5 relative border transition-all duration-200 bg-white
                        ${isToday ? 'border-[#2798e6] bg-[#e3f2fd] shadow-[0_0_8px_rgba(39,152,230,0.25)]' : 'border-transparent hover:border-[#b0c8df] hover:bg-[#eaf1f7]'}
                      `}
                    >
                      {/* Today Badge */}
                      {isToday && (
                        <span className="absolute top-1 left-1 bg-[#2798e6] text-white text-[8px] font-black px-1 rounded-[3px] leading-tight transform -rotate-2">오늘</span>
                      )}

                      {/* Day Number */}
                      <span className={`text-xs font-bold self-end ${isToday ? 'text-[#2798e6]' : 'text-[#2f4f75]'}`}>
                        {day}
                      </span>

                      {/* Stamp (Clock Icon) */}
                      {hasStamp && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-7 h-7 rounded-full bg-[#2798e6]/10 border-2 border-[#2798e6] flex items-center justify-center text-[#2798e6] shadow-sm transform -rotate-12">
                            <Clock size={12} strokeWidth={3} />
                          </div>
                          {/* stamp dot */}
                          {isToday && (
                            <span className="absolute bottom-1 right-2 w-2 h-2 rounded-full bg-[#ffea79] border border-[#2798e6]" />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Separator line */}
              <div className="border-t border-dashed border-[#c0d5eb] my-4 z-10" />

              {/* Events List */}
              <div className="space-y-3 z-10 overflow-y-auto max-h-[140px] pr-1">
                {calendarEvents.map(event => (
                  <div key={event.id} className="flex items-center justify-between bg-white border border-[#c0d5eb] p-3 rounded-2xl shadow-sm hover:shadow transition-shadow">
                    <div className="flex items-center gap-3">
                      {/* Event Icon wrapper */}
                      {event.icon === 'clock' ? (
                        <div className="bg-[#e3f2fd] text-[#2798e6] p-2.5 rounded-full flex items-center justify-center">
                          <Clock size={16} />
                        </div>
                      ) : (
                        <div className="bg-[#eaf1f7] text-[#527094] p-2.5 rounded-xl flex items-center justify-center">
                          <CalendarRange size={16} />
                        </div>
                      )}

                      {/* Event Text */}
                      <div className="flex-1">
                        {editingEventId === event.id ? (
                          <div className="flex items-center gap-2">
                            <input 
                              type="text" 
                              value={editingEventTitle}
                              onChange={(e) => setEditingEventTitle(e.target.value)}
                              className="border border-[#c0d5eb] rounded px-2 py-0.5 text-xs text-[#1e324a] bg-[#f0f4f8] focus:outline-none focus:border-[#2798e6] w-36"
                              autoFocus
                            />
                            <button 
                              onClick={() => handleSaveEvent(event.id)}
                              className="bg-[#2798e6] hover:bg-[#1a85cf] text-white px-2 py-0.5 rounded text-[10px] font-bold transition-colors"
                            >
                              저장
                            </button>
                            <button 
                              onClick={() => setEditingEventId(null)}
                              className="text-[#527094] hover:text-[#1e324a] text-[10px]"
                            >
                              취소
                            </button>
                          </div>
                        ) : (
                          <>
                            <h4 className="font-extrabold text-[#1e324a] text-sm">{event.title}</h4>
                            <p className="text-[10px] text-[#527094] mt-0.5">{event.date} {event.time}</p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Edit Button */}
                    {editingEventId !== event.id && (
                      <button 
                        onClick={() => handleStartEditEvent(event.id, event.title)}
                        className="text-[#527094] hover:text-[#2798e6] p-2 hover:bg-[#e3f2fd] rounded-full transition-all"
                      >
                        <PenTool size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- 하단 자막(대화창) UI --- */}
        <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-[65%] z-30 pointer-events-none flex flex-col items-center">
          {/* 흰색 배경의 깔끔한 텍스트 박스 */}
          <div className="w-full bg-white py-4 md:py-6 px-8 shadow-[0_10px_30px_rgba(0,0,0,0.15)] rounded-sm border-b-4 border-indigo-400">
            <p className="text-black text-xl md:text-3xl font-extrabold whitespace-pre-line text-center tracking-tight">
              {currentDialogue}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
