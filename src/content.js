const profiles = {
  real: {
    meta: {
      title: "Miguel Cruz — Resume",
      pdfFilename: "MiguelCruz_Resume.pdf"
    },
    name: "Miguel Cruz",
    contact: {
      email: "miguel.vale.cruz@gmail.com",
      phone: "(604) 626-9579",
      location: "Bothell, WA",
      github:   { handle: "migcruz",          url: "https://github.com/migcruz" },
      linkedin: { handle: "miguelramoncruz",  url: "https://linkedin.com/in/miguelramoncruz" }
    },
    summary: "Embedded systems engineer with 7+ years of experience across consumer electronics, wearables, and IoT. Specializes in silicon bring-up, production-grade driver development, and bootloader/firmware architecture on Zephyr RTOS and UEFI. Proven track record building CI/CD pipelines and test frameworks that raise firmware reliability and performance in embedded systems.",
    education: [
      {
        degree: "Mechatronic Systems Engineering",
        credential: "Bachelor of Applied Science",
        institution: "Simon Fraser University",
        dates: "2012 — 2016"
      }
    ],
    skills: [
      { label: "Programming Languages", items: ["C/C++", "Python"] },
      { label: "RTOS & Frameworks",     items: ["Zephyr", "FreeRTOS", "UEFI"] },
      { label: "Infrastructure",        items: ["Docker", "Azure DevOps", "CMake", "Robot Framework"] },
      { label: "Protocols",             items: ["UART", "I2C", "SPI", "CAN", "DSI2/CSI2 (C-PHY/D-PHY)", "Bluetooth"] },
      { label: "Microcontrollers",      items: ["ARM Cortex-M", "STM32", "Nordic nRF54"] },
      { label: "Tools",                 items: ["JTAG/SWD + GDB", "Logic Analyzer", "Oscilloscope"] }
    ],
    experience: [
      {
        title: "Firmware Engineer",
        company: "Meta",
        type: "contract",
        dates: "Oct. 2025 — Feb. 2026",
        location: "Redmond, WA, USA",
        bullets: [
          "Spearheaded the post-silicon bring-up of a MIPI DSI display subsystem on a custom multi-MCU SoC by translating bare-metal validation flows into production Zephyr RTOS drivers for C/D-PHY initialization. This included explicit power-domain sequencing and clock-tree initialization ordering to achieve first display output on new silicon, a critical hardware validation gate for the program.",
          "Debugged and resolved critical silicon bring-up issues, including bus faults from power domain sequencing violations and read-modify-write hazards on certain registers; the resulting defensive initialization patterns were adopted across the team to prevent recurrence in future bring-up cycles.",
          "Designed and prototyped a memory-to-peripheral DMA triple-buffering system on Zephyr RTOS, validating the architecture as a viable path to meeting the program's display pipeline throughput requirements."
        ]
      },
      {
        title: "Software Engineer",
        company: "Microsoft",
        type: "contract",
        dates: "Jun. 2025 — Oct. 2025",
        location: "Redmond, WA, USA",
        bullets: [
          "Integrated Qualcomm BSPs for audio subsystems on Microsoft Surface devices, performing functional smoke testing and coordinating with Qualcomm and internal Microsoft teams to resolve issues spanning BSP defects, UEFI firmware layers, and OS-level driver behavior across different Windows builds.",
          "Authored knowledge transfer documentation and training materials to enable a smooth handoff to an offshore team, ensuring continuity of audio driver bring-up and DVE validation workflows."
        ],
        anonBullets: [
          "Integrated Qualcomm BSPs for audio subsystems on next-generation devices, performing functional smoke testing and coordinating with the chipset vendor and internal teams to resolve issues spanning BSP defects, UEFI firmware layers, and OS-level driver behavior across different OS builds.",
          "Authored knowledge transfer documentation and training materials to enable a smooth handoff to an offshore team, ensuring continuity of audio driver bring-up and DVE validation workflows."
        ]
      },
      {
        title: "Firmware Engineer",
        company: "Meta",
        type: "contract",
        dates: "Sep. 2023 — Mar. 2025",
        location: "Redmond, WA, USA",
        bullets: [
          "Integrated and commonized MCUBoot across the firmware codebase by developing a shared wrapper module that encapsulates bootloader configuration and exposes a clean interface for per-project build flag injection, eliminating duplicated bootloader instances; adopted by 3 projects before handoff.",
          "Designed and implemented an NVS-backed configuration system for a universal debug board on an STM32 Cortex-M7 with Zephyr RTOS, enabling end users to persist custom workflow configurations across power cycles while also supporting per-device serial numbers and batch-specific factory provisioning.",
          "Developed and deployed CI/CD pipelines and a two-tier automated test suite for embedded firmware, combining unit tests with hardware-mocked I2C/SPI/NVS/GPIO interfaces on PRs and daily system-level hardware-in-the-loop tests via Robot Framework, surfacing regressions within 24 hours of check-in."
        ]
      },
      {
        title: "Software/Firmware Engineer",
        company: "Microsoft",
        type: null,
        dates: "Feb. 2020 — Dec. 2022",
        location: "Redmond, WA, USA",
        bullets: [
          "Developed a TPM firmware update driver in C for a new chip vendor, enabling Surface devices to meet Windows 11 TPM 2.0 compliance requirements ahead of the OS rollout.",
          "Owned and maintained firmware update drivers (UEFI, Intel CSME, TPM, MCU) across multiple Surface device generations, ensuring cross-SoC compatibility and secure update delivery as hardware platforms evolved."
        ],
        anonBullets: [
          "Developed a TPM firmware update driver in C for a new chip vendor, enabling Large Tech Company devices to meet Windows 11 TPM 2.0 compliance requirements ahead of the OS rollout.",
          "Owned and maintained firmware update drivers (UEFI, Intel CSME, TPM, MCU) across multiple Surface device generations, ensuring cross-SoC compatibility and secure update delivery as hardware platforms evolved."
        ],
      },
      {
        title: "Software Development Engineer",
        company: "Microsoft",
        type: "contract",
        dates: "Apr. 2018 — Oct. 2019",
        location: "Redmond, WA, USA",
        bullets: [
          "Led a team of 3 engineers to build and maintain an automated UEFI test lab for Microsoft Surface devices, running nightly regression gauntlets across device SKUs via Azure DevOps and surfacing build failures within 24 hours of commit."
        ],
        anonBullets: [
          "Led a team of 3 engineers to build and maintain an automated UEFI test lab for Large Tech Company devices, running nightly regression gauntlets across device SKUs via Azure DevOps and surfacing build failures within 24 hours of commit."
        ]
      }
    ],
    footer: {
      name: "MIGUEL CRUZ",
      linkedin: { label: "LINKEDIN.COM/IN/MIGUELRAMONCRUZ", url: "https://linkedin.com/in/miguelramoncruz" }
    }
  }
};

profiles.anon = {
  ...profiles.real,
  meta: {
    title: "John Doe — Resume",
    pdfFilename: "JohnDoe_Resume.pdf"
  },
  name: "John Doe",
  contact: {
    email: "john.doe@email.com",
    phone: "(555) 555-5555",
    location: "Techville, USA",
    github:   { handle: "johndoe", url: "#" },
    linkedin: { handle: "johndoe", url: "#" }
  },
  education: profiles.real.education.map(e => ({
    ...e,
    institution: "Large Research University",
    dates: "—"
  })),
  experience: profiles.real.experience.map(job => ({
    ...job,
    company: "Large Technology Company",
    location: "Techville, USA",
    bullets: job.anonBullets || job.bullets
  })),
  footer: {
    name: "JOHN DOE",
    linkedin: { label: "LINKEDIN.COM/IN/JOHNDOE", url: "#" }
  }
};
