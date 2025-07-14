// Database seeding script
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

// MongoDB connection
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://username:password@cluster0.mongodb.net/meetscribe?retryWrites=true&w=majority"

// Schemas (simplified for seeding)
const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    avatar: String,
    stats: {
      totalMeetings: { type: Number, default: 0 },
      hoursRecorded: { type: Number, default: 0 },
      participants: { type: Number, default: 0 },
      transcriptions: { type: Number, default: 0 },
      changeFromLastMonth: {
        meetings: { type: Number, default: 0 },
        hours: { type: Number, default: 0 },
        participants: { type: Number, default: 0 },
        transcriptions: { type: Number, default: 0 },
      },
    },
  },
  { timestamps: true },
)

const MeetingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: String,
    date: Date,
    duration: Number,
    participants: [String],
    status: String,
    transcriptionAvailable: Boolean,
    audioUrl: String,
    transcript: {
      speakers: [
        {
          name: String,
          color: String,
        },
      ],
      segments: [
        {
          speakerId: mongoose.Schema.Types.ObjectId,
          text: String,
          startTime: Number,
          endTime: Number,
        },
      ],
    },
  },
  { timestamps: true },
)

const AiChatSummarySchema = new mongoose.Schema(
  {
    meetingId: { type: mongoose.Schema.Types.ObjectId, ref: "Meeting" },
    summary: {
      title: String,
      date: String,
      duration: String,
      participants: [String],
      keyPoints: [String],
      actionItems: [
        {
          assignee: String,
          task: String,
          dueDate: String,
        },
      ],
      decisions: [String],
    },
    aiChat: [
      {
        sender: String,
        text: String,
        timestamp: Date,
      },
    ],
  },
  { timestamps: true },
)

const User = mongoose.model("User", UserSchema)
const Meeting = mongoose.model("Meeting", MeetingSchema)
const AiChatSummary = mongoose.model("AiChatSummary", AiChatSummarySchema)

