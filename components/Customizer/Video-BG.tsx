import { Video } from '@components/ui/Video/Video'
import { ShadowFocus } from './ShadowFocus'
import classNames from 'classnames'

export const VideoBG = (props: { src: string }) => {
  return (
    <div className="absolute top-[-112px] sm:fixed sm:inset-y-0 overflow-x-hidden xs:w-screen">
      <Video
        className={classNames(
          'max-w-none object-cover w-[240vw] object-[-70px_0]',
          'xs:object-[-99px_-30px] xs:w-[260vw]',
          'md:object-scale-down',
          'xmd:object-cover xmd:h-[116vh] xmd:object-[-36px_-100px] xmd:w-screen',
          'xxl:object-[0px_-60px] xxl:object-cover',
          '4-xl:object-[-54px_20px]'
        )}
        src={props.src}
        controls={false}
        loop
        muted
        preload="auto"
      />
      <div className="hidden xmd:block">
        {/* Shadow BG on ProductLeft */}
        <div
          className="absolute inset-y-0 bg-theme right-0"
          style={{
            left: '52%',
          }}
        />
        <div
          className="absolute inset-y-0 bg-theme right-0"
          style={{
            filter: 'blur(20px)',
            left: '52%',
          }}
        />
        {/* Shadows Focuses */}
        <ShadowFocus
          rotate="18deg"
          top="-16vh"
          left="32%"
          bottom="unset"
          width="100px"
          height="0"
        />
        <ShadowFocus
          rotate="-18.5deg"
          top="-8vh"
          left="65%"
          bottom="0"
          width="0"
          height="auto"
        />
        <ShadowFocus
          rotate="-46deg"
          top="unset"
          left="48%"
          bottom="1vh"
          width="400px"
          height="0"
        />
      </div>
    </div>
  )
}
