import React, { useState } from 'react'
import { BottomSheet } from './BottomSheet'
import DropdownArrow from '@components/icons/DropdownArrow'
import CustomizerButton from './CustomizerButton'
import { SaveBuildButton } from './SaveBuildButton'
import classNames from 'classnames'
import Image from 'next/image'
import { useGetTheme } from '@components/ui/DarkMode/DarkMode'
import SaveBuildModal, {
  SaveBuildContent,
} from '@components/ui/SaveBuildModal/SaveBuildModal'

type FixedBottomBarProps = {
  warranty?: string
  shippingDate: string
  totalPrice: string
  children?: React.ReactNode
  className?: string
  isIncompatible?: boolean
  isLoading?: boolean
  isDisabled?: boolean
  onAddToCart: () => void
  onSaveBuild: () => void
  saveMyBuildModal?: any
  setSaveMyBuildModal?: any
  saveMyBuildData?: {
    url: any
    options: any
    totalPrice: any
    productDescription: any
    productImage: any
  }
  installmentsPrice: number
}

type ActionButtonsProps = {
  isIncompatible?: boolean
  onAddToCart: () => void
  onSaveBuild: () => void
  isLoading?: boolean
  isDisabled?: boolean
  hideSave?: boolean
  saveMyBuildData?: {
    url: any
    options: any
    totalPrice: any
    productDescription: any
    productImage: any
  }
  saveMyBuildModal?: any
  setSaveMyBuildModal?: any
}

const ActionButtons = ({
  isIncompatible,
  onAddToCart,
  onSaveBuild,
  isLoading,
  isDisabled,
  hideSave = false,
  saveMyBuildData,
}: ActionButtonsProps) => {
  const [showSaveMyBuild, setShowSaveMyBuild] = useState(false)
  return (
    <div
      className={classNames('flex items-center justify-between gap-2', {
        'w-full': hideSave,
      })}
    >
      <CustomizerButton
        className={classNames({
          'w-full': hideSave,
        })}
        isIncompatible={isIncompatible}
        onClick={onAddToCart}
        isLoading={isLoading}
        isDisabled={isDisabled}
      >
        Add to Cart
      </CustomizerButton>

      <div className="md:hidden">
        <BottomSheet
          content={
            <SaveBuildContent
              url={saveMyBuildData?.url}
              options={saveMyBuildData?.options}
              totalPrice={saveMyBuildData?.totalPrice}
              productDescription={saveMyBuildData?.productDescription}
              productImage={saveMyBuildData?.productImage}
            />
          }
        >
          {!hideSave && <SaveBuildButton onClick={onSaveBuild} />}
        </BottomSheet>
      </div>
      {!hideSave && (
        <div className="hidden md:block">
          <SaveBuildButton
            onClick={() => {
              onSaveBuild()
              setShowSaveMyBuild(true)
            }}
          />
        </div>
      )}
      {showSaveMyBuild && (
        <div className="hidden md:block">
          <SaveBuildModal
            onClose={() => setShowSaveMyBuild(false)}
            url={saveMyBuildData?.url}
            options={saveMyBuildData?.options}
            totalPrice={saveMyBuildData?.totalPrice}
            productDescription={saveMyBuildData?.productDescription}
            productImage={saveMyBuildData?.productImage}
          />
        </div>
      )}
    </div>
  )
}

const DesktopBottomBar = ({
  warranty,
  shippingDate,
  totalPrice,
  isIncompatible,
  onAddToCart,
  onSaveBuild,
  isLoading,
  isDisabled,
  saveMyBuildData,
  installmentsPrice,
}: FixedBottomBarProps) => {
  return (
    <div className="hidden md:flex md:gap-10">
      <div className="flex items-start justify-between w-full flex-col md:flex-row md:gap-10">
        <div className="flex items-start justify-center gap-9 text-center flex-row-reverse md:flex-row w-full md:justify-between">
          <Item label="Warranty" value={warranty} />
          <Item label="Ships" value={shippingDate} />
          {/* TODO: Do we have installments on desktop? */}
          <Item label="Total" value={totalPrice} valueClassName="mb-0">
            <div id="bread-checkout-btn" />
            <InstallmentsItem installmentsPrice={installmentsPrice} />
          </Item>
        </div>
        <ActionButtons
          isIncompatible={isIncompatible}
          onAddToCart={onAddToCart}
          onSaveBuild={onSaveBuild}
          isLoading={isLoading}
          isDisabled={isDisabled}
          saveMyBuildData={saveMyBuildData}
        />
      </div>
    </div>
  )
}

