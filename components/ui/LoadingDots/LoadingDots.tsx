import s from './LoadingDots.module.css'

const LoadingDots: React.FC = () => {
  return (
    <span className={s.root + " loading-dots"}>
      <span className={s.dot} />
      <span className={s.dot} />
      <span className={s.dot} />
    </span>
  )
}

export default LoadingDots
