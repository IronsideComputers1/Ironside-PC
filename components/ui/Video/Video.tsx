type VideoProps = {
  src: string
  autoPlay?: boolean
  controls?: boolean
  loop?: boolean
  muted?: boolean
  playsInline?: boolean
  width?: number
  height?: number
  preload?: "auto" | "metadata" | "none"
  className?: string
  style?: React.CSSProperties
}

export const Video = ({ 
  src,
  autoPlay = true,
  controls = true,
  loop,
  muted,
  width,
  height,
  preload,
  className,
  style,
}: VideoProps) => {
  return (
    <video
      className={className}
      style={style}
      width={width}
      height={height}
      controls={controls}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      preload={preload}
      playsInline
    >
      <source src={src} type="video/mp4"/>       
      Your browser does not support the video tag.
    </video>
  )
}
