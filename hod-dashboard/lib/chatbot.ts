// Chatbot utility functions for HOD Dashboard
// Ready to connect with backend/AI APIs using API keys

import { getFacultyByHOD } from "./faculty"
import { getSubjectsByHOD } from "./subjects"

export interface ChatMessage {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

export interface ChatbotResponse {
  success: boolean
  message: string
  data?: any
}

// Main chatbot response function ready for API integration
export async function fetchChatbotResponse(query: string, hodId: string): Promise<ChatbotResponse> {
  // TODO: Replace with actual AI API call using API key
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const lowerQuery = query.toLowerCase()

  const [facultyData, subjectData] = await Promise.all([getFacultyByHOD(hodId), getSubjectsByHOD(hodId)])

  // Advanced Natural Language Processing patterns
  const patterns = {
    greeting: /\b(hello|hi|hey|good morning|good afternoon|good evening)\b/i,
    faculty: /\b(faculty|teacher|professor|staff|instructor)\b/i,
    subject: /\b(subject|course|class|module)\b/i,
    attendance: /\b(attendance|present|absent|class record|teaching hours)\b/i,
    stats: /\b(stats|statistics|overview|dashboard|summary|report)\b/i,
    help: /\b(help|assist|support|guide|how)\b/i,
    search: /\b(find|search|look for|show me|tell me about)\b/i,
    count: /\b(how many|total|count|number of)\b/i,
    performance: /\b(performance|analytics|metrics|progress)\b/i,
    schedule: /\b(schedule|timetable|timing|when)\b/i,
    details: /\b(details|information|info|profile|complete|full)\b/i,
    credentials: /\b(password|login|credentials|access|email|id)\b/i,
    specific: /\b(show|tell|give|provide)\b/i,
  }

  // Smart greeting with time awareness
  if (patterns.greeting.test(lowerQuery)) {
    const hour = new Date().getHours()
    let timeGreeting = "Hello"
    if (hour < 12) timeGreeting = "Good morning"
    else if (hour < 17) timeGreeting = "Good afternoon"
    else timeGreeting = "Good evening"

    return {
      success: true,
      message: `${timeGreeting}! 🎓 I'm your intelligent HOD Dashboard assistant. I can help you with:\n\n🧑‍🏫 Faculty Management & Analytics\n📚 Subject Information & Assignments\n📊 Attendance Tracking & Reports\n📈 Performance Analytics\n🔍 Smart Search & Insights\n\nWhat would you like to explore today?`,
    }
  }

  // Advanced faculty queries with AI-like understanding
  if (patterns.faculty.test(lowerQuery)) {
    if (facultyData.length === 0) {
      return {
        success: true,
        message:
          "📋 No faculty members found in your department yet.\n\n💡 **Quick Actions:**\n• Click 'Create Faculty' to add your first faculty member\n• Import faculty data from existing systems\n• Set up faculty profiles with subjects and schedules\n\nWould you like me to guide you through adding faculty?",
      }
    }

    const facultyMatch = facultyData.find(
      (f) =>
        f.name.toLowerCase().includes(lowerQuery) ||
        f.facultyId.toLowerCase().includes(lowerQuery) ||
        lowerQuery.includes(f.name.toLowerCase().split(" ")[0]) ||
        lowerQuery.includes(f.name.toLowerCase().split(" ")[1]) ||
        f.email.toLowerCase().includes(lowerQuery),
    )

    if (
      facultyMatch &&
      (patterns.details.test(lowerQuery) || patterns.credentials.test(lowerQuery) || patterns.specific.test(lowerQuery))
    ) {
      return {
        success: true,
        message: `👨‍🏫 **Complete Faculty Profile:**\n\n🆔 **Personal Information:**\n• **Name:** ${facultyMatch.name}\n• **Faculty ID:** ${facultyMatch.facultyId}\n• **Email:** ${facultyMatch.email}\n• **Password:** ${facultyMatch.password}\n• **Joined Date:** ${facultyMatch.createdAt.toLocaleDateString()}\n\n📚 **Academic Details:**\n• **Assigned Subjects:** ${facultyMatch.assignedSubjects.length > 0 ? facultyMatch.assignedSubjects.join(", ") : "None assigned"}\n• **Total Subjects:** ${facultyMatch.assignedSubjects.length}\n\n🔐 **Login Credentials:**\n• **Username/Email:** ${facultyMatch.email}\n• **Password:** ${facultyMatch.password}\n• **Faculty ID:** ${facultyMatch.facultyId}\n\n📊 **Quick Actions:**\n• Click on their faculty card for detailed attendance analytics\n• View teaching performance and class records\n• Check subject-wise teaching statistics\n\n💡 **Security Note:** Keep login credentials secure and share only when necessary.`,
        data: facultyMatch,
      }
    }

    if (facultyMatch) {
      return {
        success: true,
        message: `👨‍🏫 **Faculty Found:**\n\n**Name:** ${facultyMatch.name}\n**ID:** ${facultyMatch.facultyId}\n**Email:** ${facultyMatch.email}\n**Password:** ${facultyMatch.password}\n**Subjects:** ${facultyMatch.assignedSubjects.length > 0 ? facultyMatch.assignedSubjects.join(", ") : "None assigned"}\n**Joined:** ${facultyMatch.createdAt.toLocaleDateString()}\n\n📊 Click on their faculty card to view detailed attendance records and teaching analytics!\n\n💬 **Ask for more:** Try "show complete details for ${facultyMatch.name}" for full profile information.`,
        data: facultyMatch,
      }
    }

    if (patterns.count.test(lowerQuery) || lowerQuery.includes("total") || lowerQuery.includes("all")) {
      const assignedFaculty = facultyData.filter((f) => f.assignedSubjects.length > 0)
      const unassignedFaculty = facultyData.filter((f) => f.assignedSubjects.length === 0)

      let facultyList = ""
      if (patterns.details.test(lowerQuery) || patterns.credentials.test(lowerQuery)) {
        facultyList = facultyData
          .map(
            (f) =>
              `• **${f.name}** (${f.facultyId})\n  📧 ${f.email} | 🔑 ${f.password}\n  📚 ${f.assignedSubjects.length} subjects: ${f.assignedSubjects.join(", ") || "None"}`,
          )
          .join("\n\n")
      } else {
        facultyList = facultyData
          .map((f) => `• ${f.name} (${f.facultyId}) - ${f.assignedSubjects.length} subjects`)
          .join("\n")
      }

      return {
        success: true,
        message: `👥 **Faculty Overview:**\n\n📊 **Statistics:**\n• **Total Faculty:** ${facultyData.length}\n• **With Assignments:** ${assignedFaculty.length}\n• **Unassigned:** ${unassignedFaculty.length}\n\n📋 **Faculty List:**\n${facultyList}\n\n💡 **Pro Tips:**\n• Click on any faculty card for detailed analytics\n• Ask "show complete details for [name]" for full credentials\n• Use "faculty credentials" to see all login information`,
        data: facultyData,
      }
    }

    if (patterns.credentials.test(lowerQuery) && (lowerQuery.includes("all") || lowerQuery.includes("everyone"))) {
      const credentialsList = facultyData
        .map(
          (f) =>
            `👤 **${f.name}**\n• ID: ${f.facultyId}\n• Email: ${f.email}\n• Password: ${f.password}\n• Subjects: ${f.assignedSubjects.join(", ") || "None"}`,
        )
        .join("\n\n")

      return {
        success: true,
        message: `🔐 **All Faculty Credentials:**\n\n${credentialsList}\n\n⚠️ **Security Reminder:** Keep this information confidential and secure. Share credentials only when necessary for official purposes.\n\n💡 **Quick Actions:**\n• Click on faculty cards for detailed analytics\n• Use individual names for specific faculty details`,
        data: facultyData,
      }
    }

    return {
      success: true,
      message:
        "🔍 **Faculty Search Help:**\n\nI can help you find faculty information. Try:\n• 'Show all faculty'\n• 'Faculty details for Dr. Smith'\n• 'Complete information for John'\n• 'Faculty credentials'\n• 'Show me faculty passwords'\n• 'How many faculty do we have?'\n• 'Who teaches Computer Science?'\n\n💡 **Pro Tip:** Click on any faculty card to see their complete teaching records!",
    }
  }

  // Advanced subject queries
  if (patterns.subject.test(lowerQuery)) {
    if (subjectData.length === 0) {
      return {
        success: true,
        message:
          "📚 No subjects found in your department yet.\n\n💡 **Quick Actions:**\n• Click 'Create Subject' to add your first subject\n• Set up semester-wise subject organization\n• Assign faculty to subjects\n\nWould you like me to guide you through adding subjects?",
      }
    }

    if (patterns.count.test(lowerQuery) || lowerQuery.includes("total") || lowerQuery.includes("all")) {
      const assignedSubjects = subjectData.filter((s) => s.facultyId)
      const unassignedSubjects = subjectData.filter((s) => !s.facultyId)
      const semesterWise = subjectData.reduce(
        (acc, s) => {
          acc[s.semester] = (acc[s.semester] || 0) + 1
          return acc
        },
        {} as Record<number, number>,
      )

      return {
        success: true,
        message: `📚 **Subject Overview:**\n\n📊 **Total Subjects:** ${subjectData.length}\n✅ **Assigned:** ${assignedSubjects.length}\n⚠️ **Unassigned:** ${unassignedSubjects.length}\n\n📋 **By Semester:**\n${Object.entries(
          semesterWise,
        )
          .map(([sem, count]) => `• Semester ${sem}: ${count} subjects`)
          .join("\n")}\n\n💡 Click on any subject card to view detailed analytics!`,
        data: subjectData,
      }
    }

    // Smart subject search
    const subjectMatch = subjectData.find(
      (s) =>
        s.code.toLowerCase().includes(lowerQuery) ||
        s.name.toLowerCase().includes(lowerQuery) ||
        lowerQuery.includes(s.code.toLowerCase()),
    )

    if (subjectMatch) {
      return {
        success: true,
        message: `📖 **Subject Details:**\n\n**Code:** ${subjectMatch.code}\n**Name:** ${subjectMatch.name}\n**Semester:** ${subjectMatch.semester}\n**Credits:** ${subjectMatch.credits}\n**Faculty:** ${subjectMatch.facultyName || "Not assigned"}\n**Created:** ${subjectMatch.createdAt.toLocaleDateString()}\n\n📊 Click on the subject card to view detailed analytics!`,
        data: subjectMatch,
      }
    }

    return {
      success: true,
      message:
        "🔍 **Subject Search Help:**\n\nI can help you find subject information. Try:\n• 'Show all subjects'\n• 'Details for CS101'\n• 'How many subjects in semester 3?'\n• 'Which subjects are unassigned?'\n\n💡 **Pro Tip:** Use the subject management tab to organize by semester!",
    }
  }

  // Advanced analytics and performance queries
  if (patterns.performance.test(lowerQuery) || patterns.stats.test(lowerQuery)) {
    const assignedFaculty = facultyData.filter((f) => f.assignedSubjects.length > 0)
    const assignedSubjects = subjectData.filter((s) => s.facultyId)

    return {
      success: true,
      message: `📈 **Department Analytics:**\n\n👥 **Faculty Metrics:**\n• Total Faculty: ${facultyData.length}\n• Active Faculty: ${assignedFaculty.length}\n• Utilization Rate: ${facultyData.length > 0 ? Math.round((assignedFaculty.length / facultyData.length) * 100) : 0}%\n\n📚 **Subject Metrics:**\n• Total Subjects: ${subjectData.length}\n• Assigned Subjects: ${assignedSubjects.length}\n• Assignment Rate: ${subjectData.length > 0 ? Math.round((assignedSubjects.length / subjectData.length) * 100) : 0}%\n\n💡 **Insights:**\n${assignedFaculty.length === 0 ? "• Consider assigning subjects to faculty members" : "• Faculty assignment is progressing well"}\n${assignedSubjects.length < subjectData.length ? "• Some subjects need faculty assignment" : "• All subjects have been assigned"}\n\n📊 Click on faculty cards to view detailed teaching analytics!`,
    }
  }

  // Smart help system
  if (patterns.help.test(lowerQuery)) {
    return {
      success: true,
      message: `🤖 **AI Assistant Capabilities:**\n\n🧠 **Smart Features:**\n• Natural language understanding\n• Real-time data analysis\n• Intelligent insights and recommendations\n• Context-aware responses\n\n📋 **What I can help with:**\n• Faculty management and analytics\n• Subject organization and assignments\n• Attendance tracking and reports\n• Performance metrics and insights\n• Quick actions and navigation\n\n💬 **Try asking:**\n• "Show me faculty performance"\n• "Which subjects need assignment?"\n• "How is our department doing?"\n• "Find faculty teaching Computer Science"\n\n🎯 **Pro Tips:**\n• Click on cards for detailed views\n• Use natural language - I understand context!\n• Ask for specific insights and recommendations`,
    }
  }

  // Advanced search capabilities
  if (patterns.search.test(lowerQuery)) {
    const searchResults = []

    // Search faculty with enhanced matching
    const facultyResults = facultyData.filter(
      (f) =>
        f.name.toLowerCase().includes(lowerQuery) ||
        f.email.toLowerCase().includes(lowerQuery) ||
        f.facultyId.toLowerCase().includes(lowerQuery) ||
        f.assignedSubjects.some((subject) => subject.toLowerCase().includes(lowerQuery)),
    )

    // Search subjects
    const subjectResults = subjectData.filter(
      (s) => s.name.toLowerCase().includes(lowerQuery) || s.code.toLowerCase().includes(lowerQuery),
    )

    if (facultyResults.length > 0 || subjectResults.length > 0) {
      let message = "🔍 **Search Results:**\n\n"

      if (facultyResults.length > 0) {
        message += `👥 **Faculty (${facultyResults.length}):**\n`
        if (patterns.credentials.test(lowerQuery) || patterns.details.test(lowerQuery)) {
          message += facultyResults
            .map(
              (f) =>
                `• **${f.name}** (${f.facultyId})\n  📧 ${f.email} | 🔑 ${f.password}\n  📚 ${f.assignedSubjects.join(", ") || "No subjects"}`,
            )
            .join("\n\n")
        } else {
          message += facultyResults
            .map((f) => `• ${f.name} (${f.facultyId}) - ${f.assignedSubjects.length} subjects`)
            .join("\n")
        }
        message += "\n\n"
      }

      if (subjectResults.length > 0) {
        message += `📚 **Subjects (${subjectResults.length}):**\n`
        message += subjectResults.map((s) => `• ${s.code}: ${s.name} - ${s.facultyName || "Unassigned"}`).join("\n")
      }

      message +=
        "\n\n💡 **Need more details?** Ask for 'complete details' or 'credentials' for specific faculty members."

      return {
        success: true,
        message,
        data: { faculty: facultyResults, subjects: subjectResults },
      }
    }

    return {
      success: true,
      message:
        "🔍 **No results found.**\n\nTry searching for:\n• Faculty names or IDs\n• Subject codes or names\n• Email addresses\n• 'Faculty credentials' for login info\n• 'Complete details for [name]'\n\n💡 **Tip:** Use partial names or codes for better results!",
    }
  }

  // Default intelligent response
  return {
    success: true,
    message: `🤖 **I'm here to help!**\n\nI didn't quite understand that, but I can assist you with:\n\n🧑‍🏫 **Faculty Management:**\n• View faculty details and analytics\n• Check teaching assignments\n• Track performance metrics\n\n📚 **Subject Organization:**\n• Browse subjects by semester\n• Check faculty assignments\n• View subject details\n\n📊 **Analytics & Insights:**\n• Department performance overview\n• Faculty utilization rates\n• Assignment statistics\n\n💬 **Try asking:**\n• "Show me all faculty"\n• "How many subjects do we have?"\n• "Department overview"\n• "Help me with faculty management"\n\n🎯 **Pro Tip:** I understand natural language, so feel free to ask questions conversationally!`,
  }
}

// Helper function to generate chat message
export function createChatMessage(content: string, isUser: boolean): ChatMessage {
  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    content,
    isUser,
    timestamp: new Date(),
  }
}

// Helper function to format timestamp
export function formatMessageTime(timestamp: Date): string {
  return timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}
