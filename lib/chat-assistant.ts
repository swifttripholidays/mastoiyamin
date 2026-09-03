const DIRECT_HANDOFF = /\b(yamin|human|person|call|meeting|hire|budget|quote|friend|urgent|speak|talk)\b/i;

export function createConciergeReply(message: string, name: string) {
  const text = message.toLowerCase();
  if (DIRECT_HANDOFF.test(text)) {
    return {
      handoff: true,
      reply: `Thanks, ${name}. I’ve placed this conversation in Yamin’s private inbox and switched on human mode. He can reply here directly.`,
    };
  }
  if (/\b(project|portfolio|work|website|heritage|sagarm|swift trip)\b/.test(text)) {
    return {
      handoff: false,
      reply: 'Yamin’s selected work includes Heritage of Sindh, Sagarm and Swift Trip Holidays—spanning cultural technology, commerce and travel. Tell me which kind of project feels closest to your idea.',
    };
  }
  if (/\b(ai|artificial intelligence|automation|agent|chatbot|model)\b/.test(text)) {
    return {
      handoff: false,
      reply: 'Yamin works where AI meets useful product design: intelligent workflows, assistant experiences and practical automation. What outcome would you want the AI to create for your users?',
    };
  }
  if (/\b(full.?stack|developer|code|frontend|backend|app|software|tech stack)\b/.test(text)) {
    return {
      handoff: false,
      reply: 'He works across the full product stack—from interface systems and motion to APIs, data and deployment. Share the product, audience and deadline, and I’ll help shape a clear starting brief.',
    };
  }
  if (/\b(hello|hi|hey|salam|assalam)\b/.test(text)) {
    return {
      handoff: false,
      reply: `Welcome, ${name}. I’m the Mastoi AI concierge. I can answer quick questions about Yamin’s work, skills and availability—or bring Yamin into this chat. What are you building?`,
    };
  }
  if (/\b(available|collaborate|collaboration|job|opportunity|partnership)\b/.test(text)) {
    return {
      handoff: true,
      reply: 'That sounds like a conversation Yamin should see personally. I’ve moved this chat into human mode so he can continue with you here.',
    };
  }
  return {
    handoff: false,
    reply: 'I can help with Yamin’s AI work, full-stack development, ventures and collaboration process. Add a little more detail, or say “talk to Yamin” and I’ll hand this conversation to him.',
  };
}
