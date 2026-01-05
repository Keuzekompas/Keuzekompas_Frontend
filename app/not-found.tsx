'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
    const [text, setText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const { t } = useTranslation();
    
    const fullText = t('notFound.title');
    const typingSpeed = 300;    // Speed when typing characters
    const deletingSpeed = 200;  // Speed when deleting characters
    const pauseDuration = 1000; // How long to wait before deleting

    useEffect(() => {
        let timeout;

        if (isDeleting) {
            // DELETING PHASE
            if (text.length > 0) {
                // Remove one character
                timeout = setTimeout(() => {
                    setText(fullText.slice(0, text.length - 1));
                }, deletingSpeed);
            } else {
                // Finished deleting, switch back to typing mode
                timeout = setTimeout(() => {
                    setIsDeleting(false);
                }, 500); // Short pause before typing starts again
            }
        } else {
            // TYPING PHASE
            if (text.length < fullText.length) {
                // Add one character
                timeout = setTimeout(() => {
                    setText(fullText.slice(0, text.length + 1));
                }, typingSpeed);
            } else {
                // Finished typing, wait a bit then start deleting
                timeout = setTimeout(() => {
                    setIsDeleting(true);
                }, pauseDuration);
            }
        }

        return () => clearTimeout(timeout);
    }, [text, isDeleting, fullText]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-6xl font-bold text-(--text-primary) mb-4 font-mono flex items-center h-16">
                {/* The text */}
                <span>{text}</span>
                
                {/* The Cursor: We keep it blinking always to simulate a real terminal */}
                <span className="ml-2 h-12 w-1 bg-(--text-primary) animate-cursor-blink"></span>
            </h1>
            
            <div className="mb-8">
                <Image
                    src="/compass.gif"
                    alt="404 Not Found"
                    width={200}
                    height={200}
                />
            </div>
            
            <p className="text-xl text-(--text-secondary) mb-8 text-center max-w-md">
                {t('notFound.message')}
            </p>
            
            <Link
                href="/modules"
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
            >
                {t('notFound.button')}
            </Link>
        </div>
    );
}