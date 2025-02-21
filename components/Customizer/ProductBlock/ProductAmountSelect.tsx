import DropdownArrow from '@components/icons/DropdownArrow'
import { useGetTheme } from '@components/ui/DarkMode/DarkMode'
import classNames from 'classnames'

type ProductAmountSelectProps = {
  data: any
  index: number
  setToggle: (toggle: boolean) => void
  setToggleIndex: (index: string) => void
  selectedIds: any
  modalData: any
  renderColorName: (data: any) => string
  renderPrice: (data: any) => JSX.Element
}

export const ProductAmountSelect = ({
  data,
  index,
  setToggle,
  setToggleIndex,
  selectedIds,
  modalData,
  renderColorName,
  renderPrice,
}: ProductAmountSelectProps) => {
  const { theme } = useGetTheme();
  if (data?.customFields?.edges?.length < 2) return null;
  return (
    <>
      <button
        className={classNames(
          'flex items-center justify-between pl-4 font-Arimo text-xs w-[106px] h-7 px-2 rounded-[42px] cursor-pointer border text-secondary shadow-[0_8px_7px_0_hsla(0,0%,0%,0.05)]!',
          'hover:border-secondary hover:text-secondary',
          {
            'border-dark': theme === 'dark',
            'border-light': theme === 'light',
          }
        )}
        onClick={() => {
          setToggle(true)
          setToggleIndex(index.toString())
        }}
      >
        <span className='flex-grow'>
          {renderColorName(data).split(',')[0]}
        </span>
        <span className="arrow ml-auto">
          <DropdownArrow />
        </span>
      </button>
      <span className='font-Arimo font-bold'>
        {!selectedIds?.some(
          (product: any) =>
            product?.product === data?.entityId &&
            product?.cat === modalData?.categoryName
        ) && renderPrice(data)}
      </span>
    </>
  )
}
