import fs from 'fs';
import path from 'path';
import { isDbConnected } from '../config/db.js';
import { getDb } from '../utils/fallbackStore.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Order from '../models/Order.js';
import Coupon from '../models/Coupon.js';
import DeliveryZone from '../models/DeliveryZone.js';
import BlogPost from '../models/BlogPost.js';
import Review from '../models/Review.js';

// Standart modellar ro'yxati (eng yangisidan boshlab)
const CANDIDATE_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-pro',
];

/**
 * Loyiha bo'yicha to'liq ma'lumotlarni yig'adi (Real-time Snapshot)
 * MongoDB ulangan bo'lsa MongoDB'dan, aks holda db.json xotirasidan oladi.
 */
export const getProjectSnapshot = async () => {
  try {
    if (!isDbConnected()) {
      const data = getDb();
      const products = data.products || [];
      const categories = data.categories || [];
      const orders = data.orders || [];
      const coupons = data.coupons || [];
      const deliveryZones = data.deliveryZones || [];
      const blogPosts = data.blogPosts || [];
      const reviews = data.reviews || [];

      const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
      const lowStockProducts = products.filter(p => Number(p.stock) < 5);
      const discountedProducts = products.filter(p => Number(p.discount) > 0);
      const newProducts = products.filter(p => Boolean(p.isNew));

      return {
        store: {
          name: "Grand Décor",
          tagline: "Hashamatli Parda Aksessuarlari va Saroy Dekori",
          description: "O'zbekistondagi premium parda aksessuarlari (tassellar, shokilalar, magnitlar, frenjalar, podxvatlar) yetkazib beruvchisi.",
          phone: "+998 90 123 45 67",
          location: "Toshkent shahri, Chilonzor tumani",
          currency: "so'm (UZS)",
        },
        stats: {
          totalProducts: products.length,
          totalCategories: categories.length,
          totalOrders: orders.length,
          totalRevenue,
          lowStockCount: lowStockProducts.length,
          discountedCount: discountedProducts.length,
          newCount: newProducts.length,
          totalReviews: reviews.length,
        },
        products: products.map(p => ({
          id: p.id || p._id,
          title: p.title || p.name,
          category: typeof p.category === 'object' ? (p.category.name || '') : (p.category || ''),
          price: p.price,
          discount: p.discount || 0,
          stock: p.stock,
          rating: p.rating || 5,
          isNew: Boolean(p.isNew),
          featured: Boolean(p.featured),
          specs: p.specs || [],
        })),
        categories: categories.map(c => ({
          id: c.id || c._id,
          name: c.name || c.title,
          slug: c.slug || '',
        })),
        orders: orders.map(o => ({
          id: o.id || o._id,
          orderNumber: o.orderNumber || o.id,
          customerName: o.customer?.fullName || o.customerName || 'Mijoz',
          total: o.total,
          status: o.status,
          itemCount: (o.items || []).length,
          createdAt: o.createdAt,
        })),
        coupons: coupons.filter(c => c.active !== false).map(c => ({
          code: c.code,
          discount: c.discount,
          minSpend: c.minSpend,
        })),
        deliveryZones: deliveryZones.map(d => ({
          name: d.name,
          price: d.price,
          days: d.days,
          freeFrom: d.freeFrom,
        })),
        blogPosts: blogPosts.slice(0, 5).map(b => ({
          title: b.title,
          category: b.category,
        })),
      };
    }

    // MongoDB ulanish holatida
    const [
      products,
      categories,
      orders,
      coupons,
      deliveryZones,
      blogPosts,
      reviews,
    ] = await Promise.all([
      Product.find().lean(),
      Category.find().lean(),
      Order.find().lean(),
      Coupon.find({ active: { $ne: false } }).lean(),
      DeliveryZone.find().lean(),
      BlogPost.find().limit(5).lean(),
      Review.find().lean(),
    ]);

    const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const lowStockProducts = products.filter(p => Number(p.stock) < 5);
    const discountedProducts = products.filter(p => Number(p.discount) > 0);
    const newProducts = products.filter(p => Boolean(p.isNew));

    return {
      store: {
        name: "Grand Décor",
        tagline: "Hashamatli Parda Aksessuarlari va Saroy Dekori",
        description: "O'zbekistondagi premium parda aksessuarlari yetkazib beruvchisi.",
        phone: "+998 90 123 45 67",
        location: "Toshkent shahri",
        currency: "so'm (UZS)",
      },
      stats: {
        totalProducts: products.length,
        totalCategories: categories.length,
        totalOrders: orders.length,
        totalRevenue,
        lowStockCount: lowStockProducts.length,
        discountedCount: discountedProducts.length,
        newCount: newProducts.length,
        totalReviews: reviews.length,
      },
      products: products.map(p => ({
        id: p.id || p._id,
        title: p.title || p.name,
        category: p.category,
        price: p.price,
        discount: p.discount || 0,
        stock: p.stock,
        rating: p.rating || 5,
        isNew: Boolean(p.isNew),
        specs: p.specs || [],
      })),
      categories: categories.map(c => ({
        id: c.id || c._id,
        name: c.name || c.title,
      })),
      orders: orders.map(o => ({
        id: o.id || o._id,
        orderNumber: o.orderNumber || o.id,
        customerName: o.customer?.fullName || o.customerName || 'Mijoz',
        total: o.total,
        status: o.status,
        itemCount: (o.items || []).length,
        createdAt: o.createdAt,
      })),
      coupons: coupons.map(c => ({
        code: c.code,
        discount: c.discount,
        minSpend: c.minSpend,
      })),
      deliveryZones: deliveryZones.map(d => ({
        name: d.name,
        price: d.price,
        days: d.days,
        freeFrom: d.freeFrom,
      })),
      blogPosts: blogPosts.map(b => ({
        title: b.title,
        category: b.category,
      })),
    };
  } catch (error) {
    console.error('Snapshot yig\'ishda xatolik:', error.message);
    return {
      store: { name: 'Grand Décor' },
      stats: {},
      products: [],
      categories: [],
      orders: [],
      coupons: [],
      deliveryZones: [],
    };
  }
};

