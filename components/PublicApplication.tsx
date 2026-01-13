
import React, { useState, useRef } from 'react';
import { ArrowLeft, User, Phone, MapPin, FileText, CheckCircle2, Bike, ArrowRight, ShieldCheck, Camera, Scan, Loader2, X, ChevronLeft, Search, Map } from 'lucide-react';
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
      alert('无法访问摄像头，请检查权限设置。');
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
        stopCamera();
        alert('身份证识别成功！已自动填充。');
      } else {
        alert('识别失败，请确保照片清晰且无遮挡。');
      }
    } catch (error) {
      alert('系统繁忙，请手动填写信息。');
    } finally {
      setIsScanning(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      const newApplicant: Applicant = {
        id: 'AP-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        name: formData.name,
        idNumber: formData.idNumber,
        contact: formData.contact,
        age: parseInt(formData.age) || 20,
        city: formData.city,
        station: formData.station,
        experience: formData.experience,
        status: '待处理',
        appliedDate: new Date().toISOString().split('T')[0],
        assignmentStatus: '待分配'
      };
      
      onApply(newApplicant);
      setStep(3);
      setIsSubmitting(false);
    }, 1500);
  };

  if (step === 3) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-green-200 animate-bounce">
          <CheckCircle2 size={56} />
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-3 text-center">申请已提交!</h1>
        <p className="text-slate-500 mb-10 max-w-xs leading-relaxed text-center">您的资料已通过端口实时同步至 RiderHub 调度中心。请保持手机通讯畅通。</p>
        
        <div className="w-full max-w-xs space-y-4">
          <button onClick={onBack} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl shadow-slate-200 active:scale-95 transition-all">
            返回管理后台
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-start sm:py-10">
      <div className="w-full max-w-md bg-white min-h-screen sm:min-h-[812px] sm:rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col border border-slate-200 relative">
        
        {/* OCR Camera Layer */}
        {isCameraActive && (
          <div className="absolute inset-0 z-50 bg-black flex flex-col">
            <div className="p-6 flex justify-between items-center text-white z-10">
              <button onClick={stopCamera} className="p-2 bg-white/10 rounded-full backdrop-blur-md"><X size={24} /></button>
              <h3 className="text-sm font-bold">请扫描身份证人像面</h3>
              <div className="w-10" />
            </div>
            
            <div className="flex-1 relative flex items-center justify-center">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex flex-col">
                <div className="bg-black/60 flex-1" />
                <div className="flex h-64">
                  <div className="bg-black/60 flex-1" />
                  <div className="w-80 border-2 border-blue-500 rounded-3xl relative">
                    <div className="absolute top-4 right-4 w-12 h-12 bg-white/10 border border-white/20 rounded-xl" />
                    <div className="absolute bottom-4 left-4 space-y-2">
                       <div className="w-24 h-2 bg-white/20 rounded-full" />
                       <div className="w-32 h-2 bg-white/20 rounded-full" />
                    </div>
                    {isScanning && (
                      <div className="absolute inset-0 overflow-hidden rounded-3xl">
                        <div className="w-full h-1 bg-blue-400 shadow-[0_0_15px_#60a5fa] animate-[scanLine_2s_infinite]" />
                      </div>
                    )}
                  </div>
                  <div className="bg-black/60 flex-1" />
                </div>
                <div className="bg-black/60 flex-1 flex flex-col items-center pt-8 px-8 text-center">
                  <p className="text-white/60 text-xs mb-8">请将证件置于框内，确保光线充足</p>
                  <button 
                    disabled={isScanning}
                    onClick={captureAndRecognize}
                    className="w-16 h-16 bg-white rounded-full flex items-center justify-center active:scale-90 transition-all shadow-xl disabled:opacity-50"
                  >
                    {isScanning ? <Loader2 className="animate-spin text-blue-600" /> : <div className="w-14 h-14 border-4 border-slate-100 rounded-full" />}
                  </button>
                </div>
              </div>
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}

        {/* Header Section */}
        <div className="bg-blue-600 p-8 pb-12 text-white relative">
          <div className="flex justify-between items-center mb-8">
            <button 
              onClick={onBack}
              className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-all active:scale-90 flex items-center gap-1 group"
            >
              <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-bold pr-1">退出</span>
            </button>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-wider">
               <ShieldCheck size={12} /> 安全传输
            </div>
          </div>
          <h1 className="text-3xl font-black mb-2 text-left">RiderHub 招募</h1>
          <p className="text-blue-100 text-sm opacity-80 text-left">全国领先的智慧物流骑手平台</p>
          <div className="absolute -bottom-6 left-8 right-8 bg-white rounded-2xl p-4 shadow-xl flex justify-between items-center border border-slate-50">
            <div className="flex gap-1.5">
               {[1, 2].map(i => <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${step === i ? 'w-8 bg-blue-600' : 'w-2 bg-slate-200'}`} />)}
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">步骤 {step}/2</span>
          </div>
        </div>

        <div className="flex-1 p-8 pt-14 flex flex-col overflow-y-auto">
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col text-left">
            {step === 1 ? (
              <div className="space-y-6 animate-in slide-in-from-right-10 duration-300">
                <div className="flex justify-between items-end">
                  <h2 className="text-xl font-black text-slate-900">填写个人资料</h2>
                  <button 
                    type="button"
                    onClick={startCamera}
                    className="flex items-center gap-1.5 text-[10px] font-black text-blue-600 border border-blue-100 px-3 py-1.5 rounded-full bg-blue-50 active:scale-95 transition-all shadow-sm"
                  >
                    <Scan size={14} /> 扫证自动填表
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">真实姓名</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input required type="text" placeholder="请输入您的姓名" className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-800 transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">手机号码</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input 
                        required 
                        type="tel" 
                        placeholder="11位手机号" 
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-800 transition-all" 
                        value={formData.contact} 
                        onChange={e => setFormData({...formData, contact: e.target.value})} 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-left">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">年龄</label>
                      <input required type="number" placeholder="您的年龄" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-800" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center px-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">城市</label>
                        <button 
                          type="button" 
                          onClick={() => setIsManualCity(!isManualCity)}
                          className="text-[9px] font-black text-blue-600 hover:underline flex items-center gap-1"
                        >
                          {isManualCity ? <Map size={10} /> : <Search size={10} />}
                          {isManualCity ? '快速选择' : '手动输入'}
                        </button>
                      </div>
                      <div className="relative">
                        {isManualCity ? (
                          <div className="relative text-left">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                            <input 
                              required 
                              type="text" 
                              placeholder="例: 苏州市" 
                              className="w-full pl-10 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-800 text-sm" 
                              value={formData.city} 
                              onChange={e => setFormData({...formData, city: e.target.value})} 
                            />
                          </div>
                        ) : (
                          <div className="relative text-left">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
                            <select 
                              className="w-full pl-10 pr-8 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-800 appearance-none text-sm" 
                              value={formData.city} 
                              onChange={e => setFormData({...formData, city: e.target.value})}
                            >
                              {MAJOR_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                              <ArrowRight size={14} className="rotate-90" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => {
                    if(formData.name && formData.contact.length === 11 && formData.age) {
                      setStep(2);
                    } else {
                      alert('请填写完整的姓名、11位手机号和年龄');
                    }
                  }} 
                  className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-100 flex items-center justify-center gap-2 mt-4 active:scale-95 transition-all"
                >
                  继续下一步 <ArrowRight size={20} />
                </button>
              </div>
            ) : (
              <div className="space-y-6 animate-in slide-in-from-right-10 duration-300 flex-1 flex flex-col text-left">
                <h2 className="text-xl font-black text-slate-900">入职意向确认</h2>
                <div className="space-y-4 flex-1">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">身份证号 (已加密)</label>
                    <div className="relative">
                      <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input required type="text" placeholder="18位居民身份证号" className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-800 font-mono" value={formData.idNumber} onChange={e => setFormData({...formData, idNumber: e.target.value})} />
                      {formData.idNumber.length === 18 && <CheckCircle2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500" />}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">过往配送经验</label>
                    <textarea placeholder="例如：做过2年外卖配送，熟悉XX区地形..." className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-800 h-40 resize-none" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} />
                  </div>
                </div>
                <div className="pt-6 space-y-4">
                  <div className="flex gap-3">
                    <button 
                      type="button" 
                      onClick={() => setStep(1)} 
                      className="px-6 py-5 bg-slate-100 text-slate-500 rounded-2xl font-black active:scale-95 flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors"
                    >
                      <ArrowLeft size={24} />
                      <span className="hidden sm:inline">返回上一步</span>
                    </button>
                    <button type="submit" disabled={isSubmitting} className="flex-1 py-5 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-100 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50">
                      {isSubmitting ? '正在同步端口...' : '立即提交申请'}
                    </button>
                  </div>
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
