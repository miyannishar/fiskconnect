export type Role = "student" | "alumni" | "admin";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: Role;
  avatar_url: string | null;
  major: string | null;
  graduation_year: number | null;
  linkedin_url: string | null;
  current_title: string | null;
  current_company: string | null;
  industry: string | null;
  location: string | null;
  skills: string[] | null;
  bio: string | null;
  open_to_mentor: boolean;
  open_to_contact: boolean;
  onboarding_complete: boolean;
  created_at: string;
  updated_at: string;
}

/** LinkedIn-sourced alumni from the sourcing API (no Supabase/email). */
export interface SourcedAlumni {
  id: string;
  linkedinUrl: string;
  fullName: string;
  headline: string;
  currentCompany: string;
  currentTitle: string;
  location: string;
  skills: string[];
  aboutSnippet: string;
  photo: string;
  relevanceScore: number;
}

export type OpportunityType =
  | "internship"
  | "job"
  | "research"
  | "volunteer"
  | "project"
  | "other";

export interface Opportunity {
  id: string;
  author_id: string;
  title: string;
  description: string;
  type: OpportunityType;
  company: string | null;
  location: string | null;
  is_remote: boolean;
  link: string | null;
  tags: string[] | null;
  status: "open" | "closed";
  created_at: string;
}

export type AnnouncementAudience = "all" | "students" | "alumni" | "admin";

export interface Announcement {
  id: string;
  author_id: string;
  title: string;
  content: string;
  audience: AnnouncementAudience;
  pinned: boolean;
  created_at: string;
}

export interface Donation {
  id: string;
  donor_id: string;
  amount: number;
  purpose: string;
  message: string | null;
  is_anonymous: boolean;
  created_at: string;
}

export type EventType = "event" | "opportunity" | "survey" | "workshop" | "other";
export type EventStatus = "pending" | "approved" | "rejected";

export interface Event {
  id: string;
  organizer_id: string;
  title: string;
  description: string;
  event_type: EventType;
  date: string;
  location: string | null;
  is_virtual: boolean;
  virtual_link: string | null;
  max_attendees: number | null;
  status: EventStatus;
  admin_notes: string | null;
  created_at: string;
}

export type RsvpStatus = "going" | "interested" | "not_going";

export interface EventRsvp {
  id: string;
  event_id: string;
  user_id: string;
  status: RsvpStatus;
  created_at: string;
}

export interface ProfileWithAuthor extends Profile {
  opportunities?: Opportunity[];
  announcements?: Announcement[];
}

export interface OpportunityWithAuthor extends Opportunity {
  profiles?: Pick<Profile, "id" | "full_name" | "email"> | null;
}

export interface AnnouncementWithAuthor extends Announcement {
  profiles?: Pick<Profile, "id" | "full_name"> | null;
}

export interface EventWithOrganizer extends Event {
  profiles?: Pick<Profile, "id" | "full_name"> | null;
}
