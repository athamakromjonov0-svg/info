import {
  getProjectSnapshot,
  buildSystemPrompt,
  callUniversalAI,
  generateLocalAIResponse,
  generateAiImage,
} from '../services/geminiService.js';

// @desc    AI bilan jonli suhbat (Chat) + Rasm yaratish & tahlil
// @route   POST /api/ai/chat
export const chatWithAi = async (req, res) => {
  try {
    const { message, history = [], apiKey, model, userImage, generateImage } = req.body;

    if (!message && !userImage) {
      return res.status(400).json({ success: false, message: 'Xabar yoki rasm kiritilishi shart' });
    }

    const effectiveKey = apiKey || process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY;
    const textMsg = (message || '').trim();

    // 1. Foydalanuvchi rasm yaratishni so'raganmi tekshiramiz
    const isImageRequest = Boolean(generateImage) ||
      /(rasm|tasvir|surat)\s*(chiz|yarat|hosil|chiqar|qilib\s*ber|ko'rsat|qil)|(chizib\s*ber|yaratib\s*ber|generate\s*image|draw\s*a|create\s*image)/i.test(textMsg);

    if (isImageRequest) {
      try {
        const cleanPrompt = textMsg
          .replace(/(menga|iltimos|uchun|bitta|rasm|tasvir|surat|chizib\s*ber|yaratib\s*ber|chiz|yarat|qilib\s*ber)/gi, '')
          .trim() || textMsg;

        const imgResult = await generateAiImage(cleanPrompt, effectiveKey);

        return res.json({
          success: true,
          mode: 'image_generation',
          reply: `🎨 Siz so'ragan tasvir yaratildi:\n\n**"${imgResult.prompt}"**\n\nRasm quyida keltirildi. Uni to'liq hajmda ochish yoki yuklab olishingiz mumkin.`,
          generatedImage: imgResult.imageUrl,
          directUrl: imgResult.directUrl,
          model: 'Pollinations-FLUX',
          timestamp: new Date().toISOString(),
        });
      } catch (imgError) {
        console.warn('Rasm yaratishda xato:', imgError.message);
      }
    }

    // 2. Loyihaning aktual ma'lumotlarini bazadan yig'ish
    const snapshot = await getProjectSnapshot();
    const systemPrompt = buildSystemPrompt(snapshot);

    // Agar foydalanuvchi rasm yuklagan bo'lsa, xabarga rasm kontekstini qo'shamiz
    let promptWithContext = textMsg;
    if (userImage) {
      promptWithContext = `${textMsg ? textMsg + '\n\n' : ''}[Foydalanuvchi rasm yukladi: ${userImage}. Agar foydalanuvchi interyer yoki pardalar rasmini yuborgan bo'lsa, unga mos hashamatli shokilalar, tassellar va dekorativ aksessuarlarimizni tavsiya qil].`;
    }

    // 3. Agar API kalit mavjud bo'lsa (Groq yoki Gemini)
    if (effectiveKey) {
      try {
        const result = await callUniversalAI({
          prompt: promptWithContext,
          history,
          apiKey: effectiveKey,
          model,
          systemInstruction: systemPrompt,
        });

        return res.json({
          success: true,
          mode: 'cloud_ai',
          reply: result.text,
          model: result.model,
          provider: result.provider || 'AI',
          timestamp: new Date().toISOString(),
          stats: snapshot.stats,
        });
      } catch (aiError) {
        console.warn('AI API xatoligi:', aiError.message);
        const fallbackText = generateLocalAIResponse(textMsg, snapshot);
        return res.json({
          success: true,
          mode: 'smart_fallback',
          reply: fallbackText,
          model: 'Grand-AI',
          timestamp: new Date().toISOString(),
          stats: snapshot.stats,
        });
      }
    }

    // 4. Agar kalit berilmagan bo'lsa, lokal aqlli javob
    const localReply = generateLocalAIResponse(textMsg, snapshot);
    return res.json({
      success: true,
      mode: 'local_engine',
      reply: localReply,
      model: 'Grand-AI-Snapshot',
      timestamp: new Date().toISOString(),
      stats: snapshot.stats,
    });
  } catch (error) {
    console.error('Chat xatosi:', error);
    res.status(500).json({
      success: false,
      message: 'Serverda xatolik: ' + error.message,
    });
  }
};

// @desc    Alohida Rasm yaratish API
// @route   POST /api/ai/generate-image
export const generateImageController = async (req, res) => {
  try {
    const { prompt, apiKey } = req.body;
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ success: false, message: 'Rasm tavsifi (prompt) kiritilmadi' });
    }
    const effectiveKey = apiKey || process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY;
    const result = await generateAiImage(prompt.trim(), effectiveKey);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Rasm yaratishda xatolik: ' + err.message });
  }
};

