export default function QuickReplies({ options, onSelect, disabled }) {
    if (!options || options.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2 px-1 animate-fade-in">
            {options.map((option, i) => (
                <button
                    key={i}
                    onClick={() => !disabled && onSelect(option)}
                    disabled={disabled}
                    className={`
            px-4 py-2.5 rounded-full text-[13px] font-medium
            border-2 border-secondary text-secondary
            bg-white
            transition-all duration-200 ease-out
            hover:bg-secondary hover:text-white hover:shadow-md hover:shadow-secondary/20
            active:scale-95
            disabled:opacity-50 disabled:cursor-not-allowed
            whitespace-nowrap
          `}
                    style={{ animationDelay: `${i * 80}ms` }}
                >
                    {option}
                </button>
            ))}
        </div>
    );
}