async function seedDatabase() {
  try {
    console.log("🔌 Connecting to MongoDB...")
    await mongoose.connect(MONGODB_URI)
    console.log("✅ Connected to MongoDB")

    // Clear existing data
    console.log("🗑️ Clearing existing data...")
    await User.deleteMany({})
    await Meeting.deleteMany({})
    await AiChatSummary.deleteMany({})

    // Create users
    console.log("👥 Creating users...")
    const hashedPassword1 = await bcrypt.hash("password123", 12)
    const hashedPassword2 = await bcrypt.hash("securepass", 12)

    const users = await User.insertMany([
      {
        name: "Alex Johnson",
        email: "alex@example.com",
        password: hashedPassword1,
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
            transcriptions: 5,
          },
        },
      },
      {
        name: "Sarah Lee",
        email: "sarah@example.com",
        password: hashedPassword2,
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
            transcriptions: 3,
          },
        },
      },
    ])

    console.log(`✅ Created ${users.length} users`)

    // Create meetings
    console.log("📅 Creating meetings...")
    const meetings = await Meeting.insertMany([
      {
        userId: users[0]._id,
        title: "Project Kickoff",
        date: new Date("2024-05-10T09:00:00Z"),
        duration: 60,
        participants: ["Emma", "David", "Priya"],
        status: "completed",
        transcriptionAvailable: true,
        audioUrl: "/audio/project-kickoff.mp3",
        transcript: {
          speakers: [
            { name: "Alex", color: "#4F46E5" },
            { name: "Emma", color: "#A855F7" },
            { name: "David", color: "#F59E0B" },
          ],
          segments: [
            {
              speakerId: new mongoose.Types.ObjectId(),
              text: "Welcome everyone to our project kickoff",
              startTime: 0,
              endTime: 5,
            },
            {
              speakerId: new mongoose.Types.ObjectId(),
              text: "Excited to be working on this",
              startTime: 5,
              endTime: 10,
            },
            {
              speakerId: new mongoose.Types.ObjectId(),
              text: "Let me share the timeline",
              startTime: 12,
              endTime: 18,
            },
          ],
        },
      },
      {
        userId: users[1]._id,
        title: "Marketing Strategy Review",
        date: new Date("2024-05-12T14:00:00Z"),
        duration: 45,
        participants: ["Sarah", "Tom", "Linda"],
        status: "completed",
        transcriptionAvailable: true,
        audioUrl: "/audio/marketing-strategy-review.mp3",
        transcript: {
          speakers: [
            { name: "Sarah", color: "#10B981" },
            { name: "Tom", color: "#3B82F6" },
            { name: "Linda", color: "#EF4444" },
          ],
          segments: [
            {
              speakerId: new mongoose.Types.ObjectId(),
              text: "Let's begin the strategy review",
              startTime: 0,
              endTime: 4,
            },
            {
              speakerId: new mongoose.Types.ObjectId(),
              text: "Q2 campaign results exceeded goals",
              startTime: 4,
              endTime: 9,
            },
            {
              speakerId: new mongoose.Types.ObjectId(),
              text: "Social media engagement doubled",
              startTime: 10,
              endTime: 14,
            },
          ],
        },
      },
      {
        userId: users[0]._id,
        title: "Sprint Planning",
        date: new Date("2024-05-15T11:00:00Z"),
        duration: 90,
        participants: ["Emma", "David", "Jordan"],
        status: "completed",
        transcriptionAvailable: true,
        audioUrl: "/audio/sprint-planning.mp3",
      },
      {
        userId: users[0]._id,
        title: "Client Review",
        date: new Date("2024-05-20T14:00:00Z"),
        duration: 45,
        participants: ["Client A", "Client B", "David"],
        status: "scheduled",
        transcriptionAvailable: false,
      },
    ])

    console.log(`✅ Created ${meetings.length} meetings`)

    // Create AI chat summaries
    console.log("🤖 Creating AI chat summaries...")
    const aiChatSummaries = await AiChatSummary.insertMany([
      {
        meetingId: meetings[0]._id,
        summary: {
          title: "Project Kickoff Meeting",
          date: "May 10, 2024",
          duration: "60 minutes",
          participants: ["Alex", "Emma", "David", "Priya"],
          keyPoints: ["Project scope approved", "Timeline set for 3 months", "Emma leads frontend"],
          actionItems: [
            {
              assignee: "David",
              task: "Send requirements doc",
              dueDate: "May 12",
            },
          ],
          decisions: ["Proceed with current scope", "Weekly check-ins scheduled", "Emma to lead frontend development"],
        },
        aiChat: [
          { sender: "user", text: "Summarize the key decisions", timestamp: new Date("2024-05-10T10:30:00Z") },
          {
            sender: "ai",
            text: "1. Project scope approved\n2. 3 month timeline\n3. Emma leads frontend",
            timestamp: new Date("2024-05-10T10:30:05Z"),
          },
        ],
      },
      {
        meetingId: meetings[1]._id,
        summary: {
          title: "Marketing Strategy Review",
          date: "May 12, 2024",
          duration: "45 minutes",
          participants: ["Sarah", "Tom", "Linda"],
          keyPoints: ["Q2 goals exceeded", "High-performing social campaigns", "Budget reallocation discussed"],
          actionItems: [
            {
              assignee: "Tom",
              task: "Prepare Q3 plan",
              dueDate: "May 15",
            },
          ],
          decisions: ["Increase ad budget", "Focus on influencer outreach", "Double content frequency"],
        },
        aiChat: [
          { sender: "user", text: "What were the action items?", timestamp: new Date("2024-05-12T15:00:00Z") },
          { sender: "ai", text: "1. Tom to prepare Q3 plan by May 15", timestamp: new Date("2024-05-12T15:00:03Z") },
        ],
      },
    ])

    console.log(`✅ Created ${aiChatSummaries.length} AI chat summaries`)

    console.log("🎉 Database seeded successfully!")
    console.log("\n📊 Summary:")
    console.log(`   Users: ${users.length}`)
    console.log(`   Meetings: ${meetings.length}`)
    console.log(`   AI Chat Summaries: ${aiChatSummaries.length}`)

    console.log("\n🔑 Demo Login Credentials:")
    console.log("   Email: alex@example.com | Password: password123")
    console.log("   Email: sarah@example.com | Password: securepass")
  } catch (error) {
    console.error("❌ Error seeding database:", error)
  } finally {
    await mongoose.disconnect()
    console.log("🔌 Disconnected from MongoDB")
  }
}

// Run the seeding function
seedDatabase()
