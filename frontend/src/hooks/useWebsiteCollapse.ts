import { useState, useEffect, useCallback, useRef } from 'react';

interface UseWebsiteCollapseOptions {
    minInterval?: number; // Minimum time between animations (minutes)
    maxInterval?: number; // Maximum time between animations (minutes)
    enabled?: boolean; // Whether the animation is enabled
    onAnimationStart?: () => void;
    onAnimationEnd?: () => void;
}

export const useWebsiteCollapse = ({
    minInterval = 5,
    maxInterval = 30,
    enabled = true,
    onAnimationStart,
    onAnimationEnd,
}: UseWebsiteCollapseOptions = {}) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [nextAnimationTime, setNextAnimationTime] = useState<number>(0);

    // Use refs to avoid dependency issues
    const isAnimatingRef = useRef(false);
    const nextAnimationTimeRef = useRef(0);
    const enabledRef = useRef(enabled);

    // Update refs when state changes
    useEffect(() => {
        isAnimatingRef.current = isAnimating;
    }, [isAnimating]);

    useEffect(() => {
        nextAnimationTimeRef.current = nextAnimationTime;
    }, [nextAnimationTime]);

    useEffect(() => {
        enabledRef.current = enabled;
    }, [enabled]);

    // Calculate random time for next animation
    const calculateNextAnimationTime = useCallback(() => {
        const minMs = minInterval * 60 * 1000;
        const maxMs = maxInterval * 60 * 1000;
        const randomDelay = Math.random() * (maxMs - minMs) + minMs;
        return Date.now() + randomDelay;
    }, [minInterval, maxInterval]);

    // Trigger animation manually
    const triggerAnimation = useCallback(() => {
        if (isAnimatingRef.current) return;

        setIsAnimating(true);
        onAnimationStart?.();

        // Add animation classes to body
        document.body.classList.add('website-collapse');

        // Remove animation classes after animation completes
        setTimeout(() => {
            document.body.classList.remove('website-collapse');
            setIsAnimating(false);
            onAnimationEnd?.();

            // Schedule next animation
            const nextTime = calculateNextAnimationTime();
            setNextAnimationTime(nextTime);
        }, 15000); // 15 seconds
    }, [onAnimationStart, onAnimationEnd, calculateNextAnimationTime]);

    // Trigger animation on specific elements
    const triggerElementCollapse = useCallback((selector: string, animationType: 'element' | 'glitch' | 'time-rewind' = 'element') => {
        const elements = document.querySelectorAll(selector);

        elements.forEach((element, index) => {
            const delay = (index % 5) + 1; // Stagger delays from 1-5
            element.classList.add(`${animationType}-collapse`, `collapse-delay-${delay}`);

            // Remove classes after animation
            setTimeout(() => {
                element.classList.remove(`${animationType}-collapse`, `collapse-delay-${delay}`);
            }, 15000 + (delay * 1000));
        });
    }, []);

    // Initialize next animation time
    useEffect(() => {
        if (!enabled) return;

        const initialTime = calculateNextAnimationTime();
        setNextAnimationTime(initialTime);
    }, [enabled, calculateNextAnimationTime]);

    // Check animation time periodically
    useEffect(() => {
        if (!enabled) return;

        const checkAnimationTime = () => {
            if (enabledRef.current &&
                nextAnimationTimeRef.current > 0 &&
                Date.now() >= nextAnimationTimeRef.current &&
                !isAnimatingRef.current) {
                // Use setTimeout to avoid calling setState in interval
                setTimeout(() => {
                    if (!isAnimatingRef.current) {
                        triggerAnimation();
                    }
                }, 0);
            }
        };

        // Check every minute
        const interval = setInterval(checkAnimationTime, 60000);

        return () => clearInterval(interval);
    }, [enabled, triggerAnimation]);

    // Add random glitch effects during animation
    useEffect(() => {
        if (!isAnimating) return;

        const glitchInterval = setInterval(() => {
            if (!isAnimatingRef.current) return;

            const randomElements = document.querySelectorAll('div, p, h1, h2, h3, h4, h5, h6, span, button');
            const randomElement = randomElements[Math.floor(Math.random() * randomElements.length)];

            if (randomElement) {
                randomElement.classList.add('glitch-collapse');
                setTimeout(() => {
                    randomElement.classList.remove('glitch-collapse');
                }, 500);
            }
        }, 200); // Glitch every 200ms during animation

        return () => clearInterval(glitchInterval);
    }, [isAnimating]);

    return {
        isAnimating,
        nextAnimationTime,
        triggerAnimation,
        triggerElementCollapse,
        timeUntilNextAnimation: Math.max(0, nextAnimationTime - Date.now()),
    };
};

export default useWebsiteCollapse;
