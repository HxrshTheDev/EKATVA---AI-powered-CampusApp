const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ SUPABASE_URL or SUPABASE_ANON_KEY missing in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("🚀 Starting EKATVA Holistic Seeding...");

  // 1. Create Demo User
  const demoEmail = "demo@ekatva.campus";
  const { data: existingUser } = await supabase.from("users").select("id").eq("email", demoEmail).single();

  let demoUserId;
  if (!existingUser) {
    const { data: newUser, error: userError } = await supabase.from("users").insert([
      {
        first_name: "Arjun",
        last_name: "Sharma",
        email: demoEmail,
        password: "Demo@12345", // In a real app, this should be hashed
        college: "EKATVA Institute of Technology",
        course: "B.Tech Computer Science",
        year: 3,
        roll_number: "CS2024001",
        skills: ["React", "Node.js", "Python", "Cloud Computing"],
        interests: ["AI", "Blockchain", "Open Source"],
        xp: 2450,
        level: 5,
        streak: 12,
        gpa: 8.8,
        attendance: 92,
        role: "student"
      }
    ]).select().single();

    if (userError) {
      console.error("❌ Error creating demo user:", userError.message);
      return;
    }
    demoUserId = newUser.id;
    console.log("✅ Demo User Created:", demoUserId);
  } else {
    demoUserId = existingUser.id;
    console.log("ℹ️ Demo User exists:", demoUserId);
  }

  // 2. Create Digital Twin with Holistic Data (Stored in insights to avoid schema issues)
  const { error: dtError } = await supabase.from("digital_twins").upsert({
    user_id: demoUserId,
    personality: "Analytical & Ambitious",
    learning_style: "Visual & Hands-on",
    current_gpa: 8.8,
    attendance: { totalClasses: 100, attendedClasses: 92, attendancePercentage: 92, lastUpdated: new Date().toISOString() },
    study_hours: { currentWeek: 18.5, totalHours: 420, weeklyTarget: 20, history: [15, 22, 19, 21, 18] },
    assignments: { total: 12, completed: 10, pending: ["Advanced Algorithms", "Network Security Lab"] },
    academic_health: "Excellent",
    // We store the holistic data in insights since those columns aren't in the remote DB yet
    insights: [
      { type: "achievement", title: "AWS Certified Cloud Practitioner", issuer: "Amazon Web Services" },
      { type: "achievement", title: "React Advanced Patterns", issuer: "Frontend Masters" },
      { type: "participation", event: "AI & Ethics Workshop", date: "2024-03-15" },
      { type: "participation", event: "Open Source Day", date: "2024-02-10" },
      { type: "insight", text: "Peak focus at 10 AM" },
      { type: "insight", text: "Strongest in Technical subjects" }
    ]
  }, { onConflict: 'user_id' });
  if (dtError) console.error("❌ Error seeding digital twin:", dtError.message);
  else console.log("✅ Holistic Digital Twin Seeded (data packed into 'insights' field)");

  // 3. Create Community Posts
  const posts = [
    { content: "Just finished my AWS Certification! The Saarthi AI prep materials were a life saver. 🚀", author_id: demoUserId },
    { content: "Anyone up for a collaborative project on decentralized campus voting?", author_id: demoUserId },
    { content: "The new cafe in the East block finally has good coffee. Study sessions just got an upgrade! ☕", author_id: demoUserId }
  ];

  const { error: postError } = await supabase.from("posts").insert(posts);
  if (postError) {
    if (postError.message.includes("author_id")) {
      // Fallback for different column name if discovered
      await supabase.from("posts").insert(posts.map(p => ({ content: p.content, user_id: p.author_id })));
      console.log("✅ Posts Seeded (using user_id fallback)");
    } else {
      console.error("❌ Error seeding posts:", postError.message);
    }
  } else {
    console.log("✅ Posts Seeded");
  }

  // 5. Create Events
  const { data: eventData, error: eventError } = await supabase.from("events").insert([
    {
      title: "Tech Symposium 2024",
      description: "Annual campus technology showcase and keynote speech.",
      location: "Main Auditorium",
      start_date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      capacity: 500,
      organizer_id: demoUserId
    },
    {
      title: "AI & Ethics Workshop",
      description: "Discussion on the societal impacts of modern AI systems.",
      location: "Room 302, Block B",
      start_date: new Date(Date.now() - 86400000).toISOString(), // Yesterday (Past participation)
      capacity: 30,
      organizer_id: demoUserId
    }
  ]).select();

  if (eventError) console.error("❌ Error seeding events:", eventError.message);
  else {
    console.log("✅ Events Seeded");
    // Seed registration/participation
    await supabase.from("event_registrations").insert([
      { event_id: eventData[1].id, user_id: demoUserId, attended: true }
    ]);
    console.log("✅ Event Participations Seeded");
  }

  console.log("\n✨ Seeding Complete! EKATVA is now alive.");
}

seed();
