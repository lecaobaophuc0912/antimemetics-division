import React from "react";
import { Send } from "lucide-react";

export type SendButtonProps = {
    onClick: () => void;
    disabled?: boolean;
};

export const SendButton: React.FC<SendButtonProps> = ({ onClick, disabled }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className="
                h-12 w-12
                flex items-center justify-center gap-2 rounded-full
                cursor-pointer
                text-white
                hover:bg-purple-700 active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all
            "
        >
            <Send className="w-5 h-5 text-center" />
        </button>
    );
};
