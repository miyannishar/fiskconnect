/**
 * Images for landing sections.
 * - Hero: uses /assets/images/Technology Network.webm (video) on the right.
 * - Other sections: Unsplash below. Replace with /public paths if you prefer local assets.
 * - "See it in action" card: set PORTAL_SCREENSHOT to your Fisk portal/dashboard screenshot.
 */
const unsplash = (id: string, w = 800) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&fit=crop`;

export const landingImages = {
  /** Opportunity: visibility, silos, integration */
  opportunity: [
    unsplash("1526374962-e0a485b6f6b9", 600), // connection/network
    unsplash("1522071820081-009f0129c71c", 600), // collaboration
    unsplash("1517245388647-4aeb108a465f", 600), // workflow/team
  ],
  /** One network: Students, Alumni, Administration */
  threeCorners: [
    unsplash("1523240795612-9a054b0db644", 600), // students
    unsplash("1573496359142-b8d87734a5a2", 600), // alumni/professional
    unsplash("1542744173-8e7e53415bb6", 600), // administration/meeting
  ],
  /** Impact: Soon, Next, Later */
  impact: [
    unsplash("1552664730-d307ca884978", 600), // mentorship
    unsplash("1559136555-9303baea8ebd", 600), // growth/success
    unsplash("1522071820081-009f0129c71c", 600), // community
  ],
} as const;

/** "See it in action" card: replace with your Fisk portal screenshot, e.g. /assets/images/portal-dashboard.jpg */
export const PORTAL_SCREENSHOT = "/assets/images/placeholder-dashboard.svg";
