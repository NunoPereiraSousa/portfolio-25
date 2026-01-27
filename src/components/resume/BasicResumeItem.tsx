type Props = {
  text: string;
};

export function BasicResumeItem({ text }: Props) {
  return (
    <div className="basic-item">
      <p className="basic-item-title" data-split="lines">
        {text}
      </p>
    </div>
  );
}
