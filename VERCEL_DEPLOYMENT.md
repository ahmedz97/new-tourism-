# 🚀 دليل النشر على Vercel

## ✅ الملفات المطلوبة (تم إنشاؤها)

تم إضافة الملفات التالية للمشروع:
- ✅ `vercel.json` - إعدادات Vercel
- ✅ `.vercelignore` - ملفات يتم تجاهلها عند النشر
- ✅ `build-vercel.js` - سكريبت البناء

## 📋 خطوات ربط المشروع مع Vercel

### الطريقة 1: من خلال موقع Vercel (موصى بها) 🌐

1. **اذهب إلى Vercel Dashboard**
   - زر الرابط: https://vercel.com/dashboard

2. **أضف مشروع جديد**
   - اضغط على **"Add New Project"**
   - أو: **"Import Project"**

3. **اختر Repository من GitHub**
   - سجل دخول بـ GitHub إذا لم تكن مسجلاً
   - ابحث عن: `ahmedz97/new-tourism-`
   - اضغط **"Import"**

4. **إعدادات المشروع (ستظهر تلقائياً)**
   ```
   Framework Preset: Angular
   Root Directory: ./
   Build Command: npm run build
   Output Directory: dist/tricia/browser
   Install Command: npm install
   ```

5. **اضغط "Deploy"**
   - انتظر حتى ينتهي البناء (3-5 دقائق)
   - ستحصل على رابط المشروع

### الطريقة 2: من خلال Terminal (CLI) 💻

```bash
# تثبيت Vercel CLI عالمياً
npm install -g vercel

# تسجيل الدخول
vercel login

# نشر المشروع
vercel

# للنشر في Production
vercel --prod
```

## 🔄 التحديثات التلقائية

بعد الربط، كل مرة تعمل `git push`:

```bash
git add .
git commit -m "وصف التحديثات"
git push origin main
```

**Vercel سيقوم تلقائياً بـ:**
1. ✅ اكتشاف التحديث الجديد
2. ✅ تشغيل `npm install`
3. ✅ تشغيل `npm run build`
4. ✅ نشر النسخة الجديدة
5. ✅ إرسال إشعار بالانتهاء

## 🔧 إعدادات إضافية

### Environment Variables (إن وجدت)

إذا كان لديك متغيرات بيئية:

1. اذهب إلى: **Project Settings** → **Environment Variables**
2. أضف المتغيرات المطلوبة:
   - `API_URL`
   - `API_KEY`
   - إلخ...

### Custom Domain

لإضافة دومين خاص:

1. اذهب إلى: **Project Settings** → **Domains**
2. أضف الدومين الخاص بك
3. اتبع التعليمات لربط DNS

## 📊 مراقبة النشر

### من Dashboard:
- **Deployments**: لرؤية سجل جميع النشرات
- **Logs**: لرؤية سجلات البناء والأخطاء
- **Analytics**: لمراقبة الأداء والزيارات

### الإشعارات:
- يمكنك ربط Vercel مع:
  - Slack
  - Discord
  - Email

## ⚡ Preview Deployments

- كل **Pull Request** يحصل على رابط معاينة خاص
- كل **Branch** غير main يحصل على deployment منفصل

## 🐛 حل المشاكل الشائعة

### Build Failed
```bash
# تأكد من أن البناء يعمل محلياً أولاً
npm run build
```

### Missing Dependencies
- تأكد من أن جميع الـ dependencies موجودة في `package.json`

### Wrong Output Directory
- تأكد من أن `outputDirectory` في `vercel.json` يطابق `outputPath` في `angular.json`

## 📞 دعم إضافي

- Vercel Documentation: https://vercel.com/docs
- Angular on Vercel: https://vercel.com/docs/frameworks/angular

---

## 🎯 الملخص

**الملفات المطلوبة:** ✅ تم إضافتها
**Git Push:** ✅ تم الرفع على GitHub
**الخطوة التالية:** 👉 اربط المشروع من Vercel Dashboard

**Repository:** https://github.com/ahmedz97/new-tourism-.git
**Vercel Dashboard:** https://vercel.com/dashboard

