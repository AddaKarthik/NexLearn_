
const Groq = require('groq-sdk');

const SYSTEM_PROMPT = `You are NexLearn AI, a friendly and patient learning assistant inside the NexLearn online learning platform.

Help learners understand:
- Programming
- Computer Science
- Data Science
- Web Development
- Full Stack Development
- Study Planning
- Interview Preparation
- Academic Topics

Use clear, beginner-friendly language, practical examples, and short steps.

If a learner asks for code:
- Provide complete runnable code.
- Explain the code in simple words.
- Include filenames when relevant.
- Use proper code formatting.

If a learner asks for courses:
- Suggest relevant learning topics and technologies.
- Provide a structured learning roadmap.
- Do not claim that a course is available on NexLearn unless verified.

If a question is unrelated to learning, politely explain that you are designed primarily to help with learning.

Do not claim to see a learner's account, enrolled courses, payments, or private platform data.

Never ask for passwords, API keys, or payment details.`;

const MAX_USER_MESSAGE_LENGTH = 2000;
const MAX_HISTORY_MESSAGE_LENGTH = 8000;
const MAX_HISTORY_MESSAGES = 10;

exports.chat = async (req, res) => {
  try {
    const { messages } = req.body || {};

    // Validate messages array
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a message.'
      });
    }

    // Keep only the latest conversation messages
    const recentMessages = messages.slice(-MAX_HISTORY_MESSAGES);

    const safeMessages = recentMessages.map((item) => {
      if (
        !item ||
        !['user', 'assistant'].includes(item.role) ||
        typeof item.content !== 'string'
      ) {
        throw new Error('Invalid chat message format.');
      }

      const content = item.content.trim();

      if (!content) {
        throw new Error('Message cannot be empty.');
      }

      // User messages have a 2000-character limit
      if (
        item.role === 'user' &&
        content.length > MAX_USER_MESSAGE_LENGTH
      ) {
        throw new Error(
          'Your message must not exceed 2000 characters.'
        );
      }

      // Allow longer assistant responses, but limit their size
      return {
        role: item.role,
        content:
          content.length > MAX_HISTORY_MESSAGE_LENGTH
            ? content.slice(-MAX_HISTORY_MESSAGE_LENGTH)
            : content
      };
    });

    // Latest message must be from user
    if (safeMessages[safeMessages.length - 1].role !== 'user') {
      return res.status(400).json({
        success: false,
        message: 'The latest message must be from the user.'
      });
    }

    // Check Groq API configuration
    if (!process.env.GROQ_API_KEY) {
      return res.status(503).json({
        success: false,
        message: 'AI assistant is not configured. Please add GROQ_API_KEY to the server environment.'
      });
    }

    // Initialize Groq
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
      timeout: 30000
    });

    // Generate AI response
    const response = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',

      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT
        },
        ...safeMessages
      ],

      temperature: 0.7,
      max_tokens: 700
    });

    const reply =
      response.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      throw new Error('The AI service returned an empty response.');
    }

    // Successful response
    return res.status(200).json({
      success: true,
      reply
    });

  } catch (error) {
    const status = error.status || error.response?.status;

    console.error(
      '[Chatbot Error]:',
      error.error?.message || error.message
    );

    // Validation errors
    if (
      error.message.startsWith('Invalid') ||
      error.message.startsWith('Your message') ||
      error.message.startsWith('Message cannot')
    ) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    // Authentication errors
    if (status === 401 || status === 403) {
      return res.status(503).json({
        success: false,
        message: 'Groq API key is invalid or does not have permission. Check your server configuration.'
      });
    }

    // Rate limit or quota errors
    if (status === 429) {
      return res.status(429).json({
        success: false,
        message: 'AI usage limit reached. Please try again later.'
      });
    }

    // Model not found
    if (status === 404) {
      return res.status(502).json({
        success: false,
        message: 'The selected AI model is unavailable. Please check GROQ_MODEL in your server environment.'
      });
    }

    // Other errors
    return res.status(502).json({
      success: false,
      message: 'Sorry, I could not respond right now. Please try again.'
    });
  }
};
