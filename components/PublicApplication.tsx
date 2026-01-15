
import React, { useState, useRef } from 'react';
import { ArrowLeft, User, Phone, MapPin, FileText, CheckCircle2, Bike, ArrowRight, ShieldCheck, Camera, Scan, Loader2, X, ChevronLeft, Search, Map, AlertCircle } from 'lucide-react';
import { Applicant } from '../types';
import { parseIdCardImage } from '../services/gemini';

interface PublicApplicationProps {
  onApply: (applicant: Applicant) => void;
  onBack: () => void;
}

const MAJOR_CITIES = [
  '北京', '上海', '广州', '深圳', '成都', '杭州', '重庆', '武汉', '西安', '苏州', 
  '天津', '南京', '郑州', '长沙', '东莞', '宁波', '佛山', '合肥', '济南', '青岛',
  '沈阳', '大连', '昆明', '厦门', '长春', '福州', '无锡', '石家庄', '南宁', '南昌'
];

const PublicApplication: React.FC<PublicApplicationProps> = ({ onApply, onBack }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isManualCity, setIsManualCity] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    idNumber: '',
    contact: '',
    age: '',
    city: '北京',
    station: '默认站点',
    experience: ''
  });

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = '请输入姓名';
    if (!/^1[3-9]\d{9}$/.test(formData.contact)) newErrors.contact = '请输入有效的11位手机号';
    if (!formData.age || parseInt(formData.age) < 18 || parseInt(formData.age) > 65) newErrors.age = '年龄需在18-65岁之间';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!/^\d{17}[\dXx]$/.test(formData.idNumber)) newErrors.idNumber = '请输入有效的18位身份证号';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
      window.scrollTo(0, 0);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      alert('无法访问摄像头，请检查浏览器权限设置。');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsCameraActive(false);
    }
  };

  const captureAndRecognize = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsScanning(true);
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const base64Image = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
    
    try {
      const result = await parseIdCardImage(base64Image);
      if (result && result.name) {
        setFormData(prev => ({
          ...prev,
          name: result.name,
          idNumber: result.idNumber,
          age: result.age.toString()
        }));
        setErrors({}); // 清除错误
        stopCamera();
      } else {
        alert('识别失败，请确保照片清晰且无遮挡。');
      }
    } catch (error) {
      alert('AI 解析服务暂时不可用，请手动填写。');
    } finally {
      setIsScanning(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setIsSubmitting(true);
    
    // 模拟提交过程
    setTimeout(() => {
      const newApplicant: Applicant = {
        id: 'AP-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        name: formData.name,
        idNumber: formData.idNumber,
        contact: formData.contact,
        age: parseInt(formData.age),
        city: formData.city,
        station: formData.station,
        experience: formData.experience || '无经验描述',
        status: '待处理',
        appliedDate: new Date().toISOString().split('T')[0],
        assignmentStatus: '待分配',
        entryResult: 'pending'
      };
      
      onApply(newApplicant);
      setStep(3);
      setIsSubmitting(false);
    }, 1200);
  };

  if (step === 3) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-emerald-200 animate-bounce">
          <CheckCircle2 size={56} />
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-3">申请已提交!</h1>
        <p className="text-slate-500 mb-10 max-w-xs leading-relaxed">您的入职资料已进入 RiderHub 审核池。请保持手机畅通，招聘专员会尽快与您联系。</p>
        
        <div className="w-full max-w-xs space-y-4">
          <button onClick={onBack} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl hover:bg-black transition-all active:scale-95">
            返回管理后台
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-start sm:py-10">
      <div className="w-full max-w-md bg-white min-h-screen sm:min-h-[812px] sm:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border border-slate-200 relative">
        
        {/* OCR 扫描层 */}
        {isCameraActive && (
          <div className="absolute inset-0 z-50 bg-black flex flex-col">
            <div className="p-6 flex justify-between items-center text-white z-10">
              <button onClick={stopCamera} className="p-2 bg-white/10 rounded-full backdrop-blur-md"><X size={24} /></button>
              <h3 className="text-sm font-bold">扫描身份证正面</h3>
              <div className="w-10" />
            </div>
            <div className="flex-1 relative">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex flex-col pointer-events-none">
                <div className="bg-black/60 flex-1" />
                <div className="flex h-64">
                  <div className="bg-black/60 flex-1" />
                  <div className="w-80 border-2 border-blue-500 rounded-3xl relative">
                    {isScanning && (
                      <div className="absolute inset-0 overflow-hidden rounded-3xl">
                        <div className="w-full h-1 bg-blue-400 shadow-[0_0_15px_#60a5fa] animate-[scanLine_2s_infinite]" />
                      </div>
                    )}
                  </div>
                  <div className="bg-black/60 flex-1" />
                </div>
                <div className="bg-black/60 flex-1" />
              </div>
            </div>
            <div className="p-8 bg-black flex flex-col items-center gap-4">
               <button 
                 disabled={isScanning}
                 onClick={captureAndRecognize}
                 className="w-16 h-16 bg-white rounded-full flex items-center justify-center active:scale-90 transition-all disabled:opacity-50"
               >
                 {isScanning ? <Loader2 className="animate-spin text-blue-600" /> : <div className="w-12 h-12 border-4 border-slate-200 rounded-full" />}
               </button>
               <p className="text-white/60 text-xs">对准证件，AI 将自动识别文字</p>
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}

        {/* 顶部进度条 */}
        <div className="bg-blue-600 p-8 pb-12 text-white relative">
          <div className="flex justify-between items-center mb-6">
            <button onClick={onBack} className="p-2 bg-white/10 rounded-xl flex items-center gap-1 group">
              <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-bold">返回</span>
            </button>
            <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-wider">
               Encrypted Session
            </div>
          </div>
          <h1 className="text-2xl font-black mb-1">应聘申请表</h1>
          <p className="text-blue-100/70 text-sm">请提供真实的个人信息以通过背调</p>
          
          <div className="absolute -bottom-6 left-8 right-8 bg-white rounded-2xl p-4 shadow-xl flex justify-between items-center border border-slate-100">
            <div className="flex gap-2">
               {[1, 2].map(i => (
                 <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${step >= i ? 'w-10 bg-blue-600' : 'w-4 bg-slate-200'}`} />
               ))}
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Step {step} / 2</span>
          </div>
        </div>

        <div className="flex-1 p-8 pt-14 overflow-y-auto">
          <form onSubmit={handleSubmit} className="h-full flex flex-col">
            {step === 1 ? (
              <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-black text-slate-900">1. 基本信息</h2>
                  <button type="button" onClick={startCamera} className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 flex items-center gap-1.5">
                    <Scan size={14} /> 自动识别
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">真实姓名</label>
                    <div className={`relative transition-all ${errors.name ? 'ring-2 ring-red-500 rounded-2xl' : ''}`}>
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input 
                        type="text" 
                        placeholder="请输入姓名" 
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-800"
                        value={formData.name}
                        onChange={e => { setFormData({...formData, name: e.target.value}); if(errors.name) setErrors({...errors, name: ''}); }}
                      />
                    </div>
                    {errors.name && <p className="text-[10px] text-red-500 font-bold px-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.name}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">手机号码</label>
                    <div className={`relative transition-all ${errors.contact ? 'ring-2 ring-red-500 rounded-2xl' : ''}`}>
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input 
                        type="tel" 
                        placeholder="11位手机号" 
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-800"
                        value={formData.contact}
                        onChange={e => { setFormData({...formData, contact: e.target.value}); if(errors.contact) setErrors({...errors, contact: ''}); }}
                      />
                    </div>
                    {errors.contact && <p className="text-[10px] text-red-500 font-bold px-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.contact}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">年龄</label>
                      <input 
                        type="number" 
                        placeholder="您的年龄" 
                        className={`w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-800 ${errors.age ? 'ring-2 ring-red-500' : ''}`}
                        value={formData.age}
                        onChange={e => { setFormData({...formData, age: e.target.value}); if(errors.age) setErrors({...errors, age: ''}); }}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">意向城市</label>
                      <div className="relative">
                        <select 
                          className="w-full pl-5 pr-10 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-800 appearance-none text-sm"
                          value={formData.city}
                          onChange={e => setFormData({...formData, city: e.target.value})}
                        >
                          {MAJOR_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-8 mt-auto">
                  <button 
                    type="button"
                    onClick={handleNextStep}
                    className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-100 flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-95"
                  >
                    继续下一步 <ArrowRight size={20} />
                  </button>
                  <p className="text-center text-[10px] text-slate-400 font-bold mt-4">点击下一步即代表您同意 RiderHub 隐私协议</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in slide-in-from-right-8 duration-300 flex-1 flex flex-col">
                <h2 className="text-lg font-black text-slate-900">2. 资质与经验</h2>
                <div className="space-y-5 flex-1">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">身份证号 (系统加密)</label>
                    <div className={`relative transition-all ${errors.idNumber ? 'ring-2 ring-red-500 rounded-2xl' : ''}`}>
                      <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input 
                        type="text" 
                        placeholder="18位居民身份证号" 
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-800 font-mono"
                        value={formData.idNumber}
                        onChange={e => { setFormData({...formData, idNumber: e.target.value}); if(errors.idNumber) setErrors({...errors, idNumber: ''}); }}
                      />
                    </div>
                    {errors.idNumber && <p className="text-[10px] text-red-500 font-bold px-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.idNumber}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">配送工作经验 (选填)</label>
                    <textarea 
                      placeholder="例如：曾在美团配送3年，熟悉当地地形..." 
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-800 h-32 resize-none text-sm"
                      value={formData.experience}
                      onChange={e => setFormData({...formData, experience: e.target.value})}
                    />
                  </div>
                </div>

                <div className="pt-8 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setStep(1)}
                    className="w-14 h-14 bg-slate-100 text-slate-500 rounded-2xl flex items-center justify-center active:scale-95 transition-all"
                  >
                    <ArrowLeft size={24} />
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-1 py-5 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-100 flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="animate-spin" size={18} />
                        正在加密传输...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        提交入职申请 <CheckCircle2 size={20} />
                      </div>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      <style>{`
        @keyframes scanLine {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default PublicApplication;
