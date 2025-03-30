import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { components } from '@/constants/markdown';

interface TypingEffectProps {
    text: string;
    speed?: number;
    className?: string;
}

export function TypingEffect({ text, speed = 10, className }: TypingEffectProps) {
    const [displayedText, setDisplayedText] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        let currentIndex = 0;
        setDisplayedText('');
        setIsComplete(false);

        const typingInterval = setInterval(() => {
            if (currentIndex < text.length) {
                setDisplayedText(prev => prev + text[currentIndex]);
                currentIndex++;
            } else {
                clearInterval(typingInterval);
                setIsComplete(true);
            }
        }, speed);

        return () => clearInterval(typingInterval);
    }, [text, speed]);

    return (
        <div className={className}>
            {isComplete ? (
                <ReactMarkdown components={components}>
                    {text}
                </ReactMarkdown>
            ) : (
                <ReactMarkdown components={components}>
                    {displayedText}
                </ReactMarkdown>
            )}
        </div>
    );
}