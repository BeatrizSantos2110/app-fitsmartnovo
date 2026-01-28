import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { image, dietaryRestrictions } = await request.json();

    // Remove o prefixo data:image se existir
    const base64Image = image.replace(/^data:image\/\w+;base64,/, '');

    // Monta o prompt considerando as restrições alimentares
    const restrictionsText = dietaryRestrictions && dietaryRestrictions.length > 0
      ? `\nRestrições alimentares do usuário: ${dietaryRestrictions.join(', ')}`
      : '';

    const prompt = `Você é um nutricionista especializado em análise de alimentos. Analise esta imagem de alimento com MÁXIMA PRECISÃO e forneça as informações nutricionais DETALHADAS.

INSTRUÇÕES CRÍTICAS:
1. Identifique TODOS os alimentos visíveis no prato
2. Estime o tamanho da porção de cada alimento (em gramas ou ml)
3. Calcule as calorias TOTAIS somando TODOS os alimentos identificados
4. Calcule proteínas, carboidratos e gorduras de CADA alimento e some tudo
5. Seja PRECISO - use tabelas nutricionais reais como referência
6. Se houver molhos, óleos ou temperos visíveis, INCLUA nas calorias
7. Considere o método de preparo (frito, grelhado, cozido) no cálculo calórico
${restrictionsText}

EXEMPLO DE ANÁLISE CORRETA:
- Arroz branco (150g) = 195 cal, 4g proteína, 43g carbs, 0.5g gordura
- Frango grelhado (120g) = 198 cal, 36g proteína, 0g carbs, 4g gordura
- Feijão (100g) = 77 cal, 5g proteína, 14g carbs, 0.5g gordura
- Salada com azeite (80g) = 45 cal, 1g proteína, 3g carbs, 4g gordura
TOTAL: 515 calorias, 46g proteína, 60g carbs, 9g gordura

Responda APENAS com um JSON válido neste formato exato:
{
  "foodName": "nome descritivo do prato completo",
  "calories": número_inteiro_total,
  "protein": número_inteiro_total_em_gramas,
  "carbs": número_inteiro_total_em_gramas,
  "fats": número_inteiro_total_em_gramas,
  "ingredients": ["alimento1 (porção)", "alimento2 (porção)", "alimento3 (porção)"],
  "portionSize": "descrição detalhada da porção total estimada",
  "breakdown": [
    {
      "item": "nome do alimento",
      "portion": "quantidade estimada",
      "calories": número,
      "protein": número,
      "carbs": número,
      "fats": número
    }
  ]
}

IMPORTANTE: 
- Seja GENEROSO nas estimativas de calorias (melhor superestimar que subestimar)
- Considere ingredientes "escondidos" como óleo de cozinha, manteiga, açúcar
- Se não tiver certeza da porção, use porções médias padrão
- SEMPRE forneça números realistas baseados em tabelas nutricionais reais`;

    // Chama a API do OpenAI GPT-4 Vision
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt,
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                  detail: 'high', // Análise de alta qualidade para melhor precisão
                },
              },
            ],
          },
        ],
        max_tokens: 1000,
        temperature: 0.3, // Baixa temperatura para respostas mais precisas e consistentes
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`OpenAI API error: ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Parse o JSON da resposta
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Resposta da IA não contém JSON válido');
    }

    const nutritionData = JSON.parse(jsonMatch[0]);

    // Validação dos dados retornados
    if (!nutritionData.calories || !nutritionData.protein || !nutritionData.carbs || !nutritionData.fats) {
      throw new Error('Dados nutricionais incompletos na resposta da IA');
    }

    // Garante que os valores são números inteiros
    nutritionData.calories = Math.round(Number(nutritionData.calories));
    nutritionData.protein = Math.round(Number(nutritionData.protein));
    nutritionData.carbs = Math.round(Number(nutritionData.carbs));
    nutritionData.fats = Math.round(Number(nutritionData.fats));

    return NextResponse.json(nutritionData);
  } catch (error) {
    console.error('Erro ao analisar alimento:', error);
    return NextResponse.json(
      { 
        error: 'Erro ao analisar imagem',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
        details: 'Verifique se a variável OPENAI_API_KEY está configurada corretamente'
      },
      { status: 500 }
    );
  }
}
