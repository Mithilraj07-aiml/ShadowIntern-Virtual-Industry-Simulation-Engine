import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;

const openai = apiKey ? new OpenAI({ apiKey }) : null;

export async function generateTicketFeedback(
  title: string,
  description: string
): Promise<string> {
  if (!openai) {
    return getMockFeedback(title);
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a senior engineer reviewing an intern\'s ticket. Provide constructive, encouraging feedback in 2-3 sentences. Be specific and helpful.',
        },
        {
          role: 'user',
          content: `Ticket: ${title}\nDescription: ${description}`,
        },
      ],
      max_tokens: 150,
    });
    return response.choices[0]?.message?.content || getMockFeedback(title);
  } catch {
    return getMockFeedback(title);
  }
}

export async function generateShadowAudit(
  stats: {
    xp: number;
    level: string;
    ticketsDone: number;
    standups: number;
    daysActive: number;
  }
): Promise<string> {
  if (!openai) {
    return getMockAudit(stats);
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are writing a dramatic, narrative performance review for a shadow intern at a tech company. Write in a cinematic, slightly humorous tone—like a movie narrator describing a hero\'s journey. Include specific stats. Keep it to 3-4 sentences.',
        },
        {
          role: 'user',
          content: `Stats: ${stats.xp} XP earned, Level: ${stats.level}, ${stats.ticketsDone} tickets completed, ${stats.standups} standups posted, ${stats.daysActive} days active.`,
        },
      ],
      max_tokens: 200,
    });
    return response.choices[0]?.message?.content || getMockAudit(stats);
  } catch {
    return getMockAudit(stats);
  }
}

function getMockFeedback(title: string): string {
  const feedbacks = [
    `Great work on "${title}"! The implementation approach is solid. Consider adding edge case handling for better robustness.`,
    `Nice progress on "${title}". The code structure is clean. One suggestion: add unit tests to verify the core logic.`,
    `Impressive work on "${title}"! The solution is elegant. For next time, consider documenting the trade-offs you evaluated.`,
    `"${title}" looks good! Strong problem decomposition. Think about how this might scale with 10x the current load.`,
    `Solid implementation of "${title}". The architecture choice is sound. Remember to handle error states gracefully.`,
  ];
  return feedbacks[Math.floor(Math.random() * feedbacks.length)];
}

function getMockAudit(stats: { xp: number; level: string; ticketsDone: number; standups: number; daysActive: number }): string {
  return `In the neon-lit corridors of ShadowCorp, a ${stats.level} intern emerged from the shadows—armed with ${stats.xp} XP and an unshakeable determination. Over ${stats.daysActive} days, they conquered ${stats.ticketsDone} tickets and filed ${stats.standups} standups that made senior engineers weep with pride. The board whispers their name in quarterly reviews. Legend status: imminent.`;
}
