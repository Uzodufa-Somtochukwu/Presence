export default function ProgressStepper({ currentStep = 1, totalSteps = 3 }) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div
      className="flex items-center justify-center gap-3 sm:gap-4 my-4"
      aria-label={`Step ${currentStep} of ${totalSteps}`}
    >
      {steps.map((step, idx) => {
        const isActive = step === currentStep;
        const isPast = step < currentStep;

        return (
          <div key={step} className="flex items-center">
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-semibold tracking-wider transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-br from-[#b96851] to-[#e4c887] text-[#173a34] font-bold shadow-md shadow-[#b96851]/20 ring-4 ring-[#e4c887]/20 scale-110'
                  : isPast
                  ? 'bg-[#a8b698]/30 dark:bg-[#a8b698]/20 text-[#263632] dark:text-[#f4eee5] border border-[#a8b698]/50'
                  : 'bg-black/5 dark:bg-white/5 text-[#5d6761] border border-black/10 dark:border-white/10'
              }`}
            >
              0{step}
            </div>

            {idx < steps.length - 1 && (
              <div
                className={`w-8 sm:w-12 h-0.5 mx-2 rounded transition-colors duration-300 ${
                  isPast
                    ? 'bg-[#a8b698]'
                    : 'bg-black/10 dark:bg-white/10'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
