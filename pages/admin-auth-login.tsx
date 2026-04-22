import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState, useCallback } from 'react'
import { BuilderComponent, builder } from '@builder.io/react'
import axios from 'axios'
import { AES } from 'crypto-js'
import { validate } from 'email-validator'
import { Layout } from '@components/common'
import { Button, Input } from '@components/ui'
import Header from '@components/BuilderHeader/Header'
import Link from 'next/link'

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  const header = await builder.get('header').toPromise()

  return {
    props: { header },
    revalidate: 14400,
  }
}

export default function AdminAuth({
  header,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [emailError, setEmailError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [confirmPasswordError, setConfirmPasswordError] = useState(false)
  const [passwordInvalidError, setPasswordInvalidError] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const router = useRouter()

  const toggleMode = () => {
    setIsSignUp((prev) => !prev)
    setMessage('')
    setEmailError(false)
    setPasswordError(false)
    setConfirmPasswordError(false)
    setPasswordInvalidError(false)
    setPassword('')
    setConfirmPassword('')
  }

  const handleAdminAuth = async (e: React.SyntheticEvent<EventTarget>) => {
    setEmailError(false)
    setPasswordError(false)
    setConfirmPasswordError(false)
    setPasswordInvalidError(false)
    e.preventDefault()
    if (!email.length && !password.length) {
      setEmailError(true)
      setPasswordError(true)
      return
    }
    if (!email.length || !validate(email)) {
      setEmailError(true)
      return
    }
    if (!password.length) {
      setPasswordError(true)
      return
    }

    if (isSignUp) {
      const validPassword =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$%^&+=!])(?!.*\s).{8,}$/.test(password)
      if (!validPassword) {
        setPasswordInvalidError(true)
        return
      }
      if (password !== confirmPassword) {
        setConfirmPasswordError(true)
        return
      }
    }

    if (!dirty && !disabled) {
      setDirty(true)
      handleValidation()
    }

    if (isSignUp) {
      try {
        setLoading(true)
        setMessage('')
        await axios.post(
          `https://fair-conduit-404516.uc.r.appspot.com/admin/user`,
          { email, password, confirmPassword }
        )
        setMessage('Account created. You can now log in.')
        setIsSignUp(false)
        setPassword('')
        setConfirmPassword('')
        setLoading(false)
      } catch (errors: any) {
        setMessage(
          errors?.response?.data?.errors?.[0]?.message ||
            errors?.errors?.[0]?.message ||
            'Unable to create account'
        )
        console.error(errors)
        setLoading(false)
      }
      return
    }

    const cipherText = AES.encrypt(password, '#we$$12@@*6sj3SE7667^&^KK')
    const loginData = {
      email: email,
      password: cipherText.toString(),
    }

    try {
      setLoading(true)
      setMessage('')
      const result = await axios.post(
        `https://fair-conduit-404516.uc.r.appspot.com/admin/login`,
        loginData,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'Application/json',
          },
        }
      )
      const jwtToken = result.data.data.jwtToken
      localStorage.setItem('jwtToken', jwtToken)
      router.push(`/secret-url`)
    } catch (errors: any) {
      // @ts-ignore next-line
      setMessage('Internal server error')
      console.error(errors)
      setLoading(false)
    }
  }

  const handleValidation = useCallback(() => {
    // Test for Alphanumeric password
    const validPassword = /^(?=.*[a-zA-Z])(?=.*[0-9])/.test(password)

    // Unable to send form unless fields are valid.
    if (dirty) {
      setDisabled(!validate(email) || password.length < 7 || !validPassword)
    }
  }, [email, password, dirty])

  if (typeof window !== 'undefined') {
    
    
  }

  useEffect(() => {
    handleValidation()
  }, [handleValidation])

  return (
    <>
      <Header headerData={header?.data} />
      <div
        className="box-form absolute-heading"
        style={{
          overflowY: 'auto',
          paddingBottom: '40px',
        }}
      >
        <h1
          className="account-heading"
          style={{
            right: '0',
            fontSize: isSignUp ? 'clamp(48px, 7vw, 96px)' : '',
            lineHeight: isSignUp ? '1' : '',
            whiteSpace: 'nowrap',
          }}
        >
          {isSignUp ? 'Admin Sign Up' : 'Admin Login'}
        </h1>
        <div className="bg-box">
          <div className="bg-box-head">
            <div className="flex dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <form onSubmit={handleAdminAuth}>
            <div className="box-model">
              <div className="form-field">
                <Input
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChange={setEmail}
                />
                {emailError && (
                  <div className="error-message text-red border-red">
                    <p className="text-red">Email is invalid</p>
                  </div>
                )}
              </div>
              <div
                className={
                  isSignUp ? 'form-field' : 'form-field forgot-password'
                }
              >
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={setPassword}
                />
                {!isSignUp && (
                  <Link href={'/admin-forgot-password'}>
                    <a className="link">Forgot password?</a>
                  </Link>
                )}
                {passwordError && (
                  <div className="error-message text-red border-red">
                    <p className="text-red">Password is required</p>
                  </div>
                )}
                {passwordInvalidError && (
                  <div className="error-message text-red border-red">
                    <p className="text-red">
                      Password must be at least 8 characters with a letter, a
                      number, and a special character.
                    </p>
                  </div>
                )}
              </div>
              {isSignUp && (
                <div className="form-field">
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                  />
                  {confirmPasswordError && (
                    <div className="error-message text-red border-red">
                      <p className="text-red">Passwords do not match</p>
                    </div>
                  )}
                </div>
              )}
              {message && (
                <div className="error-message text-red border-red">
                  {message}
                </div>
              )}

              <div className="mt-auto">
                <Button
                  variant="slim"
                  type="submit"
                  loading={loading}
                  className="btn"
                >
                  {isSignUp ? 'Sign Up' : 'Login'}
                </Button>
              </div>
              <div className="mt-3 align-center">
                <button
                  type="button"
                  onClick={toggleMode}
                  className="link"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  {isSignUp
                    ? 'Already have an account? Log in'
                    : "Don't have an account? Sign up"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="mt50">
        <BuilderComponent model="symbol" />
      </div>
    </>
  )
}

AdminAuth.Layout = Layout
