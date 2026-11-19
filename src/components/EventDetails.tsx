import { CalendarDays, Clock3, MapPin } from "lucide-react";

const details = [
  { icon: CalendarDays, label: "Fecha", value: "Viernes 4 de diciembre de 2026" },
  { icon: Clock3, label: "Horario", value: "2:00 PM – 8:30 PM" },
  { icon: MapPin, label: "Lugar", value: "Campus UTEC" },
];

export default function EventDetails() {
  return (
    <section className="relative z-20 mx-auto -mt-12 max-w-7xl px-5 lg:px-8">
      <div className="grid overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-2xl shadow-sky-950/10 md:grid-cols-3">
        {details.map(({ icon: Icon, label, value }, index) => (
          <div
            key={label}
            className={`flex items-center gap-4 px-6 py-7 ${
              index > 0 ? "border-t border-sky-100 md:border-l md:border-t-0" : ""
            }`}
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-sky-100 text-sky-700">
              <Icon size={22} />
            </span>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-sky-500">{label}</p>
              <p className="mt-1 font-bold text-sky-950">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
