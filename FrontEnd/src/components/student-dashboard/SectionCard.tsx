import type { ReactNode } from "react";

type Props = {
    title: string;
    actionLabel?: string;
    onAction?: () => void;
    children: ReactNode;
    className?: string;
};

const SectionCard = ({ title, actionLabel, onAction, children, className = "" }: Props) => {
    return (
        <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm ${className}`}>
            <div className="p-5 border-b border-gray-100 flex items-center justify-between gap-3">
                <h2 className="text-base md:text-lg font-bold text-gray-800">{title}</h2>
                {actionLabel && onAction && (
                    <button
                        type="button"
                        onClick={onAction}
                        className="text-sm font-semibold text-violet-600 hover:text-violet-700 transition-colors"
                    >
                        {actionLabel}
                    </button>
                )}
            </div>
            <div className="p-5">{children}</div>
        </div>
    );
};

export default SectionCard;
