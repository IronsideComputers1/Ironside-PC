import React from 'react'

type FixedBottomBarProps = {
  warranty?: string;
  shippingDate: string;
  totalPrice: string;
  children: React.ReactNode;
}

export const FixedBottomBar = ({
  warranty,
  shippingDate,
  totalPrice,
  children,
}: FixedBottomBarProps) => {
  return (
    <div
      className="flex right-0 left-0 items-start justify-between fixed md:right-0.5 md:left-[55%] bottom-0 py-6 pl-5 pr-8 border-top text-center gap-10 xxl:justify-end lg:justify-center xxl:left-[55%]"
      style={{
        backdropFilter: "blur(10px)",
      }}
    >
      <div className='hidden md:flex md:gap-10'>
        <div>
          <label className='text-[13px] text-primary-2 font-Arimo'>Warranty</label>
          <span className="text-2xl leading-6 font-bold font-heading block my-1.5">{warranty}</span>
        </div>
        <div>
          <label className='text-[13px] text-primary-2 font-Arimo'>Ships by</label>
          <span className="text-2xl leading-6 font-bold font-heading block my-1.5">
            {shippingDate}
          </span>
        </div>
      </div>
      <div>
        <label className='text-[13px] text-primary-2 font-Arimo hidden md:block'>Total</label>
        {/* DemoID to render breadPay placement */}
        <span className="text-[16px] md:text-2xl leading-6 font-bold font-heading block my-1.5">
          {totalPrice}
        </span>
        <div id="bread-checkout-btn" />
      </div>
      <div className='flex items-center justify-between gap-2'>
        {children}
      </div>
    </div>
  )
}
