interface BadgeProps {
  className?: string;
  children: React.ReactNode;
}

const Badge = (props: BadgeProps) => {
  return (
    <span className={`text-xs py-1 px-2 rounded-full ${props.className}`}>
      {props.children}
    </span>
  );
};

export default Badge;
