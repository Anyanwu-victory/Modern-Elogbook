interface StepIndicatorProps {
    currentStep: number
    totalSteps: number
  }
  
  export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
    return (
      <div className="flex items-center justify-center space-x-2 py-4">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`h-2 w-16 rounded-full ${
              index + 1 === currentStep ? "bg-primary" : index + 1 < currentStep ? "bg-primary/60" : "bg-muted"
            }`}
          />
        ))}
      </div>
    )
  }
  