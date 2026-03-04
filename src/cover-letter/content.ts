interface Meta {
  title: string;
  pdfFilename: string;
}

interface SocialLink {
  handle: string;
  url: string;
}

interface Contact {
  email: string;
  phone: string;
  location: string;
  github: SocialLink;
  linkedin: SocialLink;
}

interface Recipient {
  company: string;
  address: string;
  location: string;
  phone: string;
  email: string;
}

interface FooterLink {
  label: string;
  url: string;
}

interface Footer {
  name: string;
  linkedin: FooterLink;
}

interface CoverLetterProfile {
  meta: Meta;
  name: string;
  contact: Contact;
  footer: Footer;
  date: string;
  recipient: Recipient;
  greeting: string;
  paragraphs: string[];
  closing: string;
}

var coverLetterProfiles: Record<string, CoverLetterProfile> = {
  real: {
    meta: {
      title: "Miguel Cruz — Cover Letter",
      pdfFilename: "MiguelCruz_CoverLetter.pdf"
    },
    name: "Miguel Cruz",
    contact: {
      email: "miguel.vale.cruz@gmail.com",
      phone: "(604) 626-9579",
      location: "Bothell, WA",
      github:   { handle: "migcruz",         url: "https://github.com/migcruz" },
      linkedin: { handle: "miguelramoncruz", url: "https://linkedin.com/in/miguelramoncruz" }
    },
    footer: {
      name: "MIGUEL CRUZ",
      linkedin: { label: "LINKEDIN.COM/IN/MIGUELRAMONCRUZ", url: "https://linkedin.com/in/miguelramoncruz" }
    },
    date: "March 04, 2026",
    recipient: {
      company: "Helion Energy",
      address: "1415 75th St SW",
      location: "Everett, WA 98203",
      phone: "",
      email: "inquiries@helionenergy.com"
    },
    greeting: "Dear Helion Energy hiring team,",
    paragraphs: [
      "I’m excited to apply for the Senior Firmware Engineer role at Helion Energy. I bring over 7 years of experience building firmware for consumer electronics, spanning bare-metal silicon bring-up, RTOS drivers, UEFI/BIOS firmware, and cloud-managed test automation. Combined with an educational foundation in Mechatronic Systems Engineering, I offer an interdisciplinary background of firmware depth, hardware intuition, and system-level thinking to tackle complex problems. I’m especially motivated by Helion’s mission because I believe advancing fusion technology is essential to making clean energy abundant and affordable and unlocking the next stage of human innovation.",

      "At Microsoft, I took ownership of firmware components for Surface devices spanning multiple SoC generations, specifically secure update mechanisms in UEFI. In parallel, I built CI/CD pipelines in Azure DevOps to provide reliability metrics to management through data visualization. At Meta, I developed firmware for AR/VR wearable devices and resolved a production-blocking issue in factory provisioning due to tooling dependencies. I architected a containerized provisioning pipeline that encapsulated all tooling dependencies to provide a portable, reproducible flashing and serialization workflow while eliminating vendor tooling constraints. Most recently, I spearheaded post-silicon bring-up for a custom multi-MCU SoC, operating with urgency under tight hardware validation timelines. I rapidly iterated on driver architecture and initialization sequences while executing rigorously at the register level by carefully validating power-domain ordering, clock-tree dependencies, and state transitions to achieve first display output on new silicon. I am confident working across protocols such as I2C, SPI, UART, and MIPI DSI2/CSI2, and I am comfortable debugging with JTAG/SWD (J-Link) in both bare-metal and RTOS environments. My interdisciplinary engineering background enables me to collaborate closely with cross-functional teams, anticipate edge cases, and build software that scales across generations of complex systems. I believe this experience, combined with our shared belief in fusion energy’s transformative potential, aligns strongly with Helion’s mission of achieving energy independence.",

      "I am always eager to step outside my comfort zone by diving into unfamiliar codebases, ramping up on new hardware, and taking ownership beyond my formal role to help the team succeed. I have attached my resume for your review, and I would welcome the opportunity to connect and build great things together. Thank you, and I look forward to hearing back from you soon."
    ],
    closing: "Sincerely,"
  }
};
