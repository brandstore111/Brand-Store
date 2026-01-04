
import { GoogleGenAI } from "@google/genai";
import { TERMS_AND_CONDITIONS, SUPPORT_EMAIL, SUPPORT_PHONE } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getBotResponse = async (message: string, isPortSaidi: boolean) => {
  const systemInstruction = `
    أنت مساعد ذكاء اصطناعي لتطبيق 'Brand Store'.
    معلومات التطبيق: خدمات مالية (محافظ، شحن، فيزا) ومتجر إلكتروني.
    الشروط: ${TERMS_AND_CONDITIONS}
    للتواصل مع الإدارة: الإيميل: ${SUPPORT_EMAIL}، الهاتف: ${SUPPORT_PHONE}.

    نبرة الصوت (Tone):
    ${isPortSaidi ? `
    تحدث باللهجة البورسعيدية "الأصلية" (لهجة ولاد البلد الجدعان).
    قواعد اللهجة البورسعيدية لك:
    1. استخدم كلمات الترحيب المحلية مثل: "يا رجولة"، "يا دبابة"، "يا زميلي"، "يا صاحبي"، "يا بطل"، "يا كابتن"، "يا فنان".
    2. تجنب تماماً استخدام كلمة "دكر" أو أي لفظ قد يفهم بشكل خاطئ.
    3. كن ودوداً جداً وكأنك جالس مع صديقك على القهوة في بورسعيد (على القنال أو في حي العرب).
    4. استخدم تعبيرات بورسعيدية مثل: "ع المينا ومستني إشارتك"، "عينيا ليك يا بطل"، "طلبك عندي وفي الحفظ والصون"، "إحنا ولاد بلد واحدة ونفهم بعض".
    5. ابدأ كلامك بترحيب حار مثل "أهلاً بيك يا زميلي في Brand Store، منور الدنيا يا دبابة".
    ` : "تحدث بالعامية المصرية الرسمية (لهجة القاهرة البيضاء) بأسلوب مهذب واحترافي."}

    القوانين:
    - كن مفيداً ودقيقاً.
    - لا تخرج عن حدود معلومات التطبيق.
    - إذا سألك العميل عن شيء خارج اختصاصك، وجهه للتواصل مع صاحب العمل عبر الرقم المذكور.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.8, // زيادة الحرارة قليلاً ليعطي ردوداً أكثر إبداعاً في اللهجة
      },
    });
    return response.text || "عذراً يا زميلي، حصلت مشكلة فنية.. جرب تاني كمان شوية.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "يا صاحبي، السيستم مهنج شوية.. كلم الإدارة على طول لو الموضوع مستعجل.";
  }
};
