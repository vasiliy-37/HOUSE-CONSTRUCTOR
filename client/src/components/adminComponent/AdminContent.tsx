import React, { useState } from 'react';
import HouseConfigurator from "../HouseConfigurator";
import type { LandingData } from '../../types';
import { EditableText, EditableImage } from '../adminComponent/EditableElements';

interface AdminContentProps {
  initialData: LandingData;
  onSaveToServer: (updatedData: LandingData) => Promise<void>;
}

const AdminContent: React.FC<AdminContentProps> = ({ initialData, onSaveToServer }) => {
  const [data, setData] = useState<LandingData>(initialData);

  const updateField = (key: keyof LandingData, value: string): void => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <main className="relative">
      {/* Панель управления сверху */}
      <div className="fixed top-0 left-0 right-0 bg-[#051125] p-4 z-[100] flex justify-between items-center shadow-2xl">
        <span className="text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span> Режим правки
        </span>
        <button 
          onClick={() => onSaveToServer(data)}
          className="bg-[#8f4e00] hover:bg-orange-700 text-white px-6 py-2 rounded font-bold transition-all"
        >
          Сохранить в БД
        </button>
      </div>

      <div className="absolute inset-0 blueprint-grid pointer-events-none opacity-10"></div>

      {/* Hero Section */}
      <section className="relative min-h-[870px] bg-[#eeeeee] flex items-center overflow-hidden pt-16">
        <div className="max-w-[1100px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7">
            <EditableText 
              tagName="h1"
              value={data.heroTitle}
              onSave={(v: string) => updateField('heroTitle', v)}
              className="font-headline text-5xl md:text-7xl font-black text-[#051125] leading-[1.1] -tracking-[0.03em] mb-8"
            />
            <EditableText 
              tagName="p"
              value={data.heroSub}
              onSave={(v: string) => updateField('heroSub', v)}
              className="text-[#45474d] text-xl max-w-xl mb-10 leading-relaxed"
            />
            <div className="flex flex-wrap gap-4">
              <button className="bg-[#8f4e00] text-white px-10 py-5 rounded-lg font-bold text-lg cursor-default opacity-80">Начать проект</button>
              <button className="border-b-2 border-[#051125] py-5 px-4 font-bold text-lg">Наши проекты</button>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/5] bg-[#e6e6e6] rounded-lg overflow-hidden relative shadow-2xl transform lg:translate-x-12 lg:-rotate-2">
              <EditableImage 
                src={data.heroImg}
                onSave={(v: string) => updateField('heroImg', v)}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#051125]/40 to-transparent pointer-events-none"></div>
            </div>

            <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-lg shadow-2xl border border-slate-100 max-w-[200px] z-20">
              <EditableText 
                tagName="span"
                value={data.experienceYears}
                onSave={(v: string) => updateField('experienceYears', v)}
                className="text-[#8f4e00] font-headline text-4xl font-black block mb-1"
              />
              <span className="text-[#45474d] text-sm font-bold uppercase tracking-wider leading-tight">Лет безупречного строительства</span>
            </div>
          </div>
        </div>
      </section>

      {/* СЕКЦИЯ "О НАС" */}
      <section className="py-24 relative overflow-hidden bg-[#dadada] z-10">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#051125]/5 text-[#051125] text-xs font-bold tracking-[0.2em] uppercase mb-4 rounded">
                <span className="w-1.5 h-1.5 bg-[#8f4e00] rounded-full"></span>
                <EditableText value={data.aboutBadge} onSave={(v: string) => updateField('aboutBadge', v)} />
              </div>
              <EditableText 
                tagName="h2"
                value={data.aboutTitle}
                onSave={(v: string) => updateField('aboutTitle', v)}
                className="font-headline text-3xl md:text-4xl font-black text-[#051125] mb-6 tracking-tight leading-tight"
              />
              <div className="space-y-4 text-[#45474d] text-base leading-relaxed">
                <EditableText value={data.aboutText1} onSave={(v: string) => updateField('aboutText1', v)} />
                <EditableText value={data.aboutText2} onSave={(v: string) => updateField('aboutText2', v)} />
              </div>

              <div className="mt-12 grid grid-cols-2 gap-8 border-t border-black pt-8">
                <div>
                  <EditableText 
                    value={data.statYears} onSave={(v: string) => updateField('statYears', v)}
                    className="text-3xl font-black text-[#051125] font-headline mb-1"
                  />
                  <div className="text-[10px] font-bold text-[#45474d] uppercase tracking-[0.2em]">Лет опыта</div>
                </div>
                <div>
                  <EditableText 
                    value={data.statProjects} onSave={(v: string) => updateField('statProjects', v)}
                    className="text-3xl font-black text-[#051125] font-headline mb-1"
                  />
                  <div className="text-[10px] font-bold text-[#45474d] uppercase tracking-[0.2em]">Проектов реализовано</div>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-[#8f4e00] rounded-xl rotate-3 scale-95 opacity-5"></div>
              <div className="bg-[#f3f3f3] aspect-square rounded-xl border border-slate-200 relative overflow-hidden">
                <div className="blueprint-grid absolute inset-0 opacity-20"></div>
                <EditableImage 
                  src={data.aboutImg}
                  onSave={(v: string) => updateField('aboutImg', v)}
                  className="absolute inset-0 w-full h-full object-cover scale-110 translate-x-4"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="configurator" className="scroll-mt-28 ">
        <HouseConfigurator />
      </section>
    </main>
  );
};

export default AdminContent;
