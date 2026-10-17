import { useState, useEffect, useRef } from 'react';
import {
  Sparkles, Bot, Send, Key, Trash2, CheckCircle2,
  AlertCircle, ExternalLink, Copy, Check, ArrowUp,
  Image as ImageIcon, Paperclip, X, Download, Maximize2, Loader2
} from 'lucide-react';
import axios from 'axios';

const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const SUGGESTIONS = [
  {
    title: "🎨 Oltin shokila rasmini chizib ber",
    desc: "AI orqali fotorealistik hashamatli dekor tasviri yaratish",
    prompt: "Menga hashamatli saroy uslubidagi oltin ipak shokila (tassel) va baxmal parda rasmini chizib ber"
  },
  {
    title: "📊 Loyihani to'liq tahlil qil",
    desc: "Ombor, 115 ta tovar, narxlar va buyurtmalar holati",
    prompt: "Butun loyihani va ombor holatini to'liq tahlil qilib ber"
  },
  {
    title: "🛍️ Eng yaxshi tovarlarni tavsiya qil",
    desc: "Yangi kelganlar va eng yuqori reytingli tassellar",
    prompt: "Do'kondagi eng yangi va mashhur tovarlarni narxlari bilan ko'rsat"
  },
  {
    title: "💡 Istalgan erkin savol bering",
    desc: "Dasturlash, fan, biznes yoki hayotiy maslahat",
    prompt: "Assalomu alaykum! Sen nimalarga qodirsan va qanday savollarga javob bera olasan?"
  }
];