// @desc    Butun loyihani tahlil qilish (Deep Project Analysis)
// @route   POST /api/ai/analyze
export const analyzeProject = async (req, res) => {
  try {
    const { apiKey, model } = req.body;
    const snapshot = await getProjectSnapshot();
    const effectiveKey = apiKey || process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY;

    const products = snapshot.products || [];
    const outOfStock = products.filter(p => Number(p.stock) === 0);
    const lowStock = products.filter(p => Number(p.stock) > 0 && Number(p.stock) < 5);
    const healthyStock = products.filter(p => Number(p.stock) >= 5);

    const categoryCounts = {};
    products.forEach(p => {
      const cat = p.category || 'Noma\'lum';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    const promptForAnalysis = `Sen e-commerce biznes tahlilchisisan.
Quyidagi "Grand Décor" do'konining haqiqiy holati asosida qisqa, tushunarli va kuchli tahliliy hisobot tayyorla:
- Jami tovarlar: ${snapshot.stats.totalProducts} ta
- Tugagan tovarlar (stock 0): ${outOfStock.length} ta
- Kam qolgan tovarlar (stock < 5): ${lowStock.length} ta
- Buyurtmalar: ${snapshot.stats.totalOrders} ta
- Jami daromad: ${new Intl.NumberFormat('uz-UZ').format(snapshot.stats.totalRevenue || 0)} so'm
- Kategoriyalar: ${JSON.stringify(categoryCounts)}
- Faol kuponlar: ${snapshot.coupons.map(c => c.code + ' (' + c.discount + '%)').join(', ') || 'mavjud emas'}

Iltimos, hisobotda quyidagi 4 qismni aniq ajratib ber (O'zbek tilida, chiroyli Markdown formatida):
1. 📈 **Sotuvlar va Moliyaviy Holat**
2. 📦 **Ombor va Inventarizatsiya Salomatligi**
3. ⚠️ **Zudlik Bilan E'tibor Qaratish Kerak Bo'lgan Joylar**
4. 💡 **Daromadni 2x Qilish Uchun 3 Ta Strategik Tavsiya**`;

    let aiReport = '';

    if (effectiveKey) {
      try {
        const result = await callUniversalAI({
          prompt: promptForAnalysis,
          apiKey: effectiveKey,
          model,
        });
        aiReport = result.text;
      } catch (err) {
        console.warn('AI tahlilida xatolik:', err.message);
      }
    }

    if (!aiReport) {
      aiReport = `### 📊 Grand Décor Loyihasi Bo'yicha Tahliliy Xulosa

1. 📈 **Sotuvlar va Moliyaviy Holat:**
   - Jami daromad: **${new Intl.NumberFormat('uz-UZ').format(snapshot.stats.totalRevenue || 0)} so'm**
   - Jami buyurtmalar: **${snapshot.stats.totalOrders} ta**

2. 📦 **Ombor Salomatligi:**
   - Jami mahsulotlar: **${snapshot.stats.totalProducts} ta**
   - Zaxirasi yetarli tovarlar: **${healthyStock.length} ta**
   - Kam qolgan tovarlar: **${lowStock.length} ta**

3. 💡 **Strategik Tavsiya:**
   - Yangi tovarlarni (jami ${snapshot.stats.newCount} ta yangi model) faol targ'ib qiling.`;
    }

    res.json({
      success: true,
      report: aiReport,
      metrics: {
        totalProducts: snapshot.stats.totalProducts,
        totalOrders: snapshot.stats.totalOrders,
        totalRevenue: snapshot.stats.totalRevenue,
        outOfStockCount: outOfStock.length,
        lowStockCount: lowStock.length,
        healthyStockCount: healthyStock.length,
      },
      snapshot,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Loyiha tahlilida xato:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    API kalitini sinovdan o'tkazish (Groq yoki Gemini)
// @route   POST /api/ai/test-key
export const testApiKey = async (req, res) => {
  try {
    const { apiKey, model } = req.body;
    const testKey = apiKey || process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY;

    if (!testKey) {
      return res.status(400).json({
        success: false,
        message: 'API kalit topilmadi. Kalitni maydonga kiriting.',
      });
    }

    const testPrompt = 'Salom! O\'zbekcha 3 so\'z bilan javob ber.';
    const result = await callUniversalAI({
      prompt: testPrompt,
      apiKey: testKey,
      model,
    });

    res.json({
      success: true,
      message: 'AI API muvaffaqiyatli ulandi va so\'rovga javob berdi!',
      reply: result.text,
      model: result.model,
      provider: result.provider || 'AI',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: `AI API xatosi: ${error.message}`,
    });
  }
};

// @desc    AI xizmati holatini tekshirish
// @route   GET /api/ai/status
export const getAiStatus = async (req, res) => {
  try {
    const hasGroq = Boolean(process.env.GROQ_API_KEY);
    const hasGemini = Boolean(process.env.GEMINI_API_KEY);
    const snapshot = await getProjectSnapshot();

    res.json({
      success: true,
      hasServerKey: hasGroq || hasGemini,
      provider: hasGroq ? 'Groq (openai/gpt-oss-120b)' : (hasGemini ? 'Google Gemini' : 'Local'),
      defaultModel: hasGroq ? 'openai/gpt-oss-120b' : 'gemini-2.5-flash',
      availableModels: [
        'openai/gpt-oss-120b',
        'openai/gpt-oss-20b',
        'qwen/qwen3.8-27b',
        'gemini-2.5-flash',
        'gemini-1.5-flash',
      ],
      dataset: {
        totalProducts: snapshot.stats?.totalProducts || 0,
        totalOrders: snapshot.stats?.totalOrders || 0,
        totalCategories: snapshot.stats?.totalCategories || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
