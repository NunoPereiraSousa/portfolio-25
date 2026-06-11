type Props = {
  topText: string;
  bottomText: {
    highlight?: string;
    text: string;
  };
};

export function ResumeItemText({ topText, bottomText }: Props) {
  return (
    <div className="resume-item-text" data-split="lines">
      <p className="resume-item-text__label">{topText}</p>
      <br />
      <br />
      <p className="resume-item-text__label">
        {bottomText.highlight && <span>{bottomText.highlight}</span>}{" "}
        {bottomText.text}
      </p>
    </div>
  );
}
