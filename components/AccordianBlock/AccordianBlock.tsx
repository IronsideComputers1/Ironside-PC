import { Minus, Plus } from '@components/icons'
import axios from 'axios'
import Delete from '../../public/bin'
import { useEffect, useState } from 'react'
import Select from 'react-select'
import { Button } from '@components/ui'
import Pencil from '@components/icons/Pencil'

const AccordianBlock = ({
  title,
  products,
  options,
  incompatible_products,
  accordianIndex,
  totalRules,
  ruleId,
  getData,
  isRuleAdded,
  setIsRuleAdded,
  isOpenAll,
  submitAll,
}: any) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setisLoading] = useState(false)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [tabNameError, setTabNameError] = useState(false)
  const [tabName, setTabName] = useState<string>('')
  const token = localStorage.getItem('jwtToken')
  const toggleAccordion = () => {
    setIsOpen(!isOpen)
    setIsRuleAdded(false)
  }
  const [selectedOptions, setSelectedOptions] = useState<any>([])
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
  useEffect(() => {
    if (products && incompatible_products)
      setSelectedOptions([products, incompatible_products])
  }, [])

  const handleSelectChange = (selectedOption: any, selectIndex: any) => {
    const updateSelection = [...selectedOptions]
    updateSelection[selectIndex] = selectedOption
    submitAll(title, updateSelection)
    setSelectedOptions(updateSelection)
  }
  const filteredArray = options?.filter((item: { product_id: any }) => {
    const idToRemove = selectedOptions
      .flat()
      .map((innerItem: { product_id: any }) => innerItem.product_id)
    return !idToRemove.includes(item.product_id)
  })

  const deletAccordian = async () => {
    try {
      await axios
        .delete(
          `https://fair-conduit-404516.uc.r.appspot.com/iron-side/compositions/${ruleId}`,
          {
            headers,
          }
        )
        .then(
          (response) => {
            if (response.status === 200) {
              getData()
            }
          },
          (error) => {
            console.error(error)
            return
          }
        )
    } catch (error) {
      console.error(error)
      return
    }
  }

  const submitData = async (title: string) => {
    setIsRuleAdded(false)
    const incompatibleData = {
      name: title,
      components: [selectedOptions[0], selectedOptions[1]],
    }
    try {
      setisLoading(true)
      if (ruleId) {
        await axios
          .put(
            `https://fair-conduit-404516.uc.r.appspot.com/iron-side/compositions/${ruleId}`,
            incompatibleData,
            {
              headers,
            }
          )
          .then(
            (response) => {
              if (response.status === 200) {
                getData()
                setisLoading(false)
              }
            },
            (error) => {
              console.error(error)
              setisLoading(false)
              return
            }
          )
      } else {
        await axios
          .post(
            'https://fair-conduit-404516.uc.r.appspot.com/iron-side/compositions',
            incompatibleData,
            {
              headers,
            }
          )
          .then(
            (response) => {
              if (response.status === 200) {
                getData()
                setisLoading(false)
              }
            },
            (error) => {
              console.error(error)
              setisLoading(false)
              return
            }
          )
      }
    } catch (error) {
      setisLoading(false)
      console.error(error)
    }
  }

  const editRuleName = async () => {
    const incompatibleData = {
      name: tabName,
      components: [selectedOptions[0], selectedOptions[1]],
    }
    setisLoading(true)
    await axios
      .put(
        `https://fair-conduit-404516.uc.r.appspot.com/iron-side/compositions/${ruleId}`,
        incompatibleData,
        {
          headers,
        }
      )
      .then(
        (response) => {
          if (response.status === 200) {
            getData()
            setisLoading(false)
          }
        },
        (error) => {
          setisLoading(false)
          return
        }
      )
    setShowModal(false)
    setTabNameError(false)
  }

  return (
    <div className="admin-section">
      <div className="accordion">
        <div
          className={`heading cursor-pointer flex justify-between items-center ${
            isOpen || isOpenAll ? 'open' : ''
          }`}
          onClick={toggleAccordion}
        >
          <div className="rule-title-wrap">
            <span className="rule-index">
              {String((accordianIndex ?? 0) + 1).padStart(2, '0')}
            </span>
            <div className="rule-meta">
              <h4 className="mb-0">{title}</h4>
              <div className="rule-chips">
                <span className="rule-chip rule-chip-a">
                  {selectedOptions[0]?.length || 0}{' '}
                  {(selectedOptions[0]?.length || 0) === 1
                    ? 'product'
                    : 'products'}
                </span>
                <span className="rule-chip-sep">⊘</span>
                <span className="rule-chip rule-chip-b">
                  {selectedOptions[1]?.length || 0}{' '}
                  {(selectedOptions[1]?.length || 0) === 1
                    ? 'incompat.'
                    : 'incompat.'}
                </span>
                {(selectedOptions[0]?.length || 0) *
                  (selectedOptions[1]?.length || 0) >
                  0 && (
                  <span className="rule-impact">
                    blocks{' '}
                    {(selectedOptions[0]?.length || 0) *
                      (selectedOptions[1]?.length || 0)}{' '}
                    combos
                  </span>
                )}
                {(selectedOptions[0]?.length || 0) === 0 &&
                  (selectedOptions[1]?.length || 0) === 0 && (
                    <span className="rule-empty-badge">empty</span>
                  )}
              </div>
            </div>
          </div>
          <div className="flex align-center justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowModal(true)
              }}
              className="delete"
              title="Rename rule"
              aria-label="Rename rule"
            >
              <Pencil />
            </button>
            <button
              className=""
              title={isOpen || isOpenAll ? 'Collapse' : 'Expand'}
              aria-label={isOpen || isOpenAll ? 'Collapse' : 'Expand'}
            >
              {isOpen || isOpenAll ? (
                <Minus width={28} height={28} />
              ) : (
                <Plus width={28} height={28} />
              )}
            </button>
            <button
              type="button"
              className="delete"
              onClick={(e) => {
                e.stopPropagation()
                if (window.confirm(`Delete rule "${title}"?`)) deletAccordian()
              }}
              title="Delete rule"
              aria-label="Delete rule"
            >
              <Delete />
            </button>
          </div>
        </div>
        {(isOpen ||
          isOpenAll ||
          (totalRules - 1 === accordianIndex && isRuleAdded)) && (
          <div
            className={`accordion-content ${
              isOpen ||
              isOpenAll ||
              (totalRules - 1 === accordianIndex && isRuleAdded)
            }`}
          >
            <div className="accordion-content-inner flex justify-space items-center">
              <div className="select" data-lenis-prevent>
                <label className="select-label">
                  Products{' '}
                  <span className="select-count">
                    ({selectedOptions[0]?.length || 0} selected)
                  </span>
                </label>
                <Select
                  isMulti
                  isSearchable
                  isClearable
                  closeMenuOnSelect={false}
                  hideSelectedOptions={false}
                  className="select-2 required-field"
                  classNamePrefix="select-2"
                  placeholder="Search products..."
                  noOptionsMessage={({ inputValue }) =>
                    inputValue
                      ? `No products match "${inputValue}"`
                      : 'No products available'
                  }
                  options={filteredArray}
                  defaultValue={products}
                  value={selectedOptions[0]}
                  onChange={(selectedOption) => {
                    handleSelectChange(selectedOption, 0)
                  }}
                />
              </div>
              <div className="select" data-lenis-prevent>
                <label className="select-label">
                  Incompatible With{' '}
                  <span className="select-count">
                    ({selectedOptions[1]?.length || 0} selected)
                  </span>
                </label>
                <Select
                  isMulti
                  isSearchable
                  isClearable
                  closeMenuOnSelect={false}
                  hideSelectedOptions={false}
                  className="select-2 required-field"
                  classNamePrefix="select-2"
                  placeholder="Search products..."
                  noOptionsMessage={({ inputValue }) =>
                    inputValue
                      ? `No products match "${inputValue}"`
                      : 'No products available'
                  }
                  options={filteredArray}
                  value={selectedOptions[1]}
                  defaultValue={incompatible_products}
                  onChange={(selectedOption) => {
                    handleSelectChange(selectedOption, 1)
                  }}
                />
              </div>
            </div>
            <Button
              className="btn"
              loading={isLoading}
              onClick={() => submitData(title)}
            >
              Submit
            </Button>
          </div>
        )}
      </div>
      {!!showModal && (
        <div className="popup-bg">
          <div className="popup">
            <h3>Edit Rule Name</h3>
            <input
              type="text"
              defaultValue={title}
              placeholder="Edit rule name"
              onChange={(e) => {
                setTabName(e.target.value)
              }}
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  editRuleName()
                }
              }}
            />
            {tabNameError && (
              <div className="error-message text-red border-red">
                <p className="text-red">Name is required.</p>
              </div>
            )}
            <div className="mt-5 d-flex justify-space">
              <Button
                className="btn"
                onClick={() => {
                  setShowModal(false)
                  setTabNameError(false)
                }}
              >
                Cancel
              </Button>
              <Button
                loading={isLoading}
                onClick={() => editRuleName()}
                className="btn"
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AccordianBlock
