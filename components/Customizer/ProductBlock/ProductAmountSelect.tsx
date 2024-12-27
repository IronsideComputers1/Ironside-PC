import DropdownArrow from '@components/icons/DropdownArrow'

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
  if (data?.customFields?.edges?.length < 2) return null;
  return (
    <>
      <button
        className="multiColorOption items-center pl-4 grid grid-cols-3 w-available pr-2.5 h-7 py-1"
        style={{
          justifyContent: 'center',
        }}
        onClick={() => {
          setToggle(true)
          setToggleIndex(index.toString())
        }}
      >
        <span className='col-span-2 inline-flex items-center justify-end mr-1.5'>
          {renderColorName(data).split(',')[0]}
        </span>
        <span className="arrow col-span-1 flex items-center justify-end">
          <DropdownArrow />
        </span>
      </button>
      {!selectedIds?.some(
        (product: any) =>
          product?.product === data?.entityId &&
          product?.cat === modalData?.categoryName
      ) && renderPrice(data)}
    </>
  )
}
