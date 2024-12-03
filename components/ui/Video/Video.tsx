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
}: VideoProps) => {
  return (
    <video
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