/**
 * Tizim uchun ixcham kontekst (System Instructions) yaratadi
 * Tokenlarni tejash va Rate Limitga tushmaslik uchun ixcham va kuchli qilib tuzilgan.
 */
export const buildSystemPrompt = (snapshot) => {
  const topProducts = (snapshot.products || []).slice(0, 10).map(p =>
    `${p.title} (${p.price} so'm)`
  ).join(', ');

  return `Sen universal va o'ta aqlli Sun'iy Intellektsan (Grand AI).
1. Har qanday savolga (dasturlash, fan, matematika, hayot, biznes, tarjima va h.k.) erkin, to'liq va professional darajada javob ber. Hech qachon o'zingni cheklama!
2. Shuningdek, sen ushbu "Grand Décor" hashamatli parda aksessuarlari do'koni bazasini to'liq ko'rib turibsan:
- Jami: ${snapshot.stats?.totalProducts || 115} ta tovar, ${snapshot.stats?.totalCategories || 8} ta kategoriya, ${snapshot.stats?.totalOrders || 0} ta buyurtma, tushum: ${new Intl.NumberFormat('uz-UZ').format(snapshot.stats?.totalRevenue || 0)} so'm.
- Holat: ${snapshot.stats?.lowStockCount || 0} ta kam qolgan, ${snapshot.stats?.discountedCount || 35} ta chegirmali, ${snapshot.stats?.newCount || 47} ta yangi kelgan tovar.
- Mashhur tovarlar namunasi: ${topProducts}.
- Kuponlar: WELCOME10 (10%), SUMMER20 (20%), NEWYEAR30 (30%).
- Yetkazib berish: Toshkent (20,000 so'm, 1M dan bepul), Viloyatlar (25,000 - 40,000 so'm).
3. Do'kon yoki tovarlar haqida so'ralsa shu ma'lumotlar bilan, boshqa har qanday mavzuda so'ralsa erkin umumiy biliming bilan javob ber. Chiroyli Markdown formatidan foydalan.`;
};

const GROQ_CANDIDATE_MODELS = [
  'openai/gpt-oss-120b',
  'openai/gpt-oss-20b',
  'qwen/qwen3.8-27b',
  'allam-2-7b',
];

/**
 * Groq API (Llama, GPT-OSS 120B va h.k.) orqali chaqirish
 */
