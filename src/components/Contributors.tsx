import type { ReactNode } from "react";

const campusQuery = "National Chung Cheng University, Minxiong, Chiayi, Taiwan";
const campusPin = "23.563333,120.473889";
const campusMap = `https://maps.google.com/maps?q=${encodeURIComponent(`${campusPin} (${campusQuery})`)}&z=15&hl=en&output=embed`;
const campusLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(campusQuery)}`;

// Leave email and linkedin empty until the addresses are ready. An email may be a plain address or a mailto: link.
const contributors: { name: string; email: string; linkedin: string }[] = [
  { name: "Naisha Eshwar Shelke", email: "", linkedin: "" },
  { name: "Chandana Virupaksha", email: "", linkedin: "" },
  { name: "Ayush Kumar", email: "", linkedin: "" },
];

function mailHref(value: string) {
  if (!value) return "";
  return value.startsWith("mailto:") ? value : `mailto:${value}`;
}

function ContactLink({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  if (!href) {
    return (
      <a
        aria-disabled="true"
        aria-label={`${label}, link coming soon`}
        title="Link coming soon"
        onClick={(event) => event.preventDefault()}
      >
        {children}
      </a>
    );
  }
  const external = href.startsWith("http");
  return (
    <a href={href} aria-label={label} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>
      {children}
    </a>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4.5 7l7.5 6 7.5-6" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M8 10.5V17M8 7.6h.01M12 17v-3.8a2 2 0 0 1 4 0V17M12 12.8V17"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Contributors() {
  return (
    <div className="view">
      <header className="view-h">
        <p className="eyebrow">CCU · NASA Space Apps 2026</p>
        <h1>Contributors</h1>
        <p className="dek">National Chung Cheng University. One project, built together.</p>
      </header>
      <figure className="campus-map">
        <iframe title="Map of National Chung Cheng University" src={campusMap} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        <figcaption>
          <a href={campusLink} target="_blank" rel="noreferrer">
            National Chung Cheng University
          </a>
        </figcaption>
      </figure>
      <ul className="contributors">
        {contributors.map((person) => (
          <li key={person.name}>
            <span>{person.name}</span>
            <span className="contact-links">
              <ContactLink href={mailHref(person.email)} label={`${person.name} email`}>
                <MailIcon />
              </ContactLink>
              <ContactLink href={person.linkedin} label={`${person.name} LinkedIn`}>
                <LinkedInIcon />
              </ContactLink>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
