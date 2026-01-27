import { useState } from "react";
import { Dash, Plus } from "react-bootstrap-icons";

type Props = {
  title: string;
  date: string;
  listElements: React.ReactElement;
};

export function ExpandableResume({ title, date, listElements }: Props) {
  const [visibility, setVisibility] = useState(false);

  const toggleVisilibity = () => {
    setVisibility(!visibility);
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
        <p
          className="expandable-resume-label"
          dangerouslySetInnerHTML={{ __html: date }}
        />
      </div>

      <button className="expandable-resume-button" onClick={toggleVisilibity}>
        {!visibility ? <Plus size={20} /> : <Dash size={20} />} Expand info
      </button>

      {visibility && (
        <div className="expandable-resume-list">{listElements}</div>
      )}
    </div>
  );
}
