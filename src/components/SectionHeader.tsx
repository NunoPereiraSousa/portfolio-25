type Props = {
  text: string;
  variation?: string;
};

export function SectionHeader({ text, variation = "medium" }: Props) {
  return (
    <div className="header">
      <span className="header-circle"></span>
      <h3 className={"header-text" + ` ${variation}`}>{text}</h3>
    </div>
  );
}
