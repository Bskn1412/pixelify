import React, { useState } from 'react';
import { motion } from 'framer-motion';
interface AIUpscalerSectionProps {
    onLaunchUpscaler: () => void;
}
export default function AIUpscalerSection({ onLaunchUpscaler }: AIUpscalerSectionProps) {
    const [activeCard, setActiveCard] = useState<number | null>(null);
    return (
        <section className="w-screen max-w-[100vw] relative left-1/2 -translate-x-1/2 rounded-t-none rounded-b-[32px] sm:rounded-b-[44px] bg-[#07080D] border-x border-b border-t-0 border-white/10 pt-10 sm:pt-16 lg:pt-24 pb-8 sm:py-8 lg:py-8 px-4 sm:px-8 lg:px-12 overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.85)] z-10">
            {/* Outer ambient green back-glow matching reference screenshot */}
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#00C86A]/15 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#00FF85]/10 rounded-full blur-[100px] pointer-events-none" />
            {/* Centered Inner Container with balanced height */}
            <div className="max-w-[1300px] mx-auto w-full relative z-10 lg:min-h-[700px] flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 lg:gap-4">
                {/* ========================================================================= */}
                {/* LEFT: CONTENT (Features, Models Showcase, and Launch CTA)                */}
                {/* ========================================================================= */}
                {/* Responsive padding and alignment for mobile & desktop */}
                <div className="flex flex-col gap-4 max-w-md lg:max-w-[340px] min-[1150px]:max-w-[390px] xl:max-w-lg pt-6 sm:pt-12 lg:pt-24 xl:pt-36 z-30 text-center lg:text-left items-center lg:items-start">
                    {/* Title */}
                    <h2 className="text-2xl sm:text-3xl lg:text-[28px] min-[1150px]:text-[32px] xl:text-[38px] 2xl:text-[40px] font-extrabold tracking-tight text-white leading-[1.18]">
                        Upscale images on your device{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF85] via-[#00C86A] to-[#38ef7d]">
                            with AI
                        </span>
                    </h2>
                    {/* Description text with constrained max-width so it wraps before touching ClearReality */}
                    <p className="mt-2 text-xs sm:text-sm text-neutral-300 font-normal leading-relaxed max-w-[310px] sm:max-w-[330px] lg:max-w-[320px] min-[1150px]:max-w-[380px] xl:max-w-[460px] mx-auto lg:mx-0">
                        Enlarge photos, anime, product images, portraits, and old pictures by 2x, 4x or 8x. AI Upscaler improves clarity and generates cleaner detail in a fast offline workflow.
                    </p>
                    {/* Launch Studio CTA (Desktop only, positioned under text) */}
                    <div className="hidden lg:flex pt-6 sm:pt-10 lg:pt-14 flex-col sm:flex-row items-center lg:items-start gap-3 sm:gap-4 w-full sm:w-auto">
                        <button
                            onClick={onLaunchUpscaler}
                            className="w-fit justify-center px-6 py-3.5 rounded-full bg-[#00FF85] hover:bg-[#00E575] text-black font-extrabold text-xs sm:text-sm shadow-[0_0_25px_rgba(0,255,133,0.35)] hover:shadow-[0_0_35px_rgba(0,255,133,0.55)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 group cursor-pointer"
                        >
                            <span>Launch AI Upscaler</span>
                            <span className="group-hover:translate-x-1 transition-transform font-black">→</span>
                        </button>
                    </div>
                </div>
                {/* ========================================================================= */}
                {/* RIGHT: CARDS CLUSTER (Card 3 Hero, Card 2 Overlapping, Card 1 Centered)   */}
                {/* ========================================================================= */}
                <div className="flex flex-col items-center lg:items-end w-full lg:w-auto">
                    <div className="relative shrink-0 flex items-start justify-center lg:justify-end scale-[0.58] min-[420px]:scale-[0.66] sm:scale-[0.8] md:scale-[0.9] lg:scale-[0.74] min-[1150px]:scale-[0.82] xl:scale-[0.92] 2xl:scale-100 origin-center lg:origin-top-right translate-x-12 min-[420px]:translate-x-16 sm:translate-x-20 lg:translate-x-0 h-[450px] sm:h-[490px] lg:h-auto my-2 lg:my-0">
                        <div className="relative">
                        {/* ----------------------------------------------------------------- */}
                        {/* CARD 3: MOST LARGE SPIDERMAN CARD */}
                        {/* ----------------------------------------------------------------- */}
                        <motion.div
                            whileHover={{ scale: 1.02, y: -4 }}
                            onMouseEnter={() => setActiveCard(2)}
                            onMouseLeave={() => setActiveCard(null)}
                            onClick={() => setActiveCard(activeCard === 2 ? null : 2)}
                            className={`top-[-10px] sm:top-[45px] w-[280px] sm:w-[310px] lg:w-[335px] xl:w-[350px] h-[410px] sm:h-[430px] lg:h-[550px] rounded-[28px] sm:rounded-[34px] overflow-hidden border transition-all duration-500 relative cursor-pointer group z-10 ${activeCard === 2
                                ? 'border-white ring-2 ring-white/60 shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_45px_rgba(255,255,255,0.35),0_0_15px_rgba(255,255,255,0.6),inset_0_1px_3px_rgba(255,255,255,0.8)]'
                                : 'border-white/30 hover:border-white/80 shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_25px_rgba(255,255,255,0.1),inset_0_1px_2px_rgba(255,255,255,0.35)] hover:shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_35px_rgba(255,255,255,0.25),inset_0_1px_3px_rgba(255,255,255,0.6)]'
                                }`}
                        >
                            <img
                                src="/home/upscaler/spiderman_real_model.png"
                                alt="8K Ultra Super-Resolution Spiderman"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none"
                            />
                            {/* Gradient Overlays */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40 pointer-events-none" />
                            {/* Top Badges */}
                            <div className="absolute bottom-4 right-4 flex items-center justify-between pointer-events-none">
                                <div className="px-3 py-1 text-white rounded bg-black/75 backdrop-blur-md text-[10px] font-mono font-bold flex items-center gap-2 shadow-lg text-neutral-300 border border-white/10">
                                    <span>REAL-ESRGAN</span>
                                </div>
                            </div>
                        </motion.div>
                        {/* ----------------------------------------------------------------- */}
                        {/* CARD 2 WRAPPER: Overlaps Card 3 on bottom-left, anchors Card 1    */}
                        {/* ----------------------------------------------------------------- */}
                        <div className="absolute -bottom-8 sm:-bottom-16 lg:-bottom-20 -left-16 sm:-left-20 lg:-left-16 min-[1150px]:-left-20 xl:-left-24 z-20 w-[190px] sm:w-[205px] lg:w-[215px]">
                            {/* CARD 2 ELEMENT */}
                            <motion.div
                                whileHover={{ scale: 1.04, y: -4 }}
                                onMouseEnter={() => setActiveCard(1)}
                                onMouseLeave={() => setActiveCard(null)}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveCard(activeCard === 1 ? null : 1);
                                }}
                                className={`bottom-[-100px] sm:bottom-[1px] w-full rounded-[22px] sm:rounded-[24px] bg-[#161824] border transition-all duration-300 overflow-hidden cursor-pointer flex flex-col relative z-20 group ${activeCard === 1
                                    ? 'border-white ring-2 ring-white/60 shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_40px_rgba(255,255,255,0.35),0_0_15px_rgba(255,255,255,0.6),inset_0_1px_3px_rgba(255,255,255,0.8)]'
                                    : 'border-white/30 hover:border-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.95),0_0_22px_rgba(255,255,255,0.1),inset_0_1px_2px_rgba(255,255,255,0.35)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_32px_rgba(255,255,255,0.25),inset_0_1px_3px_rgba(255,255,255,0.6)]'
                                    }`}
                            >
                                <div className="relative w-full h-[260px] sm:h-[295px] lg:h-[300px] bg-black overflow-hidden flex items-center justify-center group">
                                    <img
                                        src="/home/upscaler/spiderman_upscaled_8x_ultrasharp_reduced.jpg"
                                        alt="AI Model 1 Upscaled Spiderman"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 select-none"
                                    />
                                    <div className="absolute text-white font-bold bottom-2 left-2 px-2 py-0.5 rounded bg-black/75 backdrop-blur-md text-[10px] font-mono font-bold text-neutral-300 border border-white/10"
                                    >
                                        Ultrasharp
                                    </div>
                                </div>
                            </motion.div>
                            {/* --------------------------------------------------------------- */}
                            {/* ORIGINAL SPIDERMAN CARD: ON TOP OF ULTRASHARP & LEFT OF CARD 3  */}
                            {/* --------------------------------------------------------------- */}
                            <div className="absolute bottom-[calc(100%+12px)] sm:bottom-[calc(100%+14px)] lg:bottom-[calc(100%+14px)] min-[1150px]:bottom-[calc(100%+2.5em)] xl:bottom-[calc(100%+3.5em)] 2xl:bottom-[calc(100%+5em)] left-[-70px] z-30">
                                <motion.div
                                    whileHover={{ scale: 1.05, y: -4 }}
                                    onMouseEnter={() => setActiveCard(0)}
                                    onMouseLeave={() => setActiveCard(null)}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveCard(activeCard === 0 ? null : 0);
                                    }}
                                    className={`w-[130px] sm:w-[138px] lg:w-[145px] rounded-[16px] sm:rounded-[18px] bg-[#141620] border transition-all duration-300 overflow-hidden cursor-pointer flex flex-col group ${activeCard === 0
                                        ? 'border-white ring-2 ring-white/60 shadow-[0_20px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(255,255,255,0.35),0_0_12px_rgba(255,255,255,0.6),inset_0_1px_3px_rgba(255,255,255,0.8)]'
                                        : 'border-white/30 hover:border-white/80 shadow-[0_15px_40px_rgba(0,0,0,0.9),0_0_20px_rgba(255,255,255,0.1),inset_0_1px_2px_rgba(255,255,255,0.35)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.95),0_0_28px_rgba(255,255,255,0.25),inset_0_1px_3px_rgba(255,255,255,0.6)]'
                                        }`}
                                >
                                    {/* Image Preview Window (spiderman_og.jpeg) */}
                                    <div className="relative w-full h-[150px] sm:h-[160px] lg:h-[170px] bg-black overflow-hidden flex items-center justify-center group">
                                        <img
                                            src="/home/upscaler/spiderman_og.jpeg"
                                            alt="1x Low-res Original Spiderman"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 select-none"
                                            style={{ imageRendering: 'pixelated' }}
                                        />
                                        <div className="absolute text-white font-bold bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-black/75 text-[9px] font-mono text-neutral-300 border border-white/10">
                                            ORG
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                            {/* --------------------------------------------------------------- */}
                            {/* CLEAR REALITY CARD: ON LEFT SIDE OF CARD 2 */}
                            {/* --------------------------------------------------------------- */}
                            <div className="absolute -left-[185px] sm:-left-[195px] lg:-left-[155px] min-[1150px]:-left-[185px] xl:-left-[220px] 2xl:-left-[230px] top-[10%] sm:top-[12%] lg:top-[6%] min-[1150px]:top-[-8%] xl:top-[-20%] z-10">
                                <motion.div
                                    whileHover={{ scale: 1.05, y: -4 }}
                                    onMouseEnter={() => setActiveCard(3)}
                                    onMouseLeave={() => setActiveCard(null)}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveCard(activeCard === 3 ? null : 3);
                                    }}
                                    className={`w-[165px] sm:w-[175px] lg:w-[180px] rounded-[18px] sm:rounded-[20px] bg-[#141620] border transition-all duration-300 overflow-hidden cursor-pointer flex flex-col group ${activeCard === 3
                                        ? 'border-white ring-2 ring-white/60 shadow-[0_20px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(255,255,255,0.35),0_0_12px_rgba(255,255,255,0.6),inset_0_1px_3px_rgba(255,255,255,0.8)]'
                                        : 'border-white/30 hover:border-white/80 shadow-[0_15px_40px_rgba(0,0,0,0.9),0_0_20px_rgba(255,255,255,0.1),inset_0_1px_2px_rgba(255,255,255,0.35)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.95),0_0_28px_rgba(255,255,255,0.25),inset_0_1px_3px_rgba(255,255,255,0.6)]'
                                        }`}
                                >
                                    {/* Image Preview Window (ClearReality) */}
                                    <div className="relative w-full h-[200px] sm:h-[210px] lg:h-[220px] bg-black overflow-hidden flex items-center justify-center group">
                                        <img
                                            src="/home/upscaler/spiderman_upscaled_8x_creality_reduced.jpg"
                                            alt="ClearReality Upscaled Spiderman"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 select-none"
                                        />
                                        <div className="absolute text-white font-bold bottom-2 left-2 px-2 py-0.5 rounded bg-black/75 text-[10px] font-mono text-neutral-300 border border-white/10">
                                            ClearReality
                                        </div>
                                    </div>
                                </motion.div>
                                {/* AI DELEGATED SYMBOL: Directly below ClearReality card with curved arrow to Card 2 */}
                                <div className="absolute top-[calc(100%+50px)] left-1/2 -translate-x-[40px] flex flex-col items-center justify-center rotate-[30deg] select-none pointer-events-none whitespace-nowrap">
                                    <span
                                        className="text-md font-bold text-white italic tracking-tight drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                                        style={{ fontFamily: 'cursive, system-ui, sans-serif' }}
                                    >
                                        AI Delegated
                                    </span>
                                    {/* Curved SVG Arrow curving towards Card 2 */}
                                    <svg
                                        width="68"
                                        height="30"
                                        viewBox="0 0 68 30"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="text-[#00C86A] drop-shadow-[0_0_6px_rgba(0,200,106,0.5)] translate-x-3"
                                    >
                                        <path
                                            d="M 6 6 C 18 22, 42 26, 60 18"
                                            stroke="currentColor"
                                            strokeWidth="2.2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M 52 12 L 61 18 L 53 24"
                                            stroke="currentColor"
                                            strokeWidth="2.2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                    {/* Mobile Action CTA Button (below cards on mobile) */}
                    <div className="flex lg:hidden justify-center w-full mt-4 sm:mt-6 z-30">
                        <button
                            onClick={onLaunchUpscaler}
                            className="w-fit justify-center px-6 py-3.5 rounded-full bg-[#00FF85] hover:bg-[#00E575] text-black font-extrabold text-xs sm:text-sm shadow-[0_0_25px_rgba(0,255,133,0.35)] hover:shadow-[0_0_35px_rgba(0,255,133,0.55)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 group cursor-pointer"
                        >
                            <span>Launch AI Upscaler</span>
                            <span className="group-hover:translate-x-1 transition-transform font-black">→</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}