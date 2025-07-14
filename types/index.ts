// User interfaces
export interface User {
  _id: string;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  stats: UserStats;
}

export interface UserStats {
  totalMeetings: number;
  hoursRecorded: number;
  participants: number;
  transcriptions: number;
  changeFromLastMonth: {
    meetings: number;
    hours: number;
    participants: number;
    transcriptions: number;
  };
}

// Meeting interfaces
export interface Meeting {
  _id: string;
  userId: string;
  title: string;
  date: string | Date;
  duration: number;
  participants: string[];
  status: "completed" | "in-progress" | "scheduled" | "audioempty";
  transcriptionAvailable: boolean;
  audioUrl?: string;
  transcript?: Transcript;
  createdAt?: Date;
  updatedAt?: Date;
}

// Transcript interfaces
export interface Transcript {
  _id: string;
  meetingId: string;
  speakers: Speaker[];
  segments: TranscriptSegment[];
  summary?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Speaker {
  _id: string;
  name: string;
  color: string;
}

export interface TranscriptSegment {
  _id: string;
  speakerId: string;
  text: string;
  startTime: number;
  endTime: number;
  confidence?: number;
}

// AI Chat interfaces
export interface AiChatSummary {
  _id: string;
  meetingId: string;
  messages: ChatMessage[];
  summary?: MeetingSummary;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  _id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
}

export interface MeetingSummary {
  keyPoints: string[];
  actionItems: ActionItem[];
  decisions: string[];
  nextSteps: string[];
}

export interface ActionItem {
  task: string;
  assignee: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
}

// API Response interfaces
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form interfaces
export interface LoginForm {
  email: string;
  password: string;
}

export interface SignUpForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Component Props interfaces
export interface SidebarNavigationProps {
  user: User;
}

export interface MeetingCardProps {
  meeting: Meeting;
}

export interface MeetingStatsProps {
  stats: UserStats | null;
}

export interface AudioPlayerProps {
  audioUrl: string;
}

export interface TranscriptSegmentProps {
  segment: TranscriptSegment;
  speaker: Speaker;
}
