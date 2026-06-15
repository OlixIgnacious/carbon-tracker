export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <section>
        <h1 className="text-3xl font-bold text-carbon-100 tracking-tight">
          About & Methodology
        </h1>
        <p className="text-carbon-400 mt-1">
          How we calculate your carbon footprint
        </p>
      </section>

      {/* Overview */}
      <section className="glass-card p-6 space-y-4">
        <h2 className="text-xl font-semibold text-carbon-200">How It Works</h2>
        <p className="text-sm text-carbon-400 leading-relaxed">
          Carbon Tracker calculates your personal carbon footprint by multiplying your daily activity
          data (distance traveled, energy consumed, food eaten) by scientifically-sourced
          <strong className="text-carbon-300"> emission factors</strong> — expressed in kg CO₂e (carbon dioxide equivalent).
        </p>
        <p className="text-sm text-carbon-400 leading-relaxed">
          CO₂e includes not just carbon dioxide but also other greenhouse gases like methane (CH₄)
          and nitrous oxide (N₂O), converted using IPCC Global Warming Potential (GWP) values.
        </p>
      </section>

      {/* Transport Factors */}
      <section className="glass-card p-6 space-y-4">
        <h2 className="text-xl font-semibold text-carbon-200">🚗 Transport Emission Factors</h2>
        <p className="text-xs text-carbon-500 mb-3">
          Source: UK Government DEFRA/DESNZ Greenhouse Gas Conversion Factors 2024
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-carbon-400 border-b border-white/5">
                <th className="pb-2 pr-4">Mode</th>
                <th className="pb-2 text-right">Factor (kg CO₂e/km)</th>
              </tr>
            </thead>
            <tbody className="text-carbon-300">
              {[
                ['Petrol Car', '0.170'],
                ['Diesel Car', '0.170'],
                ['Electric Car', '0.040'],
                ['Motorcycle', '0.110'],
                ['Bus (local)', '0.100'],
                ['Train (national rail)', '0.040'],
                ['Short-haul Flight (economy)', '0.130'],
                ['Long-haul Flight (economy)', '0.110'],
                ['Bicycle / Walking', '0.000'],
              ].map(([mode, factor]) => (
                <tr key={mode} className="border-b border-white/3">
                  <td className="py-2 pr-4">{mode}</td>
                  <td className="py-2 text-right font-mono text-emerald-400">{factor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Energy Factors */}
      <section className="glass-card p-6 space-y-4">
        <h2 className="text-xl font-semibold text-carbon-200">⚡ Energy Emission Factors</h2>
        <p className="text-xs text-carbon-500 mb-3">
          Source: UK Government DEFRA/DESNZ 2024
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-carbon-400 border-b border-white/5">
                <th className="pb-2 pr-4">Source</th>
                <th className="pb-2 text-right">Factor</th>
                <th className="pb-2 text-right">Unit</th>
              </tr>
            </thead>
            <tbody className="text-carbon-300">
              {[
                ['Electricity (UK grid)', '0.225', 'kg CO₂e/kWh'],
                ['Natural Gas', '0.183', 'kg CO₂e/kWh'],
                ['Water (supply + treatment)', '0.421', 'kg CO₂e/m³'],
              ].map(([source, factor, unit]) => (
                <tr key={source} className="border-b border-white/3">
                  <td className="py-2 pr-4">{source}</td>
                  <td className="py-2 text-right font-mono text-emerald-400">{factor}</td>
                  <td className="py-2 text-right text-carbon-500">{unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Food Factors */}
      <section className="glass-card p-6 space-y-4">
        <h2 className="text-xl font-semibold text-carbon-200">🍽️ Food Emission Factors</h2>
        <p className="text-xs text-carbon-500 mb-3">
          Source: Poore & Nemecek (2018), &quot;Reducing food&apos;s environmental impacts through producers
          and consumers&quot;, <em>Science</em>, Vol 360, Issue 6392. DOI: 10.1126/science.aaq0216.
          Values are cradle-to-retail lifecycle averages from ~38,700 farms globally.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-carbon-400 border-b border-white/5">
                <th className="pb-2 pr-4">Food</th>
                <th className="pb-2 text-right">Factor (kg CO₂e/kg)</th>
              </tr>
            </thead>
            <tbody className="text-carbon-300">
              {[
                ['Beef', '27.0'],
                ['Lamb', '24.0'],
                ['Cheese', '13.5'],
                ['Pork', '7.6'],
                ['Chicken', '6.9'],
                ['Fish (farmed)', '6.0'],
                ['Eggs', '4.7'],
                ['Rice', '4.0'],
                ['Milk', '3.2'],
                ['Vegetables', '2.0'],
                ['Fruits', '1.1'],
                ['Legumes', '0.9'],
              ].map(([food, factor]) => (
                <tr key={food} className="border-b border-white/3">
                  <td className="py-2 pr-4">{food}</td>
                  <td className="py-2 text-right font-mono text-emerald-400">{factor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Privacy */}
      <section className="glass-card p-6 space-y-3">
        <h2 className="text-xl font-semibold text-carbon-200">🔒 Privacy</h2>
        <p className="text-sm text-carbon-400 leading-relaxed">
          All your data is stored <strong className="text-carbon-300">locally in your browser</strong> using
          localStorage. Nothing is sent to any server unless you explicitly request AI-powered insights,
          in which case only aggregated emission summaries (not individual activities) are sent to the
          Google Gemini API for analysis.
        </p>
      </section>

      {/* Tech Stack */}
      <section className="glass-card p-6 space-y-3">
        <h2 className="text-xl font-semibold text-carbon-200">🛠️ Tech Stack</h2>
        <ul className="text-sm text-carbon-400 space-y-1.5">
          <li>• <strong className="text-carbon-300">Framework:</strong> Next.js 15 (App Router)</li>
          <li>• <strong className="text-carbon-300">Language:</strong> TypeScript</li>
          <li>• <strong className="text-carbon-300">Styling:</strong> Tailwind CSS v4</li>
          <li>• <strong className="text-carbon-300">Charts:</strong> Chart.js v4 with react-chartjs-2</li>
          <li>• <strong className="text-carbon-300">AI:</strong> Google Gemini API (via server-side Route Handler)</li>
          <li>• <strong className="text-carbon-300">Storage:</strong> Browser localStorage</li>
          <li>• <strong className="text-carbon-300">Testing:</strong> Vitest + React Testing Library</li>
        </ul>
      </section>
    </div>
  );
}
