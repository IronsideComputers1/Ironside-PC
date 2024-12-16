import { Video } from '@components/ui/Video/Video'
import { ShadowFocus } from './ShadowFocus'

export const VideoBG = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* BG Video for eden'sveil */}
      <Video
        className="max-w-none object-left h-screen w-screen object-contain"
        src="/Edens.mp4"
        controls={false}
        loop
        muted
        preload="auto"
        style={{
          width: "102vw",
          height: "116vh",
          objectFit: "cover",
          objectPosition: "-36px -100px"
        }}
      />
      {/* Shadow BG on ProductLeft */}
      <div
        className='absolute inset-y-0 bg-theme right-0'
        style={{
          left: "52%"
        }}
      />
      <div
        className='absolute inset-y-0 bg-theme right-0'
        style={{
          filter: "blur(20px)",
          left: "52%",
        }}
      />
      {/* Shadows Focuses */}
      <ShadowFocus
        rotate='18deg'
        top='-16vh'
        left="32%"
        bottom='unset'
        width='100px'
        height="0"
      />
      <ShadowFocus
        rotate='-18.5deg'
        top="-8vh"
        left='65%'
        bottom="0"
        width='0'
        height='auto'
      />
      <ShadowFocus
        rotate='-46deg'
        top="unset"
        left='48%'
        bottom="1vh"
        width='400px'
        height="0"
      />
    </div>
  )
}
