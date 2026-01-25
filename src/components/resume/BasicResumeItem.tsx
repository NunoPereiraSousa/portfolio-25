type Props = {
  text: string;
};

export function BasicResumeItem({ text }: Props) {
  return (
    <div className="basic-item">
      <p className="basic-item-title">{text}</p>
    </div>
  );
}
