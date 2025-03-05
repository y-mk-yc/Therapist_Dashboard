import React, { useState } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";

interface TooltipProps
{
    content: string; // Tooltip content (supports multiple lines)
}

const TooltipHand: React.FC<TooltipProps> = ({ content }) =>
{
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            <AiOutlineInfoCircle className={'fill-primary cursor-help peer'} />
            {isVisible && (
                <div className="absolute z-10 -left-48 bg-white text-black text-sm rounded-lg p-2 shadow-lg max-w-2lg">
                    <pre className="">{content}</pre>
                </div>
            )}
        </div>
    );
};

export default TooltipHand;