export const callGroqApi = async ({
  prompt,
  history = [],
  apiKey,
  model = 'openai/gpt-oss-120b',
  systemInstruction = null,
}) => {
  const effectiveKey = apiKey || process.env.GROQ_API_KEY;

  if (!effectiveKey) {
    throw new Error('GROQ_API_KEY topilmadi.');
  }

  const modelsToTry = [
    model,
    ...GROQ_CANDIDATE_MODELS.filter(m => m !== model),
  ];

  let lastError = null;

  for (const currentModel of modelsToTry) {
    try {
      const messages = [];

      if (systemInstruction) {
        messages.push({
          role: 'system',
          content: systemInstruction,
        });
      }

      // Token limitga tushmaslik uchun faqat oxirgi 2-3 xabarni olamiz
      if (Array.isArray(history) && history.length > 0) {
        for (const item of history.slice(-4)) {
          messages.push({
            role: item.role === 'assistant' || item.role === 'model' ? 'assistant' : 'user',
            content: String(item.content || item.text || '').slice(0, 500),
          });
        }
      }

      messages.push({
        role: 'user',
        content: prompt,
      });

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${effectiveKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: currentModel,
          messages,
          temperature: 0.7,
          max_tokens: 1500,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        const errorMsg = responseData?.error?.message || `HTTP ${response.status}`;
        // Agar 404 bo'lsa
        if (response.status === 404 || errorMsg.includes('does not exist')) {
          lastError = new Error(`Groq modeli (${currentModel}) topilmadi: ${errorMsg}`);
          continue;
        }
        // Agar 429 Rate Limit bo'lsa — biroz kutib keyingi modelni sinaymiz
        if (response.status === 429 || errorMsg.includes('Rate limit')) {
          lastError = new Error(`Rate limit: ${errorMsg}`);
          await new Promise(r => setTimeout(r, 600));
          continue;
        }
        throw new Error(`Groq API xatosi: ${errorMsg}`);
      }

      const text = responseData?.choices?.[0]?.message?.content || '';
      if (!text) throw new Error('Groq tomonidan bo\'sh javob qaytdi');

      return {
        text,
        model: currentModel,
        provider: 'Groq',
      };
    } catch (err) {
      lastError = err;
      if (err.message && (err.message.includes('topilmadi') || err.message.includes('Rate limit'))) {
        continue;
      }
      throw err;
    }
  }

  throw lastError || new Error('Barcha Groq modellari so\'rovni bajara olmadi.');
};

/**
 * Universal AI chaqiruvchisi (Groq yoki Gemini)
 */
export const callUniversalAI = async ({
  prompt,
  history = [],
  apiKey,
  model,
  systemInstruction,
}) => {
  const userKey = (apiKey || '').trim();
  const serverGroqKey = process.env.GROQ_API_KEY;
  const serverGeminiKey = process.env.GEMINI_API_KEY;

  // Agar foydalanuvchi gsk_ yoki serverda GROQ kaliti bo'lsa Groq ishlatiladi
  if (userKey.startsWith('gsk_') || (!userKey && serverGroqKey)) {
    return await callGroqApi({
      prompt,
      history,
      apiKey: userKey || serverGroqKey,
      model: model && !model.startsWith('gemini') ? model : 'openai/gpt-oss-120b',
      systemInstruction,
    });
  }

  // Aks holda Gemini
  const geminiKey = userKey || serverGeminiKey;
  if (geminiKey) {
    return await callGoogleGeminiApi({
      prompt,
      history,
      apiKey: geminiKey,
      model: model && model.startsWith('gemini') ? model : 'gemini-2.5-flash',
      systemInstruction,
    });
  }

  throw new Error('Hech qanday AI API kaliti (Groq yoki Gemini) topilmadi.');
};

/**
 * Google Generative Language API ga bevosita so'rov yuborish
 * Foydalanuvchi taqdim etgan curl spetsifikatsiyasi bo'yicha:
 * POST https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent
 * -H "x-goog-api-key: $GEMINI_API_KEY"
 * -H 'Content-Type: application/json'
 */
