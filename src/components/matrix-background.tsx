import { type CSSProperties, useEffect, useState } from "react";

function getNewText() {
    return Array.from({length: 20}, ()=>Array.from({length: 8}, ()=>~~(Math.random() + 0.5)).join('')).join(' ');
}

const radialGradient : CSSProperties = {
    backgroundImage: "radial-gradient(ellipse at top left,hsl(var(--TEXT-ACCENT)) 0%, transparent 52%,transparent 70%, hsl(var(--TEXT-ACCENT)) 100%)",
    backgroundSize: "300% 200%",
    backgroundPosition: "100%"
};

export function MatrixBackground() {
    const [text, setText] = useState<string>(getNewText());

    useEffect(()=>{
        const interval = setInterval(()=>{
            setText(getNewText());
        }, 200);

        return () => clearInterval(interval);
    }, [])

    return (
        <div className="w-[35ch] font-mono text-wrap break-words text-transparent bg-clip-text h-[11.5ch] select-none" style={radialGradient}>{text}</div>
    )
}