const InstallmentsItem = ({
  installmentsPrice,
}: {
  installmentsPrice: number
}) => (
  <span className="font-Inconsolata text-[13px] text-basicDark -mt-0.5 pl-0.5">
    or{' '}
    <span className="text-basicDark pb-[0.5px] border-b-[1px] border-current md:border-none">
      ${installmentsPrice}/month
    </span>
  </span>
)

const Item = ({
  label = '',
  value = '',
  children,
  labelClassName,
  valueClassName,
  className,
}: {
  label?: string
  value?: string
  children?: React.ReactNode
  labelClassName?: string
  valueClassName?: string
  className?: string
}) => {
  return (
    <div className={className}>
      <label
        className={classNames(
          'text-[13px] text-primary-2 font-Arimo',
          labelClassName
        )}
      >
        {label}
      </label>
      <span
        className={classNames(
          'text-2xl text-secondary leading-6 font-bold font-Arimo block my-1.5',
          valueClassName
        )}
      >
        {value}
      </span>
      {children}
    </div>
  )
}

const MobileBottomBar = ({
  warranty,
  shippingDate,
  totalPrice,
  isIncompatible,
  onAddToCart,
  onSaveBuild,
  isLoading,
  isDisabled,
  saveMyBuildData,
  installmentsPrice,
}: FixedBottomBarProps) => {
  const theme = useGetTheme()
  return (
    <div className="px-4">
      <div className="flex items-start justify-between w-full flex-col mb-7">
        <div className="flex items-start justify-center gap-9 text-center flex-row-reverse w-full mb-5 -ml-0.5">
          <Item label="Warranty" value={warranty} />
          <Item label="Ships by" value={shippingDate} />
          <Item label="Total" value={totalPrice} valueClassName="mb-0">
            <div id="bread-checkout-btn" />
            <InstallmentsItem installmentsPrice={installmentsPrice} />
          </Item>
        </div>
        <div className="flex items-center flex-col px-2 py-4 bg-accents-12 rounded-lg">
          <Image
            src={
              theme === 'dark' ? '/bread-pay-white.png' : '/bread-pay-black.png'
            }
            alt="Bread Pay"
            width={165}
            height={42}
          />
          <ul className="flex flex-col mt-5">
            <li className="list-disc font-Arimo text-secondary text-xs">
              Pay over time with Bread Pay™
            </li>
            <br />
            <li className="list-disc font-Arimo text-secondary text-xs">
              Clear, transparent terms. Fair rates. No prepayment penalties.
            </li>
            <br />
            <li className="list-disc font-Arimo text-secondary text-xs">
              Check Bread Pay™{' '}
              <a
                className="font-Arimo text-secondary text-xs underline"
                href="https://payments.breadfinancial.com/help-center/"
                target="_blank"
              >
                FAQ
              </a>{' '}
              or reach Bread Pay™ directly at support@getbread.com or (844)
              992-7323 ext. 1
            </li>
          </ul>
          <a className="font-Arimo text-xs underline">Learn More</a>
        </div>
      </div>
      <div className="pb-16">
        <ActionButtons
          isIncompatible={isIncompatible}
          onAddToCart={onAddToCart}
          onSaveBuild={onSaveBuild}
          isLoading={isLoading}
          isDisabled={isDisabled}
          saveMyBuildData={saveMyBuildData}
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
    saveMyBuildData,
    installmentsPrice,
  } = props
  return (
    <div
      className={classNames(
        'fixed bottom-0 flex items-start justify-between py-6 pl-5 pr-2 text-center gap-10 border-top left-[unset]',
        'xxs:pr-2 xxs:left-0 xxs:right-0',
        'sm:pr-2 sm:left-0 sm:right-0',
        'md:right-[12%] md:left-[12%] md:justify-center',
        'lg:pr-20',
        'xxl:justify-end xxl:left-[55%]'
      )}
      style={{
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Desktop */}
      <DesktopBottomBar {...props} />
      {/* Mobile */}
      <div className="flex items-start justify-between w-full md:hidden">
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
              installmentsPrice={installmentsPrice}
            />
          }
        >
          <div className="flex items-start flex-col">
            <div className="flex items-center justify-between gap-2.5">
              <Item
                value={totalPrice}
                valueClassName="text-[16px] mb-0"
                className="flex"
              />
              <span className="transform rotate-180 pb-1">
                <DropdownArrow width={14} height={16} />
              </span>
            </div>
            <InstallmentsItem installmentsPrice={installmentsPrice} />
          </div>
        </BottomSheet>
        <ActionButtons
          isIncompatible={isIncompatible}
          onAddToCart={onAddToCart}
          onSaveBuild={onSaveBuild}
          isLoading={isLoading}
          isDisabled={isDisabled}
          saveMyBuildData={saveMyBuildData}
        />
      </div>
    </div>
  )
}
