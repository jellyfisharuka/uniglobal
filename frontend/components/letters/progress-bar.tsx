interface ProgressBarProps {
    currentStep: number
    totalSteps?: number
}

export function ProgressBar({ currentStep, totalSteps = 6 }: ProgressBarProps) {
    return (
        <div className="flex gap-3 mb-12">
            {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                    key={index}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${index + 1 <= currentStep ? "bg-[#000066]" : "bg-gray-200"}`}
                />
            ))}
        </div>
    )
}