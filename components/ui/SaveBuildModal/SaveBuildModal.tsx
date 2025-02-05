import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Portal } from '@reach/portal'
import { Cross } from '@components/icons'
import FloppyBit from '@components/icons/FloppyBit'
import { useGetTheme } from '../DarkMode/DarkMode'

type SaveBuildContentProps = {
  url: any
  setCopyClicked?: React.Dispatch<React.SetStateAction<boolean>>
  setEmailClicked?: React.Dispatch<React.SetStateAction<boolean>>
  copyClicked?: boolean
  emailClicked?: boolean
  options: any
  totalPrice: any
  productDescription?: any
  productImage?: any
}


export const SaveBuildContent = ({
  url,
  productDescription,
  productImage,
  options,
  totalPrice,
}: SaveBuildContentProps) => {
  const theme = useGetTheme();
  const emailApiUrl = 'https://fair-conduit-404516.uc.r.appspot.com/saveBuild'
  const [email, setEmail] = useState('')
  const [copyClicked, setCopyClicked] = useState(false)
  const [emailClicked, setEmailClicked] = useState(false)

  useEffect(() => {
    return () => {
      setCopyClicked(false)
      setEmailClicked(false)
    }
  }, [])


  const sendBuildEmail = async () => {
    const emailData = {
      productUrl: url,
      email: email,
      desc: options,
      productName: productDescription?.join(''),
      productImage: productImage?.length
        ? productImage
        : '',
      price: totalPrice,
    }

    try {
      await axios.post(emailApiUrl, emailData).then((response) => {
        if (response.status === 200) {
          setEmailClicked(true)
        }
      })
    } catch (errors: any) {
      setEmailClicked(true)
      console.error(errors)
    }
  }
  return (
    <div className='flex flex-col items-center justify-center'>
      <FloppyBit className={`mb-9 ${theme === 'dark' ? 'text-white' : 'text-black'}`} />
      <div className="align-center">
      <label>Custom URL</label>
      <div className="custom-box flex align-v-center">
        <input placeholder={url} />
        <button
        className="btn-small"
        onClick={() => {
          navigator.clipboard.writeText(url)
          setCopyClicked(true)
          setEmailClicked(false)
        }}
        >
        {copyClicked ? 'copied' : 'copy'}
        </button>
      </div>
      </div>
      <div className="align-center">
      <label>Email</label>
      <div className="custom-box flex align-v-center">
        <input
        placeholder="Enter email address"
        type="email"
        onChange={(e) => {
          setEmail(e.target.value)
        }}
        ></input>
        <button
        className="btn-small"
        onClick={() => {
          sendBuildEmail()
        }}
        >
        {emailClicked ? 'sent' : 'Email'}
        </button>
      </div>
      </div>
      <div className="spec-list">
      <p className="head">
        <span>Spec List</span>
      </p>
      <div className="product-description" data-lenis-prevent>
        {options?.map((opt: any, index: number) => (
        <div key={index} className="flex flex-col text-base">
          <span>{opt?.category_name || opt?.name}: </span>
          <span>{opt?.product_name || opt?.value}</span>
        </div>
        ))}
      </div>
      </div>
      <div className="mt-5 flex justify-end align-v-center copy-bottom">
      <button
        className="btn-small"
        onClick={() => {
        navigator.clipboard.writeText(url)
        setCopyClicked(true)
        setEmailClicked(false)
        }}
      >
        {copyClicked ? 'copied' : 'copy spec list'}
      </button>
      </div>
    </div>
  )
}

interface SaveBuildModalProps {
  onClose?: any
  url: any
  options: any
  totalPrice: any
  productDescription?: any
  productImage?: any
}

const SaveBuildModal = ({
  onClose,
  url,
  options,
  totalPrice,
  productDescription,
  productImage,
}: SaveBuildModalProps) => {
  return (
    <Portal>
      <div className="modal saveMyBuild" style={{ maxWidth: '442px', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
      <h2 className="align-center">Save My Build</h2>
      <button
        className="modal-close"
        onClick={() => {
          if(!onClose) return;
          onClose()
        }}
      >
        <Cross />
      </button>
      <SaveBuildContent
        url={url}
        options={options}
        totalPrice={totalPrice}
        productDescription={productDescription}
        productImage={productImage}
      />
      </div>
    </Portal>
  )
}

export default SaveBuildModal
