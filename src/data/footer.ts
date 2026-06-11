export type FooterLink = {
  href: string;
  label: string;
};

export const footerContent = {
  title: "Time to Cook before it's monday",
  label:
    "You made it this far, don't leave me hanging. Send a message, I'm genuinely nice, I promise.",
  markLabel: "(Yes, that's my name)",
  credit: "developed and designed by me with care.",
  links: [
    {
      href: "https://www.linkedin.com/in/nunops",
      label: "LinkedIn",
    },
    {
      href: "mailto:nunopereirasousa00@gmail.com",
      label: "nunopereirasousa00@gmail.com",
    },
    {
      href: "https://github.com/Nunopereirasousa",
      label: "GitHub",
    },
  ] satisfies FooterLink[],
};