export default function AiPage() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('grand_gemini_api_key') || '');
  const [selectedModel, setSelectedModel] = useState(() => localStorage.getItem('grand_gemini_model') || 'openai/gpt-oss-120b');
  const [keyModalOpen, setKeyModalOpen] = useState(false);
  const [testStatus, setTestStatus] = useState(null);

  // Xabarlar va kiritish
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Rasm biriktirish holati (Foydalanuvchi rasm tashlashi)
  const [attachedFile, setAttachedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Kattalashtirib ko'rish modali (Lightbox)
  const [lightboxImage, setLightboxImage] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  // Pastga silliq tushirish
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, imagePreview]);

  const handleSaveSettings = (newKey, newModel) => {
    setApiKey(newKey);
    setSelectedModel(newModel);
    localStorage.setItem('grand_gemini_api_key', newKey.trim());
    localStorage.setItem('grand_gemini_model', newModel);
    setTestStatus(null);
  };

  const handleTestKey = async () => {
    if (!apiKey.trim()) {
      setTestStatus({ type: 'error', text: 'Iltimos, API kalitni kiriting.' });
      return;
    }
    setTestStatus({ type: 'loading', text: 'AI API bilan tekshirilmoqda...' });
    try {
      const res = await axios.post(`${BASE}/api/ai/test-key`, {
        apiKey: apiKey.trim(),
        model: selectedModel,
      });
      if (res.data.success) {
        setTestStatus({
          type: 'success',
          text: `Muvaffaqiyatli! Model: ${res.data.model}. Javob: "${res.data.reply}"`,
        });
      }
    } catch (err) {
      setTestStatus({
        type: 'error',
        text: err.response?.data?.message || 'Ulanishda xatolik yuz berdi.',
      });
    }
  };

  // Foydalanuvchi fayl tanlaganda
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Clipboard'dan rasm tashlanganda (Ctrl+V)
  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          setAttachedFile(file);
          setImagePreview(URL.createObjectURL(file));
          break;
        }
      }
    }
  };

  const removeAttachedImage = () => {
    setAttachedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSendMessage = async (customText = null) => {
    const textToSend = customText !== null ? customText : inputMessage;
    if ((!textToSend.trim() && !attachedFile) || loading) return;

    let uploadedImageUrl = null;

    // 1. Agar rasm ilova qilingan bo'lsa serverga yuklaymiz
    if (attachedFile) {
      setUploadingImage(true);
      try {
        const formData = new FormData();
        formData.append('image', attachedFile);
        const uploadRes = await axios.post(`${BASE}/api/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (uploadRes.data.success) {
          uploadedImageUrl = uploadRes.data.url;
        }
      } catch (err) {
        console.warn('Rasm yuklashda xatolik:', err.message);
      } finally {
        setUploadingImage(false);
      }
    }

    const currentImagePreview = imagePreview;

    const userMsg = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: textToSend.trim(),
      image: uploadedImageUrl
        ? (uploadedImageUrl.startsWith('http') ? uploadedImageUrl : `${BASE}${uploadedImageUrl}`)
        : currentImagePreview,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputMessage('');
    removeAttachedImage();
    setLoading(true);

    try {
      const history = messages
        .slice(-4)
        .map(m => ({
          role: m.role,
          content: m.text,
        }));

      const res = await axios.post(`${BASE}/api/ai/chat`, {
        message: textToSend.trim(),
        history,
        apiKey: apiKey.trim() || undefined,
        model: selectedModel,
        userImage: uploadedImageUrl,
      });

      if (res.data.success) {
        let finalImage = null;
        if (res.data.generatedImage) {
          finalImage = res.data.generatedImage.startsWith('http')
            ? res.data.generatedImage
            : `${BASE}${res.data.generatedImage}`;
        }

        const aiMsg = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          text: res.data.reply,
          image: finalImage,
          directUrl: res.data.directUrl,
          model: res.data.model,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, aiMsg]);
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Serverda xatolik yuz berdi.';
      setMessages(prev => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          role: 'assistant',
          isError: true,
          text: `⚠️ ${errMsg}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([]);
    removeAttachedImage();
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4.5rem)] bg-slate-950 text-slate-100 overflow-hidden">
      {/* 1. YENGIL, MINIMAL TOPBAR */}
      <header className="h-14 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/20">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-black text-sm tracking-wide text-white">
                Grand <span className="text-amber-400">AI</span>
              </span>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Matn & Rasm Generatsiyasi Faol
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* API KALIT TUGMASI */}
          <button
            onClick={() => setKeyModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 transition-all"
          >
            <Key className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline">AI Kalit</span>
            <span className="text-[10px] text-slate-500 font-mono">({selectedModel.split('/').pop().replace('gemini-', '')})</span>
          </button>

          {/* CHATNI TOZALASH */}
          {messages.length > 0 && (
            <button
              onClick={handleClearChat}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
              title="Yangi suhbat boshlash"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </header>

      {/* 2. CHAT OQIMI (ASOSIY BUTUN PAGE) */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 custom-scrollbar">
        <div className="max-w-3xl mx-auto h-full flex flex-col">
          {messages.length === 0 ? (
            /* BO'SH HOLAT (WELCOME SCREEN) */
            <div className="my-auto text-center py-8">
              <div className="inline-flex p-4 rounded-3xl bg-gradient-to-tr from-amber-400/15 via-yellow-500/10 to-transparent border border-amber-400/20 mb-4 shadow-xl shadow-amber-500/10">
                <Sparkles className="h-10 w-10 text-amber-400" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white font-serif tracking-tight">
                Qanday yordam bera olaman?
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-md mx-auto">
                Loyiha tahlili, istalgan savollar, rasm chizdirish yoki o'z rasmingizni yuborib maslahat olishingiz mumkin.
              </p>

              {/* TAYYOR VARIANTLAR */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-8 max-w-xl mx-auto text-left">
                {SUGGESTIONS.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(item.prompt)}
                    className="p-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-amber-400/40 transition-all text-left group"
                  >
                    <p className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                      {item.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* XABARLAR RO'YXATI */
            <div className="space-y-6 pb-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3.5 ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {/* AI AVATAR */}
                  {msg.role !== 'user' && (
                    <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 text-slate-950 flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20 font-black text-xs mt-0.5">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}

                  {/* XABAR MATNI VA RASMLAR */}
                  <div
                    className={`relative group max-w-[90%] sm:max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-amber-400 text-slate-950 font-medium rounded-tr-none'
                        : msg.isError
                          ? 'bg-rose-950/30 border border-rose-900/40 text-rose-200 rounded-tl-none'
                          : 'bg-slate-900/80 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm'
                    }`}
                  >
                    {/* FOYDALANUVCHI RASMI (AGAR YUKLANGAN BO'LSA) */}
                    {msg.role === 'user' && msg.image && (
                      <div
                        className="mb-2.5 rounded-xl overflow-hidden border border-slate-950/20 max-w-xs cursor-pointer group/img relative"
                        onClick={() => setLightboxImage(msg.image)}
                      >
                        <img
                          src={msg.image}
                          alt="Foydalanuvchi rasmi"
                          className="w-full max-h-56 object-cover rounded-xl group-hover/img:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                          <Maximize2 className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    )}

                    {/* MATN */}
                    {msg.text && (
                      <div className="whitespace-pre-line select-text font-sans">
                        {msg.text}
                      </div>
                    )}

                    {/* AI TOMONIDAN YARATILGAN RASM (AGAR GENERATE BO'LGAN BO'LSA) */}
                    {msg.role !== 'user' && msg.image && (
                      <div className="mt-3 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950/80 max-w-sm">
                        <div
                          className="relative group/gen cursor-pointer overflow-hidden bg-slate-900"
                          onClick={() => setLightboxImage(msg.image)}
                        >
                          <img
                            src={msg.image}
                            alt="AI yaratgan tasvir"
                            className="w-full max-h-72 object-cover rounded-t-2xl group-hover/gen:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/gen:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <span className="p-2 rounded-xl bg-slate-900/90 text-white shadow-lg">
                              <Maximize2 className="h-4 w-4" />
                            </span>
                          </div>
                        </div>

                        <div className="p-2.5 flex items-center justify-between bg-slate-900/90 border-t border-slate-800/80">
                          <span className="text-[10px] text-amber-300 font-mono flex items-center gap-1 font-semibold">
                            <Sparkles className="h-3 w-3" /> FLUX AI Tasviri
                          </span>

                          <a
                            href={msg.image}
                            download="grand-ai-tassel.jpg"
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 text-[10px] text-slate-300 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors font-medium"
                          >
                            <Download className="h-3 w-3" /> Yuklab olish
                          </a>
                        </div>
                      </div>
                    )}

                    {/* FOOTER: VAQT VA MODEL */}
                    <div
                      className={`flex items-center justify-between gap-3 mt-2 pt-1 border-t text-[10px] ${
                        msg.role === 'user'
                          ? 'border-slate-950/15 text-slate-800'
                          : 'border-slate-800/60 text-slate-500'
                      }`}
                    >
                      <span>{msg.time}</span>
                      {msg.role !== 'user' && (
                        <div className="flex items-center gap-2">
                          {msg.model && (
                            <span className="font-mono text-[9px] text-slate-500">
                              {msg.model.split('/').pop()}
                            </span>
                          )}
                          <button
                            onClick={() => copyToClipboard(msg.text, msg.id)}
                            className="text-slate-400 hover:text-white p-0.5 transition-colors"
                            title="Matndan nusxa olish"
                          >
                            {copiedId === msg.id ? (
                              <Check className="h-3 w-3 text-emerald-400" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* YUKLANISH HOLATI */}
              {loading && (
                <div className="flex gap-3.5">
                  <div className="h-8 w-8 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 animate-spin" />
                  </div>
                  <div className="bg-slate-900/80 border border-slate-800 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-bounce" />
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]" />
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {attachedFile ? "Rasm tahlil qilinmoqda va javob tayyorlanmoqda..." : "Fikrlamoqda va javob tayyorlanmoqda..."}
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>

      {/* 3. QUYI INPUT MAYDONI (FLOATING BAR + RASM YUKLASH) */}
      <footer className="p-4 sm:p-5 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent shrink-0">
        <div className="max-w-3xl mx-auto">
          {/* RASM PREVIEWSI (AGAR BIRIKTIRILGAN BO'LSA) */}
          {imagePreview && (
            <div className="mb-2 p-2 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between max-w-xs animate-in fade-in duration-200">
              <div className="flex items-center gap-2.5">
                <img
                  src={imagePreview}
                  alt="Yuklanayotgan rasm"
                  className="h-12 w-12 object-cover rounded-xl border border-slate-800"
                />
                <div className="text-left">
                  <p className="text-[11px] font-bold text-white truncate max-w-[140px]">
                    {attachedFile?.name || "Biriktirilgan rasm"}
                  </p>
                  <p className="text-[9px] text-amber-400">Yuborishga tayyor</p>
                </div>
              </div>
              <button
                type="button"
                onClick={removeAttachedImage}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            onPaste={handlePaste}
            className="relative flex items-center bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl shadow-black/40 focus-within:border-amber-400/60 transition-all p-1.5"
          >
            {/* YASHIRIN FILE INPUT */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* RASM QO'SHISH TUGMASI */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading || uploadingImage}
              className="p-2 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
              title="Rasm yuklash (parda yoki xona rasmini tashlang)"
            >
              <Paperclip className="h-4 w-4" />
            </button>

            {/* MATN INPUTI */}
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Savolingizni yozing yoki '... rasmini chiz' deb ayting..."
              disabled={loading}
              className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
            />

            {/* YUBORISH TUGMASI */}
            <button
              type="submit"
              disabled={(!inputMessage.trim() && !attachedFile) || loading || uploadingImage}
              className="h-9 w-9 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-30 disabled:hover:bg-amber-400 text-slate-950 flex items-center justify-center transition-all shadow-md shadow-amber-400/20 shrink-0"
            >
              {uploadingImage ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowUp className="h-4 w-4 stroke-[2.5]" />
              )}
            </button>
          </form>

          <p className="text-[10px] text-center text-slate-500 mt-2">
            Rasm yuklashingiz yoki "rasmini chiz" deb so'rashingiz mumkin. AI fotorealistik tasvirlar yaratadi.
          </p>
        </div>
      </footer>

      {/* ============================================================ */}
      {/* 4. LIGHTBOX (RASMNI TO'LIQ KO'RISH MODALI) */}
      {/* ============================================================ */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-2xl bg-slate-950/80 text-white hover:bg-slate-900 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <img
              src={lightboxImage}
              alt="Kattalashtirilgan tasvir"
              className="max-h-[82vh] w-auto object-contain mx-auto"
            />

            <div className="p-3 bg-slate-950/95 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">To'liq o'lchamli tasvir</span>
              <a
                href={lightboxImage}
                download="grand-ai-image.jpg"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs"
              >
                <Download className="h-4 w-4" /> Yuklab olish
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. SOZLAMALAR MODAL OYNASI */}
      {/* ============================================================ */}
      {keyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20">
                  <Key className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">AI API Kaliti Sozlamalari</h3>
                  <p className="text-[10px] text-slate-400">Groq yoki Google Gemini</p>
                </div>
              </div>
              <button
                onClick={() => setKeyModalOpen(false)}
                className="text-slate-500 hover:text-white p-1 rounded-lg text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1.5">
                  API Kaliti
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => handleSaveSettings(e.target.value, selectedModel)}
                  placeholder="gsk_... yoki AIzaSy..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1.5">
                  Model
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => handleSaveSettings(apiKey, e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="openai/gpt-oss-120b">openai/gpt-oss-120b (Groq 120B — o'ta kuchli)</option>
                  <option value="openai/gpt-oss-20b">openai/gpt-oss-20b (Groq 20B — tezkor)</option>
                  <option value="qwen/qwen3.8-27b">qwen/qwen3.8-27b (Groq Qwen)</option>
                  <option value="gemini-2.5-flash">gemini-2.5-flash (Google Gemini)</option>
                  <option value="gemini-1.5-flash">gemini-1.5-flash (Google Gemini)</option>
                </select>
              </div>

              {testStatus && (
                <div
                  className={`p-3 rounded-xl text-[11px] flex items-start gap-2 ${
                    testStatus.type === 'success'
                      ? 'bg-emerald-950/50 border border-emerald-800/60 text-emerald-300'
                      : testStatus.type === 'error'
                        ? 'bg-rose-950/50 border border-rose-800/60 text-rose-300'
                        : 'bg-amber-950/50 border border-amber-800/60 text-amber-300'
                  }`}
                >
                  {testStatus.type === 'success' ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  )}
                  <span>{testStatus.text}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={handleTestKey}
                disabled={testStatus?.type === 'loading'}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              >
                Sinab Ko'rish
              </button>
              <button
                type="button"
                onClick={() => setKeyModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors shadow-md shadow-amber-400/20"
              >
                Saqlash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
