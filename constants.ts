import { ExperienceItem, SkillCategory, EducationItem } from './types';

export const RESUME_DATA = {
  name: "Rick Beacham",
  title: "Full-Stack Developer & Site Reliability Engineer",
  tagline: "Building scalable systems and driving business results through technical innovation.",
  about: "Creative, team-oriented, and results-focused Full-Stack Developer and Site Reliability Engineer (SRE) with extensive experience managing and optimizing high-traffic e-commerce platforms (BigCommerce, WooCommerce, Magento). Proven ability to drive business results through complex platform migrations, automation scripting, performance optimization, and robust infrastructure management. Excels at technical collaboration, security implementation, and building stable, scalable systems, with emerging experience in Generative AI and LLM workflows.",
  location: "Portland, OR",
  contact: {
    phone: "(508) 627-0110",
    email: "beacham.rick@proton.me"
  },
  socials: {
    github: "https://github.com",
    linkedin: "https://linkedin.com"
  }
};

export const EXPERIENCE_DATA: ExperienceItem[] = [
  {
    id: '1',
    role: "E-commerce Developer and Site Reliability Engineer",
    company: "EE Schenck Company & Maywood Studio",
    period: "01/2019 - 11/2025",
    description: "Managed IT infrastructure and full-stack development for high-volume e-commerce platforms.",
    details: [
      "Crisis Management & Scalability: Managed and scaled IT infrastructure to handle a 300% increase in sales/demand during COVID, ensuring 100% uptime.",
      "Full-Stack Migration: Led the migration and development of a new BigCommerce website for Maywood Studio and upgraded MySQL 5.6 to 8.",
      "Security Hardening: Enhanced security via CloudFlare WAF and consistent patching from MageOne and AWS.",
      "Performance Optimization: Implemented Google Analytics Conversion Tracking and New Relic monitoring to inform UX enhancements, improving SEO and engagement."
    ],
    technologies: ["BigCommerce", "MySQL", "AWS", "CloudFlare", "New Relic", "PHP"]
  },
  {
    id: '2',
    role: "E-commerce Developer and Web Design",
    company: "Equipmentland.com",
    period: "10/2016 - 11/2019",
    description: "Led platform migration and infrastructure engineering for an equipment retailer.",
    details: [
      "Platform Migration: Led full-scale migration from BigCommerce to WooCommerce with zero downtime.",
      "Cloud Infrastructure & SRE: Engineered custom Google Compute hosting with redundant Bitnami containers and Git-based workflow.",
      "Front-End & UX: Spearheaded 'Mobile First' redesign significantly improving UX and conversion rates.",
      "Back-End Optimization: Developed custom WordPress/WooCommerce features to streamline store management."
    ],
    technologies: ["WooCommerce", "Google Compute Engine", "Docker", "Bitnami", "WordPress"]
  },
  {
    id: '3',
    role: "Wordpress Contract Developer",
    company: "AAA Insurance",
    period: "01/2016 - 11/2016",
    description: "Contracted for critical updates and compliance.",
    details: [
      "Executed front-end and back-end updates to oregon.aaa.com, ensuring PCI compliance.",
      "Resolved critical AAA API errors for their WordPress site.",
      "Provided technical support and documentation to full-time developers."
    ],
    technologies: ["WordPress", "API Integration", "PCI Compliance"]
  },
  {
    id: '4',
    role: "Wordpress Developer",
    company: "SpringBoard Innovation",
    period: "01/2015 - 11/2015",
    description: "Developed custom crowdsourcing platform.",
    details: [
      "Developed a custom WordPress crowdsourcing platform compliant with Oregon community investment laws.",
      "Engineered site to manage performance for up to 1000 concurrent users.",
      "Implemented Git-based version control workflow."
    ],
    technologies: ["WordPress", "Git", "Performance Tuning"]
  },
  {
    id: '5',
    role: "Web Developer and Consultant",
    company: "Mambomedia (Clackamas Women's Services)",
    period: "01/2015 - 05/2015",
    description: "Security and infrastructure consulting.",
    details: [
      "Successfully installed Comodo's EV SSL for mambomedia.com.",
      "Converted WordPress instance and DB to HTTPS."
    ],
    technologies: ["SSL", "WordPress", "HTTPS"]
  },
  {
    id: '6',
    role: "E-commerce Developer and Web Design",
    company: "Etekdepot",
    period: "01/2014 - 05/2015",
    description: "Automation and multi-channel API integration.",
    details: [
      "Improved efficiency by developing Python and PHP scripts to automate product data transfer via Channel Advisor API.",
      "Managed listings across Ebay, Amazon, BigCommerce, and Newegg.",
      "Optimized product data for SEO."
    ],
    technologies: ["Python", "PHP", "Channel Advisor API", "SEO"]
  },
  {
    id: '7',
    role: "Project Manager and Developer",
    company: "Good360.org",
    period: "01/2012 - 05/2013",
    description: "Managed and developed philanthropic e-commerce platform.",
    details: [
      "Collaborated with a global team developing an online philanthropic platform.",
      "Maintained custom E-commerce platform as Magento Admin and Developer.",
      "Trained staff on Open Source technologies (Apache, MySQL)."
    ],
    technologies: ["Magento", "Apache", "MySQL"]
  },
  {
    id: '8',
    role: "Lead Developer + AWS",
    company: "Impersona",
    period: "01/2012 - 10/2016",
    description: "Infrastructure management and backend development.",
    details: [
      "Managed high-availability infrastructure on AWS.",
      "Implemented core back-end changes using Zend Framework 1.12.",
      "Drove client acquisition through targeted SEO and feature development."
    ],
    technologies: ["AWS", "Zend Framework", "SEO"]
  },
  {
    id: '9',
    role: "Devops and Full Stack Support Developer",
    company: "Northern Gulf Institute",
    period: "01/2011 - 12/2011",
    description: "Mission-critical server administration.",
    details: [
      "Administered and maintained Linux servers supporting mission-critical meteorology data services (THREDDS and RTOFS)."
    ],
    technologies: ["Linux", "DevOps"]
  }
];

export const EDUCATION_DATA: EducationItem[] = [
  {
    school: "University of Southern Mississippi",
    degree: "Computer Science",
    year: "12/2011"
  }
];

export const SKILLS_DATA: SkillCategory[] = [
  {
    category: "Languages & Core",
    items: ["Python", "PHP", "Go", "JavaScript (ES6+)", "TypeScript", "HTML5", "CSS3", "C", "C++", "Node.js"]
  },
  {
    category: "Cloud & DevOps",
    items: ["AWS", "Google Compute Engine", "Docker", "Linux/Unix", "Git", "CloudFlare WAF", "New Relic", "Capistrano", "Bitbucket Pipelines", "Site Reliability"]
  },
  {
    category: "E-commerce & CMS",
    items: ["BigCommerce", "WooCommerce", "Magento", "WordPress", "Channel Advisor"]
  },
  {
    category: "AI & Tools",
    items: ["GoogleGenAI", "Gemini API", "Comfy (Workflows)", "N8 (Automation)", "MySQL", "Redis", "Elasticsearch", "Apache", "Zend Framework"]
  }
];
