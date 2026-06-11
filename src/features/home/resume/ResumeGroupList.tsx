import { BasicResumeItem } from "@/components/resume/BasicResumeItem";
import { SectionHeader } from "@/components/SectionHeader";
import type { ResumeGroup } from "@/data/resume";

type ResumeGroupListProps = {
  groups: ResumeGroup[];
};

export function ResumeGroupList({ groups }: ResumeGroupListProps) {
  return (
    <>
      {groups.map((group) => (
        <div
          className={`resume-list-item resume-list-item--${group.id}`}
          key={group.id}
        >
          <SectionHeader text={group.title} variation="large" />

          <div className="awards-list">
            {group.items.map((item) => (
              <BasicResumeItem text={item} key={item} />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
