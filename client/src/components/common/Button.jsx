import React from 'react'

export const Button = ({
children,
onClick,
type = "button",
variant = "primary",
disabled = false
,
className = ""
}) => {
const variants = {
primary: "btn bg-lime-400 text-gray-950 border-0 hover:bg-lime-300",
secondary: "btn btn-outline",
danger: "btn btn-error",
}

return (
    <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`${variants[variant]} ${className}`}
    >
        {children}
    </button>
)

}
