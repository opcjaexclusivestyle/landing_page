import React from 'react';
import Link from 'next/link';

type ButtonVariant = 'default' | 'outline' | 'subtle' | 'ghost' | 'link';
type ButtonSize = 'default' | 'sm' | 'lg' | 'xl';
type ButtonWidth = 'default' | 'full';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  width?: ButtonWidth;
  href?: string;
  className?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'default',
      size = 'default',
      width = 'default',
      href,
      children,
      ...props
    },
    ref,
  ) => {
    // Bazowe klasy
    let baseClasses =
      'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

    // Klasy wariantów
    const variantClasses = {
      default: 'bg-[#FCBA04] text-[#1A1A1A] hover:bg-[#FFD54F]',
      outline:
        'border-2 border-[#FCBA04] text-[#D19D00] hover:bg-[#FCBA04] hover:text-[#1A1A1A]',
      subtle: 'bg-[#FCBA04]/20 text-[#D19D00] hover:bg-[#FCBA04]/30',
      ghost: 'hover:bg-[#FCBA04]/10 text-[#D19D00] hover:text-[#D19D00]',
      link: 'text-[#D19D00] underline-offset-4 hover:underline hover:text-[#FCBA04]',
    };

    // Klasy rozmiarów
    const sizeClasses = {
      default: 'h-10 py-2 px-4 text-base',
      sm: 'h-8 px-3 text-sm',
      lg: 'h-12 px-8 text-lg',
      xl: 'h-14 px-10 text-xl',
    };

    // Klasy szerokości
    const widthClasses = {
      default: '',
      full: 'w-full',
    };

    // Łączenie klas
    const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses[width]} ${className}`;

    if (href) {
      return (
        <Link href={href} className={buttonClasses}>
          {children}
        </Link>
      );
    }

    return (
      <button className={buttonClasses} ref={ref} {...props}>
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
