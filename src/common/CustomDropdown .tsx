import React, { useState } from "react";

interface Option
{
    value: string;
    label: string;
    email?: string;
}

interface CustomDropdownProps
{
    options: Option[];
    onChange: (option: Option) => void;
    placeholder: string;
    maxHeight?: number;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
    options,
    onChange,
    placeholder,
    maxHeight
}) =>
{
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<Option | null>(null);

    const handleOptionClick = (option: Option) =>
    {
        setSelectedOption(option);
        setIsOpen(false);
        onChange(option);
    };

    return (
        <div className="relative w-64">
            {/* Dropdown Header */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="border bg-white rounded-md px-4 py-2 cursor-pointer flex justify-between items-center"
            >
                <span>{selectedOption ? selectedOption.label : placeholder}</span>
                <span>{isOpen ? "▲" : "▼"}</span>
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute mt-2 w-full border  rounded-md bg-white shadow-lg z-100 overflow-scroll" style={{ maxHeight: maxHeight }}>
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleOptionClick(option)}
                        >
                            <div className="text-lg font-bold">{option.label}</div>
                            <div className="text-sm text-gray-500">{option.email}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomDropdown;
