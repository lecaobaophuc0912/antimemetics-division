import React from 'react';
import { useWebsiteCollapse } from '../../hooks/useWebsiteCollapse';

export interface WebsiteCollapseControllerProps {
    className?: string;
    showTimer?: boolean;
    showControls?: boolean;
}

export const WebsiteCollapseController: React.FC<WebsiteCollapseControllerProps> = ({
    className = '',
    showTimer = true,
    showControls = true,
}) => {
    const {
        isAnimating,
        nextAnimationTime,
        triggerAnimation,
        triggerElementCollapse,
        timeUntilNextAnimation,
    } = useWebsiteCollapse({
        minInterval: 5,
        maxInterval: 30,
        enabled: true,
        onAnimationStart: () => {
            console.log('🌋 Website collapse animation started!');
        },
        onAnimationEnd: () => {
            console.log('⏰ Time rewind completed!');
        },
    });

    const formatTime = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const getNextAnimationTime = () => {
        if (nextAnimationTime === 0) return 'Calculating...';
        const date = new Date(nextAnimationTime);
        return date.toLocaleTimeString();
    };

    return (
        <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
            <div className="glass rounded-lg border border-green-500/30 p-4 shadow-xl min-w-[280px]">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-green-300 tracking-widest">
                        WEBSITE COLLAPSE
                    </h3>
                    <div className={`w-3 h-3 rounded-full ${isAnimating ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                </div>

                {showTimer && (
                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-xs">
                            <span className="text-gray-400">Next collapse:</span>
                            <span className="text-cyan-300 font-mono">
                                {getNextAnimationTime()}
                            </span>
                        </div>

                        <div className="flex justify-between text-xs">
                            <span className="text-gray-400">Time remaining:</span>
                            <span className="text-green-300 font-mono">
                                {formatTime(timeUntilNextAnimation)}
                            </span>
                        </div>

                        <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-green-500 to-cyan-500 h-2 rounded-full transition-all duration-1000"
                                style={{
                                    width: `${Math.max(0, (timeUntilNextAnimation / (30 * 60 * 1000)) * 100)}%`
                                }}
                            />
                        </div>
                    </div>
                )}

                {showControls && (
                    <div className="space-y-2">
                        <button
                            onClick={triggerAnimation}
                            disabled={isAnimating}
                            className="w-full px-3 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isAnimating ? '🌋 COLLAPSING...' : '💥 TRIGGER COLLAPSE'}
                        </button>

                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => triggerElementCollapse('.glass', 'element')}
                                disabled={isAnimating}
                                className="px-2 py-1 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded text-xs font-medium hover:from-orange-700 hover:to-orange-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Glass Effect
                            </button>

                            <button
                                onClick={() => triggerElementCollapse('h1, h2, h3', 'glitch')}
                                disabled={isAnimating}
                                className="px-2 py-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded text-xs font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Headers Glitch
                            </button>
                        </div>
                    </div>
                )}

                {isAnimating && (
                    <div className="mt-3 p-2 bg-red-900/20 border border-red-500/30 rounded text-center">
                        <div className="text-red-400 text-xs font-medium">
                            ⚠️ WEBSITE COLLAPSING
                        </div>
                        <div className="text-red-300 text-xs">
                            Time rewind in progress...
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WebsiteCollapseController;
