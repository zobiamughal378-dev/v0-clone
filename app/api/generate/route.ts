import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    
    const token = process.env.GITHUB_TOKEN;
    
    if (!token) {
      return NextResponse.json({ error: 'Token nahi mila' }, { status: 500 });
    }

    console.log("Token mil gaya:", token.substring(0, 10) + "...");
    
    // GitHub Models API - FREE!
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
            content: 'You are a UI designer. Create 3 different landing page layouts based on the prompt. Return ONLY a JSON array with objects having title and description fields. Example: [{"title": "Modern SaaS", "description": "Clean cloud platform design"}, {"title": "Bold Startup", "description": "Eye-catching hero section"}, {"title": "Minimal Portfolio", "description": "Simple grid layout"}]'
          },
          {
            role: 'user',
            content: `Create 3 landing pages for: ${prompt}`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const data = await response.json();
    console.log("API Response:", data);
    
    // AI response parse karo
    let layouts;
    try {
      const content = data.choices[0].message.content;
      // JSON extract karo
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        layouts = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback layouts
        layouts = [
          { title: `${prompt} - Modern`, description: 'Clean and minimalist design' },
          { title: `${prompt} - Bold`, description: 'Eye-catching and vibrant' },
          { title: `${prompt} - Professional`, description: 'Corporate and elegant' }
        ];
      }
    } catch (e) {
      console.log("Parse error, using fallback");
      layouts = [
        { title: `${prompt} - Modern`, description: 'Clean design with white space' },
        { title: `${prompt} - Bold`, description: 'Bold colors and typography' },
        { title: `${prompt} - Minimal`, description: 'Minimalist approach' }
      ];
    }

    return NextResponse.json({ layouts });
    
  } catch (error: any) {
    console.log("Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}