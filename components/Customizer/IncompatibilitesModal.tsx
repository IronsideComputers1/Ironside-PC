import React from 'react'
import classNames from 'classnames'
import { Button } from '@components/ui'
import { Cross } from '@components/icons'
import WrongPasswordIcon from '@components/icons/WrongPassword'
import { useGetTheme } from '@components/ui/DarkMode/DarkMode'
import HealthIcon from '@components/icons/Health'

const IncompatibilitesModal = ({
  incompatibleProducts,
  selectedIds,
  setIncompatibleModal,
  scrollToElement,
}: any) => {
  return (
    <div className="modal incompatibilites-modal">
      <div
        className={classNames(
          'w-full flex items-center justify-between text-gray-500 h-10 pl-4'
        )}
      >
        <p
          className="m-0 font-medium font-Inconsolata"
          style={{ color: 'rgba(255, 112, 112, 1)' }}
        ></p>
        <button
          onClick={() => setIncompatibleModal(false)}
          aria-label="Close panel"
          className="m-6 border w-7 h-7 px-2 rounded-full flex items-center justify-center mr-3 hover:text-gray-500 transition ease-in-out duration-150 focus:outline-none right-0 top-0"
        >
          <Cross className="h-3 w-3 fill-current" />
        </button>
      </div>

      <div className="flex items-center justify-start flex-col h-auto">
        <div className="flex items-center justify-start flex-col mt-0 mb-9 gap-3">
          <HealthIcon width={45} height={45} />
          <p className="mb-0 font-Arimo font-bold text-base text-center transform-none">
            Incompatible Components Selected
          </p>
        </div>

        {Object.keys(incompatibleProducts)?.map((ele) =>
          selectedIds?.map((prods: any) => {
            if (parseInt(ele) === prods?.product_id) {
              return incompatibleProducts[ele][1]?.map((incompat: any) =>
                selectedIds?.map((data: any) => {
                  if (data?.product_id === incompat?.product_id) {
                    return (
                      <div className="incompatibilites-list">
                        <div className="buttons">
                          <Button
                            type="button"
                            className="btn add-to-cart"
                            onClick={() => {
                              scrollToElement(
                                prods?.category_name.toLowerCase()
                              )
                              setIncompatibleModal(false)
                            }}
                          >
                            Change {prods?.category_name}
                          </Button>
                          <Button
                            type="button"
                            className="btn add-to-cart"
                            onClick={() => {
                              scrollToElement(data?.category_name.toLowerCase())
                              setIncompatibleModal(false)
                            }}
                          >
                            Change {data?.category_name}
                          </Button>
                        </div>
                      </div>
                    )
                  }
                  return null
                })
              )
            }
            return null
          })
        )}
      </div>
    </div>
  )
}

export default IncompatibilitesModal
