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
        className="multiColorOption flex items-center pl-4"
        style={{
          justifyContent: 'space-between',
        }}
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
      {!selectedIds?.some(
        (product: any) =>
          product?.product === data?.entityId &&
          product?.cat === modalData?.categoryName
      ) && renderPrice(data)}
    </>
  )
}
