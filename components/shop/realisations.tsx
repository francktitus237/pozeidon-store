const WORKS = [
  { city: "Douala", label: "villa" },
  { city: "Kribi", label: "hôtel" },
  { city: "Bertoua", label: "ONG" },
  { city: "Yaoundé", label: "bureau" },
];

export function Realisations() {
  return (
    <section>
      <h2 className="mb-4 text-xl font-bold text-navy-900">
        Nos réalisations
      </h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {WORKS.map((w) => (
          <div
            key={w.city}
            className="flex aspect-[4/3] flex-col items-center justify-center rounded-lg border bg-sky-50 text-sm"
          >
            <span className="font-semibold text-navy-900">{w.city}</span>
            <span className="text-muted-foreground">{w.label}</span>
            {/* TODO: photos réelles des chantiers */}
          </div>
        ))}
      </div>
    </section>
  );
}
