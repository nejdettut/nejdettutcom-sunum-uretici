# AI Sunum Üretici — nejdettut.com

Konu + hedef kitle + slayt sayısı + tema → yapılandırılmış .pptx sunum.

- **Model:** Groq `openai/gpt-oss-120b` (tek `generateObject` çağrısı)
- **Çıktı:** başlık + alt başlık + N içerik slaytı (her biri 1-6 madde + konuşmacı notu)
- **Export:** `pptxgenjs` client-side, 4 tema (Klasik Lacivert · Sıcak Toprak · Pastel · Koyu)
- **Rate limit:** 12 sunum/saat/IP

Bu uygulama [nejdettut.com](https://www.nejdettut.com) koleksiyonunun bir parçasıdır.

## Geliştirme

```bash
npm install
cp .env.example .env.local   # GROQ_API_KEY ekleyin
npm run dev
```
