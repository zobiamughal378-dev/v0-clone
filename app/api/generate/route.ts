import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    
    const token = process.env.GITHUB_TOKEN;
    
    if (!token) {
      return NextResponse.json({ error: 'Token nahi mila' }, { status: 500 });
    }

    // GitHub Models API - REAL AI!
    const response = await fetch('https://models.inference.ai.azure.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a UI/UX designer. Create 3 different HTML landing page layouts based on the user's prompt.
            Return ONLY a JSON array with 3 objects. Each object must have:
            - title: A catchy title for the layout
            - description: Detailed description of the design
            - html: Complete HTML code for the layout (with Tailwind CSS classes)
            - color: A Tailwind bg color class (e.g., bg-blue-50)
            
            Example format:
            [
              {
                "title": "Modern SaaS Hero",
                "description": "Clean hero section with gradient background",
                "html": "<div class='p-8 bg-gradient-to-r from-blue-500 to-purple-600'><h1 class='text-4xl text-white'>Welcome</h1></div>",
                "color": "bg-blue-50"
              }
            ]`
          },
          {
            role: 'user',
            content: `Create 3 landing page layouts for: ${prompt}`
          }
        ],
        temperature: 0.8,
        max_tokens: 1000
      })
    });

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // JSON extract karo
    let layouts;
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      layouts = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch {
      layouts = [];
    }

    return NextResponse.json({ layouts });
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}