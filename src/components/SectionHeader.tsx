type Props = {
  text: string;
  variation?: "medium" | "large";
};

export function SectionHeader({ text, variation = "medium" }: Props) {
  return (
    <div className="section-header">
      <span className="section-header__dot"></span>
      <h3 className={`section-header__text section-header__text--${variation}`}>
        {text}
      </h3>
    </div>
  );
}
