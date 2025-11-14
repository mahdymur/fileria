"use client";

import { cn } from "@/lib/utils";

// Lightning Fast - Animated lightning bolt with speed lines
export function LightningIcon({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-12 w-12", className)}>
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <defs>
          <linearGradient id="lightning-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="1" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0.5" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Speed lines - animated */}
        <g>
          <path
            d="M10 20 L15 20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="text-emerald-400/40"
          >
            <animate
              attributeName="opacity"
              values="0.2;0.6;0.2"
              dur="1.2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="d"
              values="M10 20 L15 20;M8 20 L17 20;M10 20 L15 20"
              dur="1.2s"
              repeatCount="indefinite"
            />
          </path>
          <path
            d="M8 30 L12 30"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="text-emerald-400/30"
          >
            <animate
              attributeName="opacity"
              values="0.2;0.5;0.2"
              dur="1.2s"
              begin="0.4s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="d"
              values="M8 30 L12 30;M6 30 L14 30;M8 30 L12 30"
              dur="1.2s"
              begin="0.4s"
              repeatCount="indefinite"
            />
          </path>
          <path
            d="M12 40 L16 40"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="text-emerald-400/40"
          >
            <animate
              attributeName="opacity"
              values="0.2;0.6;0.2"
              dur="1.2s"
              begin="0.8s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="d"
              values="M12 40 L16 40;M10 40 L18 40;M12 40 L16 40"
              dur="1.2s"
              begin="0.8s"
              repeatCount="indefinite"
            />
          </path>
        </g>
        
        {/* Main lightning bolt */}
        <g className="group-hover:scale-110 transition-transform duration-300" filter="url(#glow)">
          <path
            d="M32 8 L24 32 L32 32 L28 56 L52 24 L36 24 L40 8 Z"
            fill="currentColor"
            className="text-emerald-400"
          >
            <animate
              attributeName="opacity"
              values="1;0.7;1"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </path>
          <path
            d="M32 8 L24 32 L32 32 L28 56 L52 24 L36 24 L40 8 Z"
            fill="url(#lightning-gradient)"
            opacity="0.8"
          >
            <animate
              attributeName="opacity"
              values="0.6;0.9;0.6"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </path>
        </g>
      </svg>
      
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
        <div className="absolute top-2 left-4 h-1 w-1 rounded-full bg-emerald-400 animate-ping" style={{ animationDelay: "0s", animationDuration: "2s" }} />
        <div className="absolute bottom-4 right-2 h-1 w-1 rounded-full bg-emerald-300 animate-ping" style={{ animationDelay: "0.5s", animationDuration: "2s" }} />
        <div className="absolute top-6 right-6 h-0.5 w-0.5 rounded-full bg-emerald-500 animate-ping" style={{ animationDelay: "1s", animationDuration: "2s" }} />
      </div>
    </div>
  );
}

