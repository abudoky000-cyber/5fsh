
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const enhanceListing = async (title: string, category: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `ساعدني في كتابة وصف إعلاني جذاب واحترافي باللغة العربية لمنتج إلكتروني بعنوان: "${title}" في قسم "${category}". ركز على المواصفات التقنية وحالة المنتج ونقاط القوة بصيغة قائمة.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini enhancement failed", error);
    return "عذراً، لم نتمكن من توليد الوصف حالياً.";
  }
};
