const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding ShadowIntern database...\n');

  // Clear existing data
  await prisma.standup.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.chaosEvent.deleteMany();
  await prisma.kPI.deleteMany();
  await prisma.user.deleteMany();

  // Create user
  const user = await prisma.user.create({
    data: {
      name: 'Shadow Intern',
      role: 'Shadow Intern',
      xp: 35,
      avatarUrl: '/avatar.png',
    },
  });
  console.log(`✅ Created user: ${user.name} (${user.id})`);

  // Create tickets
  const tickets = [
    { title: 'Fix login page CSS overflow', description: 'The login form overflows on mobile devices. Need to add responsive breakpoints and fix the container width.', status: 'DONE', priority: 'HIGH', xpReward: 20 },
    { title: 'Implement dark mode toggle', description: 'Add a toggle switch in the settings page that switches between light and dark themes using CSS variables.', status: 'DONE', priority: 'MEDIUM', xpReward: 15 },
    { title: 'Add input validation to signup form', description: 'Implement client-side validation for email format, password strength (min 8 chars, 1 uppercase, 1 number), and username uniqueness check.', status: 'IN_REVIEW', priority: 'HIGH', xpReward: 20 },
    { title: 'Optimize database queries for dashboard', description: 'The dashboard page is loading slowly. Profile the SQL queries and add appropriate indexes. Consider using materialized views.', status: 'IN_PROGRESS', priority: 'CRITICAL', xpReward: 25 },
    { title: 'Write unit tests for auth module', description: 'Create comprehensive unit tests for the authentication module including login, logout, token refresh, and password reset flows.', status: 'IN_PROGRESS', priority: 'HIGH', xpReward: 20 },
    { title: 'Design onboarding flow wireframes', description: 'Create wireframes for the new user onboarding experience. Include welcome screen, feature tour, and initial setup wizard.', status: 'TODO', priority: 'MEDIUM', xpReward: 15 },
    { title: 'Integrate Stripe payment processing', description: 'Set up Stripe SDK, create checkout session endpoint, handle webhooks for payment confirmation, and implement subscription management.', status: 'TODO', priority: 'CRITICAL', xpReward: 25 },
    { title: 'Add search functionality to tickets', description: 'Implement full-text search across ticket titles and descriptions. Add filters for status, priority, and assignee.', status: 'TODO', priority: 'MEDIUM', xpReward: 15 },
    { title: 'Fix memory leak in WebSocket handler', description: 'The real-time notification system has a memory leak. Connections are not being properly cleaned up on disconnect.', status: 'TODO', priority: 'CRITICAL', xpReward: 25 },
    { title: 'Update README with setup instructions', description: 'Add comprehensive setup instructions including environment variables, database migration steps, and local development guide.', status: 'DONE', priority: 'LOW', xpReward: 10 },
    { title: 'Implement rate limiting on API', description: 'Add rate limiting middleware to prevent API abuse. Use sliding window algorithm with configurable limits per endpoint.', status: 'IN_REVIEW', priority: 'HIGH', xpReward: 20 },
    { title: 'Create data export feature', description: 'Allow users to export their data in CSV and JSON formats. Include ticket history, standup records, and XP ledger.', status: 'TODO', priority: 'LOW', xpReward: 10 },
  ];

  for (const ticket of tickets) {
    await prisma.ticket.create({
      data: { ...ticket, assigneeId: user.id },
    });
  }
  console.log(`✅ Created ${tickets.length} tickets`);

  // Create 30 days of KPI data with realistic fluctuations
  const kpis = [];
  let revenue = 125000;
  let churn = 4.2;
  let uptime = 99.9;
  let bugsOpen = 23;

  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    // Random walk with trends
    revenue += (Math.random() - 0.4) * 5000;
    revenue = Math.max(80000, Math.min(200000, revenue));

    churn += (Math.random() - 0.55) * 0.3;
    churn = Math.max(1.0, Math.min(8.0, churn));

    uptime += (Math.random() - 0.3) * 0.2;
    uptime = Math.max(95.0, Math.min(100.0, uptime));

    bugsOpen += Math.floor((Math.random() - 0.45) * 4);
    bugsOpen = Math.max(5, Math.min(50, bugsOpen));

    kpis.push({
      timestamp: date,
      revenue: Math.round(revenue),
      churn: Math.round(churn * 100) / 100,
      uptime: Math.round(uptime * 100) / 100,
      bugsOpen: bugsOpen,
    });
  }

  for (const kpi of kpis) {
    await prisma.kPI.create({ data: kpi });
  }
  console.log(`✅ Created ${kpis.length} KPI data points`);

  // Create standups
  const standups = [
    {
      userId: user.id,
      yesterday: 'Fixed the login page CSS overflow issue. Tested on mobile and tablet breakpoints.',
      today: 'Starting work on the dark mode toggle feature. Setting up CSS variables.',
      blockers: '',
      createdAt: new Date(Date.now() - 4 * 86400000),
    },
    {
      userId: user.id,
      yesterday: 'Implemented dark mode toggle. CSS variables are working across all components.',
      today: 'Moving on to input validation for the signup form.',
      blockers: 'Need clarification on password requirements from the security team.',
      createdAt: new Date(Date.now() - 3 * 86400000),
    },
    {
      userId: user.id,
      yesterday: 'Completed signup form validation. Added email regex, password strength checker.',
      today: 'Starting database query optimization for the dashboard.',
      blockers: '',
      createdAt: new Date(Date.now() - 2 * 86400000),
    },
    {
      userId: user.id,
      yesterday: 'Profiled slow database queries. Found 3 missing indexes.',
      today: 'Adding indexes and testing query performance. Also writing auth unit tests.',
      blockers: 'Staging database is down, can only test locally.',
      createdAt: new Date(Date.now() - 1 * 86400000),
    },
    {
      userId: user.id,
      yesterday: 'Finished adding database indexes. Dashboard load time reduced by 60%.',
      today: 'Continuing unit tests for authentication module. Targeting 90% coverage.',
      blockers: '',
      createdAt: new Date(),
    },
  ];

  for (const standup of standups) {
    await prisma.standup.create({ data: standup });
  }
  console.log(`✅ Created ${standups.length} standups`);

  // Create chaos events
  const chaosEvents = [
    {
      type: 'CRUNCH_TIME',
      title: '🔥 Crunch Time Activated!',
      description: 'The deadline just moved up by 2 weeks. All tickets now award 2x XP!',
      xpModifier: 2.0,
      active: false,
      triggeredAt: new Date(Date.now() - 5 * 86400000),
    },
    {
      type: 'SERVER_FIRE',
      title: '🚨 Server Fire!',
      description: 'Production is down! All hands on deck. Bug tickets are now top priority.',
      xpModifier: 2.5,
      active: false,
      triggeredAt: new Date(Date.now() - 3 * 86400000),
    },
    {
      type: 'SURPRISE_DEMO',
      title: '🎤 Surprise Demo to the CEO!',
      description: 'The CEO wants to see a demo in 30 minutes. Complete your current ticket ASAP!',
      xpModifier: 1.75,
      active: false,
      triggeredAt: new Date(Date.now() - 1 * 86400000),
    },
  ];

  for (const event of chaosEvents) {
    await prisma.chaosEvent.create({ data: event });
  }
  console.log(`✅ Created ${chaosEvents.length} chaos events`);

  console.log('\n🎉 Seeding complete! ShadowIntern is ready.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
