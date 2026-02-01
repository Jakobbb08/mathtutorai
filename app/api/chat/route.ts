import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    // Get API configuration from environment variables
    const apiKey = process.env.OPENAI_API_KEY || '';
    const apiUrl = process.env.OPENAI_API_URL || 'https://api.openai.com/v1/chat/completions';
    const model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';

    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'API key not configured. Please set OPENAI_API_KEY in your .env.local file. You can also use compatible APIs like Groq, OpenRouter, or local models.',
        },
        { status: 500 }
      );
    }

    // Build the conversation history
    const messages = [
      {
        role: 'system',
        content: `You are an expert math tutor AI assistant. Your role is to help students understand and solve math problems.

Guidelines:
- Provide clear, step-by-step explanations
- Use LaTeX formatting for mathematical expressions (use $ for inline math and $$ for block equations)
- Break down complex problems into manageable steps
- Explain the reasoning behind each step
- Be patient and encouraging
- If a student makes a mistake, gently correct it and explain why
- Cover topics from basic arithmetic to advanced calculus and beyond
- Use examples when helpful
- Format equations clearly using LaTeX

Example formats:
- Inline: "The equation $x^2 + 5x + 6 = 0$ can be factored..."
- Block: "The quadratic formula is: $$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$"`,
      },
      ...history.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      {
        role: 'user',
        content: message,
      },
    ];

    // Call the AI API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      return NextResponse.json(
        { error: `API Error: ${errorData.error?.message || 'Unknown error'}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;

    return NextResponse.json({ response: assistantMessage });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request.' },
      { status: 500 }
    );
  }
}
