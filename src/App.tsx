import React, { useState } from 'react';
import { 
  X, Clock, Heart 
} from 'lucide-react';

export default function App() {
  // --- 상태 관리 (State Management) ---
  const [currentDialogue, setCurrentDialogue] = useState("선생님, 오늘도 수고가 많아.");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null); // 'timer', 'summary', 'exit'
  const [selectedTime, setSelectedTime] = useState(15);
  const [isInteracting, setIsInteracting] = useState(false);

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
  };

  const resetState = () => {
    setActiveModal(null);
    setIsMenuOpen(false);
    setCurrentDialogue("기다리고 있었어. 오늘은 어떤 일상을 함께할까?");
    setCharFrame('shiroko_default_00.png'); 
  };

  // --- UI 컴포넌트 ---

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
  const ActionMenu = () => {
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
        <ActionMenu />

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
