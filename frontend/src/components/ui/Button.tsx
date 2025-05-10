interface ButtonProps {
  type?: "button" | "submit";
  text: string;
  widthFull?: boolean;
  onClick?: () => void;
}

export default function Button({
  text,
  widthFull = false,
  onClick,
}: ButtonProps) {
  return (
    <button
      onClick={() => onClick && onClick()}
      className={`m-1 bg-[#C62828] border-2 border-[#C62828] text-white px-6 py-2 rounded-xl font-semibold cursor-pointer ${
        widthFull && "w-full"
      }`}
    >
      {text}
    </button>
  );
}
