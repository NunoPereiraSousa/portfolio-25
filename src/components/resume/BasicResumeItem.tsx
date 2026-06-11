type Props = {
  text: string;
};

export function BasicResumeItem({ text }: Props) {
  return (
    <div className="resume-basic-item">
      <p className="resume-basic-item__title" data-split="lines">
        {text}
      </p>
    </div>
  );
}
