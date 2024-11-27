import cn from 'classnames'
import React, {
  forwardRef,
  ButtonHTMLAttributes,
  JSXElementConstructor,
  useRef,
} from 'react'
import mergeRefs from 'react-merge-refs'
import s from './Button.module.css'
import { LoadingDots } from '@components/ui'
import { useGetTheme } from '../DarkMode/DarkMode'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string
  className?: string
  variant?: 'flat' | 'slim'
  active?: boolean
  type?: 'submit' | 'reset' | 'button'
  Component?: string | JSXElementConstructor<any>
  width?: string | number
  loading?: boolean
  disabled?: boolean
}

const Button: React.FC<ButtonProps> = forwardRef((props, buttonRef) => {
  const {
    className,
    variant = 'flat',
    children,
    active,
    width,
    loading = false,
    disabled = false,
    style = {},
    Component = 'button',
    onClick,
    ...rest
  } = props
  const theme = useGetTheme();
  const ref = useRef<typeof Component>(null);

  const rootClassName = cn(
    s.root,
    {
      [s.slim]: variant === 'slim',
      [s.loading]: loading,
      [s.disabled]: disabled,
    },
    theme === 'dark' ? s.dark : s.light,
    className
  )

  return (
    <Component
      aria-pressed={active}
      data-variant={variant}
      ref={mergeRefs([ref, buttonRef])}
      className={rootClassName}
      disabled={disabled}
      style={{
        width,
        ...style,
      }}
      onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (loading || disabled) {
          e.preventDefault();
          return
        }
        if (onClick) {
          onClick(e);
        }
      }}
      {...rest}
    >
      {children}
      {loading && !disabled && (
        <i className="pl-2">
          <LoadingDots />
        </i>
      )}
    </Component>
  )
})

export default Button
