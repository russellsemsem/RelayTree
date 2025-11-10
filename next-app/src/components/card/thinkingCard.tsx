// for loading state
import React, { useState, useEffect } from 'react';

const ThinkingIndicator = () => {
    const dotCycle = ['','.','..','...'];
    const [dotIndex, setDotIndex] = useState(0);

    useEffect(() => {
        // Set up an interval to cycle through the dots
        const intervalId = setInterval(() => {
        setDotIndex(prevIndex => (prevIndex + 1) % dotCycle.length);
        }, 300);

        return () => clearInterval(intervalId);
    }, [dotCycle.length]); 

    return (
        <div className="flex flex-1 items-center justify-center">
            <div className="text-md text-slate-500">
                Thinking{dotCycle[dotIndex]}
            </div>
        </div>
    );
};

export default ThinkingIndicator;