import { SectionHeader } from "@/components/SectionHeader";
import { educationItems, resumeGroups, resumeRoles } from "@/data";
import { ResumeEducation } from "@/features/home/resume/ResumeEducation";
import { ResumeGroupList } from "@/features/home/resume/ResumeGroupList";
import { ResumeMark } from "@/features/home/resume/ResumeMark";
import { ResumeRoleList } from "@/features/home/resume/ResumeRoleList";

export function ResumeSection() {
  return (
    <section className="resume">
      <SectionHeader text={"Resume"} />

      <div className="resume-grid">
        <div className="resume-sticky">
          <ResumeMark />
        </div>

        <div className="resume-list">
          <div className="resume-list-item">
            <SectionHeader text={"Resume"} variation="large" />
            <ResumeRoleList roles={resumeRoles} />
          </div>

          <ResumeGroupList groups={resumeGroups} />

          <div className="resume-list-item">
            <SectionHeader text={"education"} variation="large" />
            <ResumeEducation items={educationItems} />
          </div>
        </div>
      </div>
    </section>
  );
}
