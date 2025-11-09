import React from 'react';

export default function NodeFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="
        rounded-xl 
        p-2
        bg-gray-50
        w-full 
        max-w-xs              
        h-80                 
        shadow-md
        border-2
        border-transparent
        focus-within:border-purple-300
        focus-within:border-2
        transition-colors
        flex 
        flex-col
      "
    >
      {children}
    </div>
  );
}