import React from 'react'

const DropdownArrow = ({ width = 10, height = 6 }) => {
  return (
    <svg
      className='fill-current'
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 10 6"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.646447 0.646447C0.841709 0.451184 1.15829 0.451184 1.35355 0.646447L5 4.29289L8.64645 0.646447C8.84171 0.451184 9.15829 0.451184 9.35355 0.646447C9.54882 0.841709 9.54882 1.15829 9.35355 1.35355L5.35355 5.35355C5.15829 5.54882 4.84171 5.54882 4.64645 5.35355L0.646447 1.35355C0.451184 1.15829 0.451184 0.841709 0.646447 0.646447Z"
      />
    </svg>
  )
}

export default DropdownArrow