export const callGoogleGeminiApi = async ({
  prompt,
  history = [],
  apiKey,
  model = 'gemini-2.5-flash',
  systemInstruction = null,
}) => {
  const effectiveKey = apiKey || process.env.GEMINI_API_KEY;

  if (!effectiveKey) {
    throw new Error('GEMINI_API_KEY topilmadi. Iltimos, Gemini API kalitini kiriting yoki backend/.env fayliga qo\'shing.');
  }

  // Modellarni ketma-ket sinab ko'rish (agar model 404 bersa)
  const modelsToTry = [
    model,
    ...CANDIDATE_MODELS.filter(m => m !== model),
  ];

  let lastError = null;

  for (const currentModel of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent`;

      // Tarix va yangi xabarni yig'ish
      const contents = [];

      // Agar oldingi suhbatlar bo'lsa
      if (Array.isArray(history) && history.length > 0) {
        for (const item of history.slice(-6)) {
          contents.push({
            role: item.role === 'assistant' || item.role === 'model' ? 'model' : 'user',
            parts: [{ text: String(item.content || item.text || '') }],
          });
        }
      }

      // Hozirgi so'rov
      contents.push({
        role: 'user',
        parts: [{ text: prompt }],
      });

      const requestBody = {
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2500,
        },
      };

      if (systemInstruction) {
        requestBody.systemInstruction = {
          parts: [{ text: systemInstruction }],
        };
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': effectiveKey,
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();

      if (!response.ok) {
        const errorMsg = responseData?.error?.message || `HTTP ${response.status}`;
        // Agar model topilmasa (404), keyingi modelni sinab ko'ramiz
        if (response.status === 404 || errorMsg.includes('not found')) {
          lastError = new Error(`Model ${currentModel} topilmadi: ${errorMsg}`);
          continue;
        }
        throw new Error(`Google Gemini xatosi: ${errorMsg}`);
      }

      const candidate = responseData?.candidates?.[0];
      const text = candidate?.content?.parts?.map(p => p.text).join('') || '';

      if (!text) {
        throw new Error('Gemini tomonidan bo\'sh javob qaytdi');
      }

      return {
        text,
        model: currentModel,
        usage: responseData?.usageMetadata || null,
      };
    } catch (err) {
      lastError = err;
      if (err.message && err.message.includes('404')) {
        continue;
      }
      throw err;
    }
  }

  throw lastError || new Error('Barcha Gemini modellari so\'rovni bajara olmadi.');
};

/**
 * Zaxira AI Mantiqi (API kalit kiritilmagan yoki internet bo'lmagan holatda
 * loyiha ma'lumotlariga qarab avtomatik professional javob beradi)
 */
export const generateLocalAIResponse = (userMessage, snapshot) => {
  const msg = (userMessage || '').toLowerCase();
  const products = snapshot.products || [];
  const stats = snapshot.stats || [];

  if (msg.includes('analiz') || msg.includes('tahlil') || msg.includes('statistika') || msg.includes('holat')) {
    return `📊 **Grand Décor Loyihasi Bo'yicha Bosh Tahlil:**

• **Jami tovarlar soni:** ${snapshot.stats.totalProducts} ta
• **Buyurtmalar soni:** ${snapshot.stats.totalOrders} ta
• **Umumiy tushum:** ${new Intl.NumberFormat('uz-UZ').format(snapshot.stats.totalRevenue || 0)} so'm
• **Omborda kam qolgan tovarlar:** ${snapshot.stats.lowStockCount} ta (zudlik bilan to'ldirish tavsiya etiladi)
• **Chegirmadagi tovarlar:** ${snapshot.stats.discountedCount} ta

💡 **AI Maslahati:** Do'konda faollikni oshirish uchun yangi mavsumiy chegirmalar va yangi shokilalarni e'lon qilish tavsiya qilinadi!`;
  }

  if (msg.includes('yangi') || msg.includes('new')) {
    const newItems = products.filter(p => p.isNew).slice(0, 4);
    if (newItems.length > 0) {
      return `✨ **Yangi kelgan mahsulotlar:**\n\n` +
        newItems.map(p => `• **${p.title}** — ${new Intl.NumberFormat('uz-UZ').format(p.price)} so'm (Kategoriya: ${p.category})`).join('\n') +
        `\n\nBarcha yangi tovarlarni ko'rish uchun sayt menyusidan "Yangi kelganlar" sahifasiga o'tishingiz mumkin!`;
    }
  }

  if (msg.includes('arzon') || msg.includes('narx') || msg.includes('chegirma')) {
    const discounted = products.filter(p => p.discount > 0).slice(0, 4);
    return `🏷️ **Ajoyib chegirmali tovarlar:**\n\n` +
      discounted.map(p => `• **${p.title}** — ${new Intl.NumberFormat('uz-UZ').format(p.price)} so'm (${p.discount}% chegirma mavjud!)`).join('\n') +
      `\n\nShuningdek, buyurtma berishda **WELCOME10** kupon kodini ishlatib 10% chegirmaga ega bo'lishingiz mumkin!`;
  }

  if (msg.includes('yetkazib') || msg.includes('dostavka') || msg.includes('viloyat')) {
    return `🚚 **Yetkazib berish xizmati:**\n\n` +
      (snapshot.deliveryZones || []).slice(0, 5).map(z => `• **${z.name}**: ${new Intl.NumberFormat('uz-UZ').format(z.price)} so'm (${z.days})`).join('\n') +
      `\n\n1 000 000 so'mdan ortiq xaridlarda Toshkent bo'yicha yetkazib berish butunlay bepul!`;
  }

  if (msg.includes('salom') || msg.includes('assalom') || msg.includes('qalaysan') || msg.includes('kim')) {
    return `Assalomu alaykum! Men **Grand AI** intellektual yordamchisiman.

Sizga ham ushbu loyiha bo'yicha (tovarlar, tahlillar, narxlar, ombor), ham dasturlash, fan yoki boshqa umumiy mavzulardagi barcha savollaringizga yordam bera olaman.

Qanday savolingiz bor?`;
  }

  // Umumiy yoki noma'lum savollar uchun
  return `Savolingiz qabul qilindi: "${userMessage}".

💡 **Maslahat:** Do'kon tahlili, tovarlar, ombor holati yoki buyurtmalar haqida so'rashingiz mumkin (masalan: *"Loyiha holatini tahlil qil"*). 
Google Gemini neyrotarmog'i orqali har qanday mavzuda (dasturlash, fan, tarjima va h.k.) chuqur jonli javoblar olish uchun esa yuqoridagi **"API Kalit"** tugmasi orqali o'z Gemini API kalitingizni kiriting!`;
};

