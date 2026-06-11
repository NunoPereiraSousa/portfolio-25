import { ResumeItemText } from "@/components/resume/ResumeItemText";
import type { EducationItem } from "@/data/resume";

type ResumeEducationProps = {
  items: EducationItem[];
};

export function ResumeEducation({ items }: ResumeEducationProps) {
  return (
    <div className="resume-list-item-list">
      {items.map((item) => (
        <ResumeItemText
          topText={item.topText}
          bottomText={item.bottomText}
          key={item.id}
        />
      ))}
    </div>
  );
}
