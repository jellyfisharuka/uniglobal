import React from 'react';
import { Coffee, Sun, Moon } from 'lucide-react';

interface Greeting {
    text: string;
    icon: React.ReactNode;
}

export const getGreeting = (name: string): Greeting => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
        return {
            text: `Доброе утро, ${name}!`,
            icon: <Coffee className="h-6 w-6 text-amber-500" />
        };
    } else if (hour >= 12 && hour < 18) {
        return {
            text: `Добрый день, ${name}!`,
            icon: <Sun className="h-6 w-6 text-yellow-500" />
        };
    } else if (hour >= 18 && hour < 22) {
        return {
            text: `Добрый вечер, ${name}!`,
            icon: <Sun className="h-6 w-6 text-orange-500" />
        };
    } else {
        return {
            text: `Доброй ночи, ${name}!`,
            icon: <Moon className="h-6 w-6 text-indigo-400" />
        };
    }
}