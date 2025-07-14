# MongoDB Atlas Shell Commands for MeetScribe Database

## 1. Connect to MongoDB Atlas
\`\`\`bash
mongosh "mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/meetscribe" --apiVersion 1
\`\`\`

## 2. Switch to meetscribe database
\`\`\`javascript
use meetscribe
\`\`\`

## 3. Insert Users Collection
\`\`\`javascript
db.users.insertMany([
  {
    name: "Alex Johnson",
    email: "alex@example.com",
    password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qK", // password123
    avatar: "/professional-man-glasses.png",
    stats: {
      totalMeetings: 24,
      hoursRecorded: 18.5,
      participants: 42,
      transcriptions: 18,
      changeFromLastMonth: {
        meetings: 3,
        hours: 2.5,
        participants: 8,
        transcriptions: 5
      }
    },
    createdAt: new Date("2024-01-15T10:00:00Z"),
    updatedAt: new Date("2024-05-20T14:30:00Z")
  },
  {
    name: "Sarah Lee",
    email: "sarah@example.com",
    password: "$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // securepass
    avatar: "/professional-woman-short-hair.png",
    stats: {
      totalMeetings: 31,
      hoursRecorded: 23.2,
      participants: 58,
      transcriptions: 27,
      changeFromLastMonth: {
        meetings: 2,
        hours: 1.8,
        participants: 4,
        transcriptions: 3
      }
    },
    createdAt: new Date("2024-01-20T09:00:00Z"),
    updatedAt: new Date("2024-05-19T16:45:00Z")
  }
])
\`\`\`

## 4. Get User IDs for Meeting References
\`\`\`javascript
const users = db.users.find().toArray()
const alexId = users.find(u => u.email === "alex@example.com")._id
const sarahId = users.find(u => u.email === "sarah@example.com")._id

print("Alex ID: " + alexId)
print("Sarah ID: " + sarahId)
\`\`\`

## 5. Insert Meetings Collection
\`\`\`javascript
// Create speaker IDs for transcript segments
const speaker1Id = new ObjectId()
const speaker2Id = new ObjectId()
const speaker3Id = new ObjectId()
const speaker4Id = new ObjectId()
const speaker5Id = new ObjectId()
const speaker6Id = new ObjectId()

db.meetings.insertMany([
  {
    userId: alexId,
    title: "Project Kickoff",
    date: new Date("2024-05-10T09:00:00Z"),
    duration: 60,
    participants: ["Emma", "David", "Priya"],
    status: "completed",
    transcriptionAvailable: true,
    audioUrl: "/audio/project-kickoff.mp3",
    transcript: {
      speakers: [
        { _id: speaker1Id, name: "Alex", color: "#4F46E5" },
        { _id: speaker2Id, name: "Emma", color: "#A855F7" },
        { _id: speaker3Id, name: "David", color: "#F59E0B" }
      ],
      segments: [
        {
          _id: new ObjectId(),
          speakerId: speaker1Id,
          text: "Welcome everyone to our project kickoff meeting. I'm excited to get started on this new initiative.",
          startTime: 0,
          endTime: 8
        },
        {
          _id: new ObjectId(),
          speakerId: speaker2Id,
          text: "Thanks Alex. I'm really excited to be working on this project. The frontend requirements look challenging but doable.",
          startTime: 8,
          endTime: 15
        },
        {
          _id: new ObjectId(),
          speakerId: speaker3Id,
          text: "Let me share the timeline and milestones we've outlined. We have three major phases over the next quarter.",
          startTime: 15,
          endTime: 25
        },
        {
          _id: new ObjectId(),
          speakerId: speaker1Id,
          text: "Perfect. David, can you walk us through the technical architecture you've proposed?",
          startTime: 25,
          endTime: 32
        },
        {
          _id: new ObjectId(),
          speakerId: speaker3Id,
          text: "Absolutely. We'll be using a microservices architecture with React on the frontend and Node.js APIs on the backend.",
          startTime: 32,
          endTime: 42
        }
      ]
    },
    createdAt: new Date("2024-05-10T09:00:00Z"),
    updatedAt: new Date("2024-05-10T10:00:00Z")
  },
  {
    userId: sarahId,
    title: "Marketing Strategy Review",
    date: new Date("2024-05-12T14:00:00Z"),
    duration: 45,
    participants: ["Sarah", "Tom", "Linda"],
    status: "completed",
    transcriptionAvailable: true,
    audioUrl: "/audio/marketing-strategy-review.mp3",
    transcript: {
      speakers: [
        { _id: speaker4Id, name: "Sarah", color: "#10B981" },
        { _id: speaker5Id, name: "Tom", color: "#3B82F6" },
        { _id: speaker6Id, name: "Linda", color: "#EF4444" }
      ],
      segments: [
        {
          _id: new ObjectId(),
          speakerId: speaker4Id,
          text: "Let's begin our quarterly marketing strategy review. Tom, can you start with the Q2 campaign results?",
          startTime: 0,
          endTime: 7
        },
        {
          _id: new ObjectId(),
          speakerId: speaker5Id,
          text: "Absolutely Sarah. I'm pleased to report that our Q2 campaign results exceeded our goals by 15%. We saw significant growth in engagement.",
          startTime: 7,
          endTime: 18
        },
        {
          _id: new ObjectId(),
          speakerId: speaker6Id,
          text: "That's fantastic! Our social media engagement doubled, and we gained 2,000 new followers across all platforms.",
          startTime: 18,
          endTime: 26
        },
        {
          _id: new ObjectId(),
          speakerId: speaker4Id,
          text: "Excellent work team. Linda, what's our budget allocation looking like for Q3?",
          startTime: 26,
          endTime: 32
        },
        {
          _id: new ObjectId(),
          speakerId: speaker6Id,
          text: "We have approval to increase our ad spend by 20% and focus more on influencer partnerships.",
          startTime: 32,
          endTime: 40
        }
      ]
    },
    createdAt: new Date("2024-05-12T14:00:00Z"),
    updatedAt: new Date("2024-05-12T14:45:00Z")
  },
  {
    userId: alexId,
    title: "Sprint Planning",
    date: new Date("2024-05-15T11:00:00Z"),
    duration: 90,
    participants: ["Emma", "David", "Jordan"],
    status: "completed",
    transcriptionAvailable: true,
    audioUrl: "/audio/sprint-planning.mp3",
    transcript: {
      speakers: [
        { _id: new ObjectId(), name: "Alex", color: "#4F46E5" },
        { _id: new ObjectId(), name: "Emma", color: "#A855F7" },
        { _id: new ObjectId(), name: "Jordan", color: "#10B981" }
      ],
      segments: [
        {
          _id: new ObjectId(),
          speakerId: new ObjectId(),
          text: "Welcome to our sprint planning session. Let's review what we accomplished last sprint.",
          startTime: 0,
          endTime: 6
        },
        {
          _id: new ObjectId(),
          speakerId: new ObjectId(),
          text: "We completed 8 out of 10 story points. The user authentication feature is now live.",
          startTime: 6,
          endTime: 13
        },
        {
          _id: new ObjectId(),
          speakerId: new ObjectId(),
          text: "Great progress! For this sprint, I think we should focus on the dashboard implementation.",
          startTime: 13,
          endTime: 20
        }
      ]
    },
    createdAt: new Date("2024-05-15T11:00:00Z"),
    updatedAt: new Date("2024-05-15T12:30:00Z")
  },
  {
    userId: alexId,
    title: "Client Review Meeting",
    date: new Date("2024-05-20T14:00:00Z"),
    duration: 45,
    participants: ["Client A", "Client B", "David"],
    status: "scheduled",
    transcriptionAvailable: false,
    createdAt: new Date("2024-05-18T10:00:00Z"),
    updatedAt: new Date("2024-05-18T10:00:00Z")
  },
  {
    userId: sarahId,
    title: "Team Retrospective",
    date: new Date("2024-05-22T16:00:00Z"),
    duration: 60,
    participants: ["Sarah", "Tom", "Linda", "Mike"],
    status: "scheduled",
    transcriptionAvailable: false,
    createdAt: new Date("2024-05-20T09:00:00Z"),
    updatedAt: new Date("2024-05-20T09:00:00Z")
  },
  {
    userId: alexId,
    title: "Product Demo",
    date: new Date("2024-05-08T10:00:00Z"),
    duration: 30,
    participants: ["Alex", "Emma", "Stakeholders"],
    status: "completed",
    transcriptionAvailable: true,
    audioUrl: "/audio/product-demo.mp3",
    createdAt: new Date("2024-05-08T10:00:00Z"),
    updatedAt: new Date("2024-05-08T10:30:00Z")
  }
])
\`\`\`

## 6. Get Meeting IDs for AI Chat Summaries
\`\`\`javascript
const meetings = db.meetings.find().toArray()
const projectKickoffMeeting = meetings.find(m => m.title === "Project Kickoff")
const marketingMeeting = meetings.find(m => m.title === "Marketing Strategy Review")
const sprintPlanningMeeting = meetings.find(m => m.title === "Sprint Planning")

print("Project Kickoff Meeting ID: " + projectKickoffMeeting._id)
print("Marketing Meeting ID: " + marketingMeeting._id)
print("Sprint Planning Meeting ID: " + sprintPlanningMeeting._id)
\`\`\`

## 7. Insert AI Chat Summaries Collection
\`\`\`javascript
db.aichatsummaries.insertMany([
  {
    meetingId: projectKickoffMeeting._id,
    summary: {
      title: "Project Kickoff Meeting",
      date: "May 10, 2024",
      duration: "60 minutes",
      participants: ["Alex", "Emma", "David", "Priya"],
      keyPoints: [
        "Project scope and objectives clearly defined",
        "Timeline set for 3-month delivery",
        "Emma assigned as frontend lead",
        "Microservices architecture approved",
        "Weekly check-ins scheduled for Fridays"
      ],
      actionItems: [
        {
          assignee: "David",
          task: "Send detailed requirements document to team",
          dueDate: "May 12, 2024"
        },
        {
          assignee: "Emma",
          task: "Create frontend component library mockups",
          dueDate: "May 15, 2024"
        },
        {
          assignee: "Alex",
          task: "Schedule stakeholder review meeting",
          dueDate: "May 13, 2024"
        }
      ],
      decisions: [
        "Proceed with current project scope",
        "Weekly check-ins scheduled for Fridays at 2 PM",
        "Emma to lead frontend development",
        "Use React and Node.js technology stack",
        "Implement microservices architecture"
      ]
    },
    aiChat: [
      { 
        sender: "user", 
        text: "Summarize the key decisions made in this meeting", 
        timestamp: new Date("2024-05-10T10:30:00Z") 
      },
      {
        sender: "ai",
        text: "The key decisions made were:\n1. Project scope approved as presented\n2. 3-month timeline confirmed\n3. Emma assigned as frontend lead\n4. Microservices architecture selected\n5. Weekly Friday check-ins established",
        timestamp: new Date("2024-05-10T10:30:05Z")
      },
      {
        sender: "user",
        text: "What are the next steps for the team?",
        timestamp: new Date("2024-05-10T10:32:00Z")
      },
      {
        sender: "ai",
        text: "Next steps include:\n- David will send requirements doc by May 12\n- Emma will create frontend mockups by May 15\n- Alex will schedule stakeholder review by May 13\n- Team will begin development phase next week",
        timestamp: new Date("2024-05-10T10:32:03Z")
      }
    ],
    createdAt: new Date("2024-05-10T10:35:00Z"),
    updatedAt: new Date("2024-05-10T10:35:00Z")
  },
  {
    meetingId: marketingMeeting._id,
    summary: {
      title: "Marketing Strategy Review",
      date: "May 12, 2024",
      duration: "45 minutes",
      participants: ["Sarah", "Tom", "Linda"],
      keyPoints: [
        "Q2 campaign exceeded goals by 15%",
        "Social media engagement doubled",
        "Gained 2,000 new followers across platforms",
        "Budget increase approved for Q3",
        "Focus shift to influencer partnerships"
      ],
      actionItems: [
        {
          assignee: "Tom",
          task: "Prepare detailed Q3 marketing plan",
          dueDate: "May 15, 2024"
        },
        {
          assignee: "Linda",
          task: "Research and contact potential influencers",
          dueDate: "May 18, 2024"
        },
        {
          assignee: "Sarah",
          task: "Present budget proposal to executive team",
          dueDate: "May 16, 2024"
        }
      ],
      decisions: [
        "Increase ad spend budget by 20% for Q3",
        "Focus on influencer outreach and partnerships",
        "Double content frequency on social media",
        "Allocate more resources to high-performing campaigns",
        "Implement new analytics tracking system"
      ]
    },
    aiChat: [
      { 
        sender: "user", 
        text: "What were the main action items discussed?", 
        timestamp: new Date("2024-05-12T15:00:00Z") 
      },
      { 
        sender: "ai", 
        text: "The main action items are:\n1. Tom to prepare Q3 marketing plan by May 15\n2. Linda to research influencers by May 18\n3. Sarah to present budget proposal by May 16", 
        timestamp: new Date("2024-05-12T15:00:03Z") 
      },
      {
        sender: "user",
        text: "How did our Q2 campaigns perform?",
        timestamp: new Date("2024-05-12T15:02:00Z")
      },
      {
        sender: "ai",
        text: "Q2 campaigns performed exceptionally well:\n- Exceeded goals by 15%\n- Social media engagement doubled\n- Gained 2,000 new followers\n- Strong ROI across all channels",
        timestamp: new Date("2024-05-12T15:02:04Z")
      }
    ],
    createdAt: new Date("2024-05-12T15:05:00Z"),
    updatedAt: new Date("2024-05-12T15:05:00Z")
  },
  {
    meetingId: sprintPlanningMeeting._id,
    summary: {
      title: "Sprint Planning Session",
      date: "May 15, 2024",
      duration: "90 minutes",
      participants: ["Alex", "Emma", "Jordan"],
      keyPoints: [
        "Previous sprint: 8/10 story points completed",
        "User authentication feature deployed successfully",
        "Dashboard implementation prioritized for current sprint",
        "Team velocity tracking improved",
        "Code review process streamlined"
      ],
      actionItems: [
        {
          assignee: "Emma",
          task: "Begin dashboard UI component development",
          dueDate: "May 17, 2024"
        },
        {
          assignee: "Jordan",
          task: "Set up dashboard API endpoints",
          dueDate: "May 18, 2024"
        },
        {
          assignee: "Alex",
          task: "Update project timeline and communicate to stakeholders",
          dueDate: "May 16, 2024"
        }
      ],
      decisions: [
        "Focus current sprint on dashboard implementation",
        "Maintain 2-week sprint cycles",
        "Implement daily standups at 9 AM",
        "Use story point estimation for all tasks",
        "Deploy to staging environment weekly"
      ]
    },
    aiChat: [
      {
        sender: "user",
        text: "What's our sprint goal for this iteration?",
        timestamp: new Date("2024-05-15T12:45:00Z")
      },
      {
        sender: "ai",
        text: "The sprint goal is to complete the dashboard implementation, including:\n- UI components (Emma)\n- API endpoints (Jordan)\n- Integration and testing\n- Deployment to staging environment",
        timestamp: new Date("2024-05-15T12:45:05Z")
      }
    ],
    createdAt: new Date("2024-05-15T12:50:00Z"),
    updatedAt: new Date("2024-05-15T12:50:00Z")
  }
])
\`\`\`

## 8. Create Database Indexes for Performance
\`\`\`javascript
// User indexes
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ createdAt: -1 })

// Meeting indexes
db.meetings.createIndex({ userId: 1 })
db.meetings.createIndex({ date: -1 })
db.meetings.createIndex({ status: 1 })
db.meetings.createIndex({ transcriptionAvailable: 1 })
db.meetings.createIndex({ title: "text", participants: "text" })

// AI Chat Summary indexes
db.aichatsummaries.createIndex({ meetingId: 1 }, { unique: true })
db.aichatsummaries.createIndex({ createdAt: -1 })
\`\`\`

## 9. Verify Data Insertion
\`\`\`javascript
// Check document counts
print("Users count: " + db.users.countDocuments())
print("Meetings count: " + db.meetings.countDocuments())
print("AI Chat Summaries count: " + db.aichatsummaries.countDocuments())

// View sample documents
print("\n=== Sample User ===")
printjson(db.users.findOne({ email: "alex@example.com" }, { password: 0 }))

print("\n=== Sample Meeting ===")
printjson(db.meetings.findOne({ title: "Project Kickoff" }))

print("\n=== Sample AI Chat Summary ===")
printjson(db.aichatsummaries.findOne())

// Test relationships
print("\n=== Testing Relationships ===")
const testUser = db.users.findOne({ email: "alex@example.com" })
const userMeetings = db.meetings.find({ userId: testUser._id }).count()
print("Alex's meetings count: " + userMeetings)
\`\`\`

## 10. Test Queries
\`\`\`javascript
// Test search functionality
print("\n=== Search Tests ===")
print("Meetings with 'Project' in title:")
db.meetings.find({ title: /Project/i }).forEach(m => print("- " + m.title))

print("\nMeetings with transcriptions:")
db.meetings.find({ transcriptionAvailable: true }).forEach(m => print("- " + m.title))

print("\nCompleted meetings:")
db.meetings.find({ status: "completed" }).forEach(m => print("- " + m.title))
\`\`\`

## Database Summary
- **Database Name**: `meetscribe`
- **Collections**: `users`, `meetings`, `aichatsummaries`
- **Total Users**: 2
- **Total Meetings**: 6
- **Total AI Summaries**: 3

## Demo Login Credentials
- **Email**: alex@example.com | **Password**: password123
- **Email**: sarah@example.com | **Password**: securepass

## Notes
- All passwords are pre-hashed with bcrypt
- ObjectIds are properly generated for relationships
- Indexes are created for optimal query performance
- Sample transcripts include realistic conversation data
- AI summaries contain detailed action items and decisions
