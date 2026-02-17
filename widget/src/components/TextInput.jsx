import { useState } from 'react';

export default function TextInput({ type = 'text', placeholder, onSubmit, disabled }) {
    const [value, setValue] = useState('');
    const [error, setError] = useState('');

    const validate = (val) => {
        if (type === 'phone') {
            const digits = val.replace(/\D/g, '');
            if (digits.length !== 10) {
                return 'Please enter a valid 10-digit phone number';
            }
        }
        if (!val.trim()) {
            return 'This field is required';
        }
        return '';
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const err = validate(value);
        if (err) {
            setError(err);
            return;
        }
        setError('');
        onSubmit(value.trim());
        setValue('');
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 px-1 animate-fade-in">
            <div className="flex-1 relative">
                <input
                    type={type === 'phone' ? 'tel' : 'text'}
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                        if (error) setError('');
                    }}
                    placeholder={placeholder}
                    disabled={disabled}
                    maxLength={type === 'phone' ? 10 : 100}
                    className={`
            w-full px-4 py-3 rounded-xl text-[14px]
            border-2 bg-white text-dark
            outline-none transition-all duration-200
            placeholder:text-gray-400
            ${error
                            ? 'border-red-400 focus:border-red-500'
                            : 'border-gray-200 focus:border-secondary'
                        }
            disabled:opacity-50
          `}
                    autoFocus
                />
                {error && (
                    <p className="absolute -bottom-5 left-2 text-[11px] text-red-500 animate-fade-in">
                        {error}
                    </p>
                )}
            </div>

            <button
                type="submit"
                disabled={disabled || !value.trim()}
                className={`
          w-11 h-11 rounded-xl flex items-center justify-center
          bg-gradient-to-br from-primary to-[#FF5252]
          text-white shadow-md shadow-primary/20
          transition-all duration-200
          hover:shadow-lg hover:shadow-primary/30
          active:scale-95
          disabled:opacity-40 disabled:cursor-not-allowed
          flex-shrink-0
        `}
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
            </button>
        </form>
    );
}