/**
 * Sun'iy Intellekt orqali rasm yaratish (Pollinations AI + FLUX)
 * Prompt o'zbekchada bo'lsa, avval uni yuqori sifatli inglizcha promptga aylantiradi.
 */
export const generateAiImage = async (userPrompt, apiKey = null) => {
  try {
    let englishPrompt = userPrompt;

    // 1. Promptni chiroyli inglizcha art/photorealistic promptga o'girish
    try {
      const translationRes = await callUniversalAI({
        prompt: `Convert this image generation request into a detailed, photorealistic 1-sentence English prompt for AI image generation (only output the prompt, nothing else): "${userPrompt}"`,
        apiKey,
      });
      if (translationRes?.text) {
        englishPrompt = translationRes.text.replace(/["\n]/g, '').trim();
      }
    } catch {
      englishPrompt = userPrompt;
    }

    const seed = Math.floor(Math.random() * 1000000);
    const encoded = encodeURIComponent(englishPrompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&nologo=true&seed=${seed}&model=flux`;

    // 2. Mahalliy uploads/ papkasiga saqlash
    const uploadsDir = path.resolve('uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filename = `ai-gen-${Date.now()}-${seed}.jpg`;
    const localPath = path.join(uploadsDir, filename);

    try {
      const res = await fetch(imageUrl, { signal: AbortSignal.timeout(12000) });
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        fs.writeFileSync(localPath, Buffer.from(buffer));
        return {
          imageUrl: `/uploads/${filename}`,
          directUrl: imageUrl,
          prompt: englishPrompt,
        };
      }
    } catch (fetchErr) {
      console.warn("Lokal saqlashda vaqt tugadi, to'g'ridan-to'g'ri URL ishlatiladi:", fetchErr.message);
    }

    return {
      imageUrl,
      directUrl: imageUrl,
      prompt: englishPrompt,
    };
  } catch (error) {
    console.error('Rasm yaratishda xato:', error);
    throw error;
  }
};

