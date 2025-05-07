import React, { forwardRef } from 'react';

export interface ProcessStep {
  icon: string;
  title: string;
  description: string;
  color: string;
  accent: string;
}

interface ProcessStepCardProps {
  step: ProcessStep;
  index: number;
}

const ProcessStepCard = forwardRef<HTMLDivElement, ProcessStepCardProps>(
  ({ step, index }, ref) => {
    return (
      <div
        ref={ref}
        className='w-full sm:w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-4'
      >
        <div
          className='bg-white/80 backdrop-blur-lg rounded-xl shadow-xl p-8 md:p-12 border border-[#DCD2C8]/50 transition-all duration-300 hover:shadow-2xl'
          style={{
            background: `linear-gradient(135deg, white 0%, ${step.color}20 100%)`,
            borderImage: `linear-gradient(to right, ${step.accent}40, transparent) 1`,
          }}
        >
          <div className='flex flex-col items-center text-center gap-4'>
            {/* First row: Icon + Number */}
            <div className='flex items-center justify-center gap-3'>
              <div
                className='w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 shadow-inner'
                style={{
                  background: `linear-gradient(135deg, white, ${step.color}60)`,
                  boxShadow: `0 6px 15px -3px ${step.accent}30`,
                }}
              >
                <span
                  className='flex items-center justify-center rounded-full w-10 h-10 text-xl font-medium'
                  style={{
                    background: `${step.accent}20`,
                    color: step.accent,
                  }}
                >
                  {index + 1}
                </span>
                <span className='text-4xl filter drop-shadow-sm'>
                  {step.icon}
                </span>
              </div>
            </div>

            {/* Second row: Header */}
            <h3
              className='text-2xl md:text-3xl font-light'
              style={{ color: step.accent }}
            >
              {step.title}
            </h3>

            {/* Third row: Description */}
            <p className='text-gray-700 leading-relaxed text-lg'>
              {step.description}
            </p>
          </div>
        </div>
      </div>
    );
  },
);

export default ProcessStepCard;
