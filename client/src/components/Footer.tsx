function Footer() {
  return (
    <footer className="bg-[#051125] text-white py-12">
      <div className="max-w-[1100px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
          <div className="text-xl font-black uppercase tracking-tighter mb-2">Строительная компания</div>
          <p className="text-slate-400 text-sm">© 2024 Все права защищены.</p>
        </div>
        <div className="flex gap-8 text-sm font-bold uppercase tracking-widest">
          <a href="#" className="hover:text-[#ff8f06] transition-colors">Telegram</a>
          <a href="#" className="hover:text-[#ff8f06] transition-colors">WhatsApp</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
