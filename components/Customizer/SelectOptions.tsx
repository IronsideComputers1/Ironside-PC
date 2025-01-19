import React from 'react'

export const SelectOptions = ({ 
  fields,
  onSelect,
  value,
  price,
 }) => {
  return (
    <div className="top-0 inset-0 bg-white absolute">
      <ul className="list-none">
        {fields?.map(
          (color: any, index: number) => (
            <li key={index}>
              <p
                className="mb-0 rounded-3xl bg-accents-12"
                onClick={onSelect}
              >
                <span
                  className="colorPattelListBg"
                  style={{
                    backgroundColor:
                      color?.node?.value?.split(',')[1],
                  }}
                />
                {value}
                {price}
              </p>
            </li>
          )
        )}
      </ul>
    </div>
  )
}
