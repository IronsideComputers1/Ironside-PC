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
          'flex items-center pl-4 font-Arimo text-xs w-[106px] h-7 px-2 rounded-[42px] justify-between cursor-pointer border text-secondary shadow-[0_8px_7px_0_hsla(0,0%,0%,0.05)]!',
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
        {renderColorName(data).split(',')[0]}
        <span className="arrow">
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
