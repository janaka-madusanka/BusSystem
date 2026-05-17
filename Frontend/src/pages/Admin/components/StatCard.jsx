export default function StatCard({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0f1520] p-5 shadow-lg hover:border-[#4f8ef7]/40 transition-all">
      
      <div className="flex items-center gap-3 text-slate-400">
        <Icon className="h-5 w-5 text-[#4f8ef7]" />

        <span className="text-xs uppercase tracking-wider">
          {label}
        </span>
      </div>

      <h3 className="mt-3 text-3xl font-bold text-white">
        {value}
      </h3>
    </div>
  );
}