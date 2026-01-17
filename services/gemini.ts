
import { GoogleGenAI, Type } from "@google/genai";

export const getAIAnalysis = async (applicantData: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `请分析这位物流配送骑手申请人的入职潜力。
    申请人信息: ${JSON.stringify(applicantData)}。
    请提供一个 0-100 的评分和简短的专业评估总结（中文）。`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          summary: { type: Type.STRING },
          pros: { type: Type.ARRAY, items: { type: Type.STRING } },
          cons: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["score", "summary"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
};

export const chatWithAIConsultant = async (history: { role: string, parts: { text: string }[] }[], message: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const chat = ai.chats.create({
    // Upgrade: Using gemini-3-pro-preview for complex logistics reasoning and decision support
    model: 'gemini-3-pro-preview',
    history: history,
    config: {
      systemInstruction: '你是一位精通末端配送和灵活用工物流的人力资源与运营专家。你负责帮助车队经理优化骑手团队、招聘策略以及提升运营效率。请始终使用中文回答。',
    }
  });
  
  const result = await chat.sendMessage({ message });
  return result.text;
};

// 新增：从图片中自动解析身份证信息
export const parseIdCardImage = async (base64Image: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    // Fix: Wrap multimodal parts in a single content object as per the recommended @google/genai usage
    contents: {
      parts: [
        {
          text: "请识别并提取这张身份证照片中的信息。提取内容：姓名(name)、18位身份证号(idNumber)、根据出生日期计算出的当前年龄(age，数字类型)。如果是无效的身份证，请返回空对象。"
        },
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image
          }
        }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          idNumber: { type: Type.STRING },
          age: { type: Type.NUMBER }
        },
        required: ["name", "idNumber", "age"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
};
