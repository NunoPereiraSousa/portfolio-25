import { useId, useState } from "react";
import { Dash, Plus } from "react-bootstrap-icons";

type Props = {
  title: string;
  date: {
    highlight?: string;
    text: string;
  };
  listElements: React.ReactElement;
};

export function ExpandableResume({ title, date, listElements }: Props) {
  const [visible, setVisible] = useState(false);
  const contentId = useId();

  const toggleVisibility = () => {
    setVisible((current) => !current);
  };

  return (
    <div className="expandable-resume">
      <div className="expandable-resume-label" data-split="lines">
        <p>
          <u>Role:</u>
        </p>
        <p>{title}</p>
      </div>
      <br />
      <div className="expandable-resume-label" data-split="lines">
        <p>
          <u>Date:</u>
        </p>
        <p className="expandable-resume-label">
          {date.highlight && <span>{date.highlight}</span>} {date.text}
        </p>
      </div>

      <button
        className="expandable-resume-button"
        type="button"
        aria-controls={contentId}
        aria-expanded={visible}
        onClick={toggleVisibility}
      >
        {!visible ? <Plus size={20} /> : <Dash size={20} />} Expand info
      </button>

      {visible && (
        <div className="expandable-resume-list" id={contentId}>
          {listElements}
        </div>
      )}
    </div>
  );
}
