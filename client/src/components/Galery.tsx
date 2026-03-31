import { useEffect, useState } from 'react';

interface IProject {
  _id: string; 
  title: string;
  description: string;
  coverImage: string;
  category: string;
  images: string[]; 
}

function Galery() {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<IProject | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('http://localhost:3001/api/albums')
      .then(res => res.json())
      .then((data: IProject[]) => {
        setProjects(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!selectedAlbum) return;
      if (e.key === 'Escape') setSelectedAlbum(null);
      if (e.key === 'ArrowRight') setActiveIndex(p => (p < selectedAlbum.images.length - 1 ? p + 1 : 0));
      if (e.key === 'ArrowLeft') setActiveIndex(p => (p > 0 ? p - 1 : selectedAlbum.images.length - 1));
    };
    document.body.style.overflow = selectedAlbum ? 'hidden' : 'auto';
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedAlbum]);

  // УБРАЛИ ранний return <div loading... />

  return (
    <section className="w-full min-h-[70vh] bg-[#576b7e23] flex flex-col">
    <div className="max-w-[1100px] mx-auto px-6 py-12 md:py-20 w-full flex-grow">
      
      {loading ? (
        <div className="flex items-center justify-center py-40">
           <div className="text-center font-headline uppercase font-black text-primary animate-pulse text-2xl tracking-tighter">
              Загрузка проектов...
           </div>
        </div>
      ) : (
        <>
          <header className="mb-16">
            <h1 className="font-headline text-5xl md:text-6xl font-black text-primary tracking-tighter mb-6 leading-[0.9]">Наши работы</h1>
            <p className="text-on-surface-variant text-lg border-l-2 border-primary pl-6 max-w-2xl">Нажмите на проект, чтобы просмотреть полный альбом с фотоотчетом.Нажмите на проект, чтобы просмотреть полный альбом с фотоотчетом.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {projects.map((project) => (
              <article key={project._id} onClick={() => { setSelectedAlbum(project); setActiveIndex(0); }} className="group cursor-pointer">
                {/* РАМКА И СКРУГЛЕНИЕ ДЛЯ КАРТОЧКИ */}
                <div className="relative overflow-hidden bg-white  rounded-xl border border-primary/10 mb-8 aspect-[16/10] shadow-sm group-hover:shadow-md transition-shadow">
                    <div className="w-full h-full overflow-hidden rounded-lg">
                      <img 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                        src={project.coverImage} 
                        alt={project.title} 
                      />
                    </div>
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <div className="bg-white/90 px-6 py-3 shadow-2xl rounded-sm">
                          <span className="font-headline font-black uppercase text-xs tracking-widest text-primary italic">Смотреть</span>
                      </div>
                    </div>
                </div>
                <h3 className="font-headline text-2xl font-black uppercase tracking-tighter text-primary group-hover:text-secondary transition-colors">{project.title}</h3>
              </article>
            ))}
          </div>
        </>
      )}
    </div>

    {/* LIGHTBOX */}
    {selectedAlbum && (
      <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-between py-10 px-4 animate-in fade-in duration-300" onClick={() => setSelectedAlbum(null)}>
        <button onClick={() => setSelectedAlbum(null)} className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors text-3xl font-light">✕</button>
        <div className="relative w-full max-w-5xl h-[60vh] md:h-[70vh] flex items-center justify-center" onClick={e => e.stopPropagation()}>
          <img src={selectedAlbum.images[activeIndex]} className="max-w-full max-h-full object-contain animate-in zoom-in-95 duration-500 shadow-2xl rounded-lg" alt="Full view" />
          {selectedAlbum.images.length > 1 && (
            <>
              <button onClick={() => setActiveIndex(p => p > 0 ? p - 1 : selectedAlbum.images.length - 1)} className="absolute left-2 md:-left-20 p-4 text-white/20 hover:text-white transition-colors text-5xl md:text-7xl font-thin">←</button>
              <button onClick={() => setActiveIndex(p => p < selectedAlbum.images.length - 1 ? p + 1 : 0)} className="absolute right-2 md:-right-20 p-4 text-white/20 hover:text-white transition-colors text-5xl md:text-7xl font-thin">→</button>
            </>
          )}
        </div>
        <div className="w-full max-w-4xl flex flex-col items-center gap-6" onClick={e => e.stopPropagation()}>
          <div className="text-center text-white">
            <h2 className="font-headline text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none">{selectedAlbum.title}</h2>
            <p className="text-white/40 text-[10px] font-mono tracking-[0.3em] mt-3 uppercase">{activeIndex + 1} / {selectedAlbum.images.length}</p>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4 max-w-full px-4">
            {selectedAlbum.images.map((img, idx) => (
              <button 
                key={idx} 
                onClick={() => setActiveIndex(idx)} 
                /* СКРУГЛЕНИЕ И РАМКА ДЛЯ МИНИАТЮР */
                className={`relative flex-shrink-0 w-20 h-14 md:w-28 md:h-18 transition-all duration-300 rounded-md overflow-hidden border-2 ${
                  activeIndex === idx ? 'border-primary opacity-100 scale-105' : 'border-white/10 opacity-30 hover:opacity-100 grayscale'
                }`}
              >
                <img src={img} className="w-full h-full object-cover" alt="thumb" />
              </button>
            ))}
          </div>
        </div>
      </div>
    )}
  </section>
  );
}

export default Galery;