// Precise Citations - Animated target with reference markers
export function TargetIcon({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-12 w-12", className)}>
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <defs>
          <filter id="target-glow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Outer rings - pulsing */}
        <circle
          cx="32"
          cy="32"
          r="28"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-emerald-400/30"
        >
          <animate
            attributeName="opacity"
            values="0.2;0.4;0.2"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>
        <circle
          cx="32"
          cy="32"
          r="20"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-emerald-400/40"
        >
          <animate
            attributeName="opacity"
            values="0.3;0.5;0.3"
            dur="3s"
            begin="0.5s"
            repeatCount="indefinite"
          />
        </circle>
        <circle
          cx="32"
          cy="32"
          r="12"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-emerald-400/50"
        >
          <animate
            attributeName="opacity"
            values="0.4;0.6;0.4"
            dur="3s"
            begin="1s"
            repeatCount="indefinite"
          />
        </circle>
        
        {/* Center dot - pulsing */}
        <circle
          cx="32"
          cy="32"
          r="4"
          fill="currentColor"
          className="text-emerald-400"
          filter="url(#target-glow)"
        >
          <animate
            attributeName="r"
            values="4;5.5;4"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="1;0.8;1"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
        
        {/* Reference markers - rotating */}
        <g>
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 32 32"
            to="360 32 32"
            dur="8s"
            repeatCount="indefinite"
          />
          <circle
            cx="32"
            cy="12"
            r="2"
            fill="currentColor"
            className="text-emerald-300"
          >
            <animate
              attributeName="r"
              values="2;2.5;2"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
          <circle
            cx="52"
            cy="32"
            r="2"
            fill="currentColor"
            className="text-emerald-300"
          >
            <animate
              attributeName="r"
              values="2;2.5;2"
              dur="2s"
              begin="0.5s"
              repeatCount="indefinite"
            />
          </circle>
          <circle
            cx="32"
            cy="52"
            r="2"
            fill="currentColor"
            className="text-emerald-300"
          >
            <animate
              attributeName="r"
              values="2;2.5;2"
              dur="2s"
              begin="1s"
              repeatCount="indefinite"
            />
          </circle>
          <circle
            cx="12"
            cy="32"
            r="2"
            fill="currentColor"
            className="text-emerald-300"
          >
            <animate
              attributeName="r"
              values="2;2.5;2"
              dur="2s"
              begin="1.5s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
        
        {/* Connecting lines - animated */}
        <g>
          <line
            x1="32"
            y1="12"
            x2="32"
            y2="32"
            stroke="currentColor"
            strokeWidth="1"
            className="text-emerald-400/30"
          >
            <animate
              attributeName="opacity"
              values="0.2;0.5;0.2"
              dur="2s"
              repeatCount="indefinite"
            />
          </line>
          <line
            x1="52"
            y1="32"
            x2="32"
            y2="32"
            stroke="currentColor"
            strokeWidth="1"
            className="text-emerald-400/30"
          >
            <animate
              attributeName="opacity"
              values="0.2;0.5;0.2"
              dur="2s"
              begin="0.5s"
              repeatCount="indefinite"
            />
          </line>
          <line
            x1="32"
            y1="52"
            x2="32"
            y2="32"
            stroke="currentColor"
            strokeWidth="1"
            className="text-emerald-400/30"
          >
            <animate
              attributeName="opacity"
              values="0.2;0.5;0.2"
              dur="2s"
              begin="1s"
              repeatCount="indefinite"
            />
          </line>
          <line
            x1="12"
            y1="32"
            x2="32"
            y2="32"
            stroke="currentColor"
            strokeWidth="1"
            className="text-emerald-400/30"
          >
            <animate
              attributeName="opacity"
              values="0.2;0.5;0.2"
              dur="2s"
              begin="1.5s"
              repeatCount="indefinite"
            />
          </line>
        </g>
      </svg>
      
      {/* Pulsing rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute h-12 w-12 rounded-full border border-emerald-400/20 animate-ping" style={{ animationDuration: "3s" }} />
        <div className="absolute h-8 w-8 rounded-full border border-emerald-400/30 animate-ping" style={{ animationDelay: "1s", animationDuration: "3s" }} />
      </div>
    </div>
  );
}

// AI-Powered Analysis - Animated neural network/brain nodes
export function BrainIcon({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-12 w-12", className)}>
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <defs>
          <filter id="node-glow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <linearGradient id="connection-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#34d399" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        
        {/* Neural network nodes */}
        <g>
          {/* Node 1 */}
          <circle
            cx="20"
            cy="20"
            r="4"
            fill="currentColor"
            className="text-emerald-400"
            filter="url(#node-glow)"
          >
            <animate
              attributeName="opacity"
              values="0.5;1;0.5"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="r"
              values="4;4.5;4"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
          
          {/* Node 2 */}
          <circle
            cx="44"
            cy="20"
            r="4"
            fill="currentColor"
            className="text-emerald-400"
            filter="url(#node-glow)"
          >
            <animate
              attributeName="opacity"
              values="0.5;1;0.5"
              dur="2s"
              begin="0.3s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="r"
              values="4;4.5;4"
              dur="2s"
              begin="0.3s"
              repeatCount="indefinite"
            />
          </circle>
          
          {/* Node 3 - Central hub */}
          <circle
            cx="32"
            cy="32"
            r="5"
            fill="currentColor"
            className="text-emerald-300"
            filter="url(#node-glow)"
          >
            <animate
              attributeName="r"
              values="5;6.5;5"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.8;1;0.8"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
          
          {/* Node 4 */}
          <circle
            cx="16"
            cy="44"
            r="3.5"
            fill="currentColor"
            className="text-emerald-400"
            filter="url(#node-glow)"
          >
            <animate
              attributeName="opacity"
              values="0.5;1;0.5"
              dur="2s"
              begin="0.6s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="r"
              values="3.5;4;3.5"
              dur="2s"
              begin="0.6s"
              repeatCount="indefinite"
            />
          </circle>
          
          {/* Node 5 */}
          <circle
            cx="48"
            cy="44"
            r="3.5"
            fill="currentColor"
            className="text-emerald-400"
            filter="url(#node-glow)"
          >
            <animate
              attributeName="opacity"
              values="0.5;1;0.5"
              dur="2s"
              begin="0.9s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="r"
              values="3.5;4;3.5"
              dur="2s"
              begin="0.9s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
        
        {/* Connections - animated with gradient effect */}
        <g>
          <line
            x1="20"
            y1="20"
            x2="32"
            y2="32"
            stroke="url(#connection-gradient)"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <animate
              attributeName="opacity"
              values="0.2;0.8;0.2"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="stroke-width"
              values="1.5;2;1.5"
              dur="2s"
              repeatCount="indefinite"
            />
          </line>
          <line
            x1="44"
            y1="20"
            x2="32"
            y2="32"
            stroke="url(#connection-gradient)"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <animate
              attributeName="opacity"
              values="0.2;0.8;0.2"
              dur="2s"
              begin="0.3s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="stroke-width"
              values="1.5;2;1.5"
              dur="2s"
              begin="0.3s"
              repeatCount="indefinite"
            />
          </line>
          <line
            x1="32"
            y1="32"
            x2="16"
            y2="44"
            stroke="url(#connection-gradient)"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <animate
              attributeName="opacity"
              values="0.2;0.8;0.2"
              dur="2s"
              begin="0.6s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="stroke-width"
              values="1.5;2;1.5"
              dur="2s"
              begin="0.6s"
              repeatCount="indefinite"
            />
          </line>
          <line
            x1="32"
            y1="32"
            x2="48"
            y2="44"
            stroke="url(#connection-gradient)"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <animate
              attributeName="opacity"
              values="0.2;0.8;0.2"
              dur="2s"
              begin="0.9s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="stroke-width"
              values="1.5;2;1.5"
              dur="2s"
              begin="0.9s"
              repeatCount="indefinite"
            />
          </line>
          <line
            x1="20"
            y1="20"
            x2="44"
            y2="20"
            stroke="currentColor"
            strokeWidth="1"
            className="text-emerald-400/30"
            strokeLinecap="round"
          >
            <animate
              attributeName="opacity"
              values="0.1;0.4;0.1"
              dur="2.5s"
              repeatCount="indefinite"
            />
          </line>
        </g>
      </svg>
      
      {/* Glow effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute h-10 w-10 rounded-full bg-emerald-400/10 blur-md animate-pulse" />
      </div>
    </div>
  );
}

