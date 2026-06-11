import { ExpandableResume } from "@/components/resume/ExpandableResume";
import type { ResumeRole } from "@/data/resume";

type ResumeRoleListProps = {
  roles: ResumeRole[];
};

export function ResumeRoleList({ roles }: ResumeRoleListProps) {
  return (
    <div className="resume-list-item-list">
      {roles.map((role) => (
        <ExpandableResume
          title={role.title}
          date={role.date}
          key={role.id}
          listElements={
            <ul>
              {role.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          }
        />
      ))}
    </div>
  );
}
