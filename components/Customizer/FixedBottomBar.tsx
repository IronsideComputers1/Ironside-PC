import React from 'react'
import { BottomSheet } from './BottomSheet';
import DropdownArrow from '@components/icons/DropdownArrow';
import CustomizerButton from './CustomizerButton';
import { SaveBuildButton } from './SaveBuildButton';
import classNames from 'classnames';
import Image from 'next/image';
import { useGetTheme } from '@components/ui/DarkMode/DarkMode';

type FixedBottomBarProps = {
  warranty?: string;
  shippingDate: string;
  totalPrice: string;
  children?: React.ReactNode;
  className?: string;
  isIncompatible?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
  onAddToCart: () => void;
  onSaveBuild: () => void;
}

type ActionButtonsProps = {
  isIncompatible?: boolean;
  onAddToCart: () => void;
  onSaveBuild: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  hideSave?: boolean;
};

const ActionButtons = ({
  isIncompatible,
  onAddToCart,
  onSaveBuild,
  isLoading,
  isDisabled,
  hideSave = false,
}: ActionButtonsProps) => {
  return (
    <div className={classNames('flex items-center justify-between gap-2', {
      'w-full': hideSave,
    })}>
      <CustomizerButton
        className={classNames({
          "w-full": hideSave,
        })}
        isIncompatible={isIncompatible}
        onClick={onAddToCart}
        isLoading={isLoading}
        isDisabled={isDisabled}
      >
        Add to Cart
      </CustomizerButton>
      {!hideSave && <SaveBuildButton onClick={onSaveBuild}/>}
    </div>
  )
}

const DesktopBottomBar = ({
  warranty,
  shippingDate,
  totalPrice,
  children,
  isIncompatible,
  onAddToCart,
  onSaveBuild,
  isLoading,
  isDisabled,
}: FixedBottomBarProps) => {
  return (
    <div className='hidden md:flex md:gap-10'>
      <div className='flex items-start justify-between w-full flex-col md:flex-row md:gap-10'>
        <div className='flex items-start justify-center gap-9 text-center flex-row-reverse md:flex-row w-full md:justify-between'>
          <Item label='Warranty' value={warranty} />
          <Item label='Ships' value={shippingDate} />
          <Item label='Total' value={totalPrice}>
            <div id="bread-checkout-btn" />
          </Item>
        </div>
        <ActionButtons
          isIncompatible={isIncompatible}
          onAddToCart={onAddToCart}
          onSaveBuild={onSaveBuild}
          isLoading={isLoading}
          isDisabled={isDisabled}
        />
      </div>
    </div>
  )
}

const Item = ({
    label = "",
    value = "",
    children,
    labelClassName,
    valueClassName,
    className,
  } : {
    label?: string,
    value?: string,
    children?: React.ReactNode
    labelClassName?: string
    valueClassName?: string
    className?: string
  }) => {
  return (
    <div className={className}>
      <label className={classNames('text-[13px] text-primary-2 font-Arimo', labelClassName)}>{label}</label>
      <span className={classNames("text-2xl text-secondary leading-6 font-bold font-heading block my-1.5", valueClassName)}>{value}</span>
      {children}
    </div>
  )
}

const MobileBottomBar = ({
  warranty,
  shippingDate,
  totalPrice,
  children,
  isIncompatible,
  onAddToCart,
  onSaveBuild,
  isLoading,
  isDisabled,
}: FixedBottomBarProps) => {
  const theme = useGetTheme();
  return (
    <div className='px-4'>
      <div className='flex items-start justify-between w-full flex-col mb-7'>
        <div className='flex items-start justify-center gap-9 text-center flex-row-reverse w-full mb-5'>
          <Item label='Warranty' value={warranty} />
          <Item label='Ships by' value={shippingDate} />
          <Item label='Total' value={totalPrice}>
            <div id="bread-checkout-btn" />
          </Item>
        </div>
        <div className='flex items-center flex-col px-2 py-4 bg-accents-12 rounded-lg'>
          <Image src={theme === "dark" ? "/bread-pay-white.png" : "/bread-pay-black.png"} alt="Bread Pay" width={165} height={42} />
          <ul className='flex flex-col mt-5'>
            <li className='list-disc font-Arimo text-secondary text-xs'>Pay over time with Bread Pay™</li>
            <br/>
            <li className='list-disc font-Arimo text-secondary text-xs'>Clear, transparent terms. Fair rates. No prepayment penalties.</li>
            <br/>
            <li className='list-disc font-Arimo text-secondary text-xs'>
              Check Bread Pay™ <a className='font-Arimo text-secondary text-xs underline' href="https://payments.breadfinancial.com/help-center/" target='_blank'>FAQ</a> or reach Bread Pay™ directly at support@getbread.com or (844) 992-7323 ext. 1
            </li>
          </ul>
          <a className='font-Arimo text-xs underline'>Learn More</a>
        </div>
      </div>
      <div className='pb-16'>
        <ActionButtons
          isIncompatible={isIncompatible}
          onAddToCart={onAddToCart}
          onSaveBuild={onSaveBuild}
          isLoading={isLoading}
          isDisabled={isDisabled}
          hideSave
        />
      </div>
    </div>
  )
}

export const FixedBottomBar = (props: FixedBottomBarProps) => {
  const {
    warranty,
    shippingDate,
    totalPrice,
    isLoading,
    isDisabled,
    isIncompatible,
    onAddToCart,
    onSaveBuild,
  } = props
  return (
    <div
      className="flex right-0 left-0 items-start justify-between fixed md:right-0.5 md:left-[55%] bottom-0 py-6 pl-5 pr-8 border-top text-center gap-10 xxl:justify-end lg:justify-center xxl:left-[55%]"
      style={{
        backdropFilter: "blur(10px)",
      }}
    >
      {/* Desktop */}
      <DesktopBottomBar {...props} />
      {/* Mobile */}
      <div className='flex items-start justify-between w-full md:hidden'>
        <BottomSheet
          content={
            <MobileBottomBar
              warranty={warranty}
              shippingDate={shippingDate}
              totalPrice={totalPrice}
              isIncompatible={isIncompatible}
              onAddToCart={onAddToCart}
              onSaveBuild={onSaveBuild}
              isLoading={isLoading}
              isDisabled={isDisabled}
            />
          }
        >
          <div className='flex items-center justify-between gap-3'>
            <Item value={totalPrice} valueClassName="text-[16px]" className='flex' />
            <span className='transform rotate-180'>
              <DropdownArrow width={14} height={16} />
            </span>
            <div id="bread-checkout-btn" />
          </div>
        </BottomSheet>
        <ActionButtons
          isIncompatible={isIncompatible}
          onAddToCart={onAddToCart}
          onSaveBuild={onSaveBuild}
          isLoading={isLoading}
          isDisabled={isDisabled}
        />
      </div>
    </div>
  )
}
