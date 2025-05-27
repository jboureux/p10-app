interface ButtonProps {
  type?: "button" | "submit";
  text: string;
  widthFull?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export default function Button({
  type = "button",
  text,
  widthFull = false,
  onClick,
  disabled = false,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={() => onClick && onClick()}
      disabled={disabled}
      className={`m-1 bg-[#C62828] border-2 border-[#C62828] text-white px-6 py-2 rounded-xl font-semibold cursor-pointer ${
        widthFull && "w-full"
      } ${disabled && "opacity-50 cursor-not-allowed"}`}
    >
      {text}
    </button>
  );
}
