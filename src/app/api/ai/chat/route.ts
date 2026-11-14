import { NextResponse } from 'next/server';
import { generateIntelligentResponse, ChatMessage } from '@/lib/ai/intelligent-dialogue';
import { sendChatbotQuestionNotification, sendSystemErrorAlert } from '@/lib/email/dispatcher';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, systemPrompt, model = 'gpt-4o', apiKey: clientApiKey, isVoiceMode = false } = body;

    // Check for API key in client body, client headers, or server environment
    const headerKey = req.headers.get('x-openai-key');
    const envKey = process.env.OPENAI_API_KEY;
    const effectiveApiKey = (clientApiKey || headerKey || envKey || '').trim();

    let finalReply = '';
    let finalModel = 'zentrion-cognitive-engine-v2';
    let isLiveOpenAI = false;

    // If an effective OpenAI API key is supplied, attempt live OpenAI call
    if (effectiveApiKey && effectiveApiKey.startsWith('sk-')) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${effectiveApiKey}`,
          },
          body: JSON.stringify({
            model: model || 'gpt-4o',
            messages: [
              {
                role: 'system',
                content: systemPrompt || 'Te az zentrion.ai Agency hivatalos és intelligens asszisztense vagy. Segíts az ügyfeleknek felmérni az automatizációs lehetőségeket, adj részletes, strukturált, szakértő válaszokat magyar nyelven!'
              },
              ...(messages || [])
            ],
            temperature: 0.7,
            max_tokens: 800,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          finalReply = data.choices[0].message.content;
          finalModel = data.model;
          isLiveOpenAI = true;
        } else {
          const errText = await response.text();
          console.warn('OpenAI API returned non-200, falling back to zentrion dialogue engine:', errText);
        }
      } catch (openAiError) {
        console.warn('OpenAI fetch error, falling back:', openAiError);
      }
    }

    if (!finalReply) {
      finalReply = generateIntelligentResponse(messages as ChatMessage[], systemPrompt, Boolean(isVoiceMode));
    }

    // Extract last user message and notify zentrion-automation.ai@outlook.hu
    const lastUserMsg = messages && messages.length > 0 ? messages[messages.length - 1].content : '';
    if (lastUserMsg) {
      // Async dispatch without blocking HTTP response
      sendChatbotQuestionNotification({
        userQuestion: lastUserMsg,
        botReply: finalReply,
        conversationSnippet: messages.slice(-3).map((m: any) => `${m.role}: ${m.content}`).join('\n')
      }).catch(err => console.warn('Chatbot email notification warning:', err));
    }

    return NextResponse.json({
      reply: finalReply,
      model: finalModel,
      isLiveOpenAI,
      timestamp: new Date().toISOString()
    });

  } catch (error: unknown) {
    const err = error as Error;
    console.error('Chat route error:', err);

    // Alert system master email
    sendSystemErrorAlert({
      source: 'Chat API Route (/api/ai/chat)',
      message: err.message || 'Hiba csevegés feldolgozásakor',
      stack: err.stack
    }).catch(() => {});

    return NextResponse.json({ 
      error: err.message || 'Hiba a csevegés feldolgozásakor',
      reply: 'Elnézést kérek, pillanatnyi hálózati probléma merült fel. Kérlek ismételd meg a kérdésed!'
    }, { status: 500 });
  }
}
