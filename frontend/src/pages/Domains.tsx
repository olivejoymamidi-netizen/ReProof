import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockDomains } from '../data/mockData';

export const Domains: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDomainId, setSelectedDomainId] = useState<string>('01');

  const activeDomain =
    mockDomains.find((d) => d.id === selectedDomainId) || mockDomains[0];

  const handleStartAssessment = (domainId: string) => {
    setSelectedDomainId(domainId);
    navigate('/assessment');
  };

  return (
    <div className="min-h-[calc(100vh-130px)] flex flex-col justify-between bg-[#FAF9F6] text-graphite-900 pb-16">
      <main className="max-w-[1440px] mx-auto w-full px-6 sm:px-10 py-10 sm:py-14 flex flex-col justify-start">
        {/* Header Intent Block */}
        <div className="pb-10 sm:pb-12 border-b border-ivory-300">
          <div className="flex items-center space-x-2 text-[11px] font-mono tracking-widest text-graphite-500 uppercase mb-4">
            <span className="inline-block w-1.5 h-1.5 bg-cobalt-700"></span>
            <span>Competency Matrix // Verification Entry</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-[-0.04em] text-graphite-900 uppercase leading-[0.95] mb-4">
            What do you want to prove?
          </h1>

          <p className="text-base sm:text-lg text-graphite-600 max-w-2xl font-normal leading-relaxed">
            Choose a competency domain to begin your assessment. Evaluation sandboxes instantiate immediately upon domain authorization.
          </p>
        </div>

        {/* Domain Selection List / Editorial Rows (5 Domains) */}
        <section
          className="mt-6 border-b border-ivory-300 divide-y divide-ivory-300"
          id="domains-container"
          aria-label="Available Competency Domains"
        >
          {mockDomains.map((domain) => {
            const isSelected = domain.id === selectedDomainId;

            return (
              <div
                key={domain.id}
                onClick={() => setSelectedDomainId(domain.id)}
                className={`group cursor-pointer py-7 sm:py-8 px-4 sm:px-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-all duration-200 relative ${
                  isSelected ? 'bg-[#F2F1ED]' : 'hover:bg-ivory-200 hover:translate-x-1'
                }`}
                tabIndex={0}
                role="button"
                aria-pressed={isSelected}
              >
                {/* Left Active Accent Bar */}
                {isSelected && (
                  <span className="absolute left-0 top-0 bottom-0 w-1 bg-cobalt-700" />
                )}

                <div className="flex flex-col sm:flex-row sm:items-baseline gap-4 sm:gap-8 flex-1">
                  <span
                    className={`font-mono text-xs sm:text-sm font-semibold tracking-wider ${
                      isSelected ? 'text-cobalt-700' : 'text-graphite-400 group-hover:text-cobalt-700'
                    }`}
                  >
                    {domain.code}
                  </span>

                  <div className="space-y-1">
                    <h2
                      className={`text-2xl sm:text-3xl font-extrabold uppercase tracking-tight transition-colors ${
                        isSelected
                          ? 'text-cobalt-700'
                          : 'text-graphite-900 group-hover:text-cobalt-700'
                      }`}
                    >
                      {domain.name}
                    </h2>

                    <p className="text-sm sm:text-base text-graphite-600 font-normal leading-relaxed">
                      {domain.description}
                    </p>

                    <div className="text-[11px] font-mono text-graphite-400 pt-1">
                      Topics: {domain.subtopics}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-10 shrink-0">
                  <span className="text-xs font-mono uppercase tracking-wider text-graphite-500">
                    Stage Status:{' '}
                    <span className="font-semibold text-graphite-900">Ready</span>
                  </span>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                        isSelected
                          ? 'text-cobalt-700'
                          : 'text-graphite-700 group-hover:text-cobalt-700'
                      }`}
                    >
                      <span>{isSelected ? 'Selected' : 'Select Domain'}</span>
                      <span className="text-sm">&rarr;</span>
                    </span>

                    <div
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'border-cobalt-700 bg-cobalt-700'
                          : 'border-graphite-400 group-hover:border-cobalt-700'
                      }`}
                    >
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Selected Domain Authorization Bar */}
        <div className="mt-10 p-6 sm:p-8 bg-white border border-ivory-300 flex flex-col sm:flex-row sm:items-center justify-between gap-6 rounded-[2px]">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-cobalt-700 font-semibold">
              <span>ACTIVE SELECTION:</span>
              <span className="text-graphite-900 font-bold">
                {activeDomain.code} // {activeDomain.name}
              </span>
            </div>
            <p className="text-xs text-graphite-500">
              Provisioning isolated Linux runtime sandbox with benchmark criteria protocol.
            </p>
          </div>

          <button
            onClick={() => handleStartAssessment(activeDomain.id)}
            className="px-8 py-4 bg-cobalt-700 hover:bg-cobalt-900 text-white font-mono text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-3 shrink-0 cursor-pointer rounded-[2px]"
          >
            <span>Start Initial Assessment</span>
            <span>&rarr;</span>
          </button>
        </div>
      </main>
    </div>
  );
};
