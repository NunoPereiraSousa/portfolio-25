type Props = {
  topText: string;
  bottomText: string;
};

export function ResumeItemText({ topText, bottomText }: Props) {
  return (
    <div className="resume-item-text" data-split="lines">
      <p className="resume-item-text-label">{topText}</p>
      <br />
      <br />
      <p
        className="resume-item-text-label"
        dangerouslySetInnerHTML={{ __html: bottomText }}
      />
    </div>
  );
}
