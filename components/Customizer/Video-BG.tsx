import { Video } from '@components/ui/Video/Video'
import { ShadowFocus } from './ShadowFocus'
import classNames from 'classnames';

export const VideoBG = (props: { src: string }) => {
  const classes = classNames(
    "max-w-none object-cover w-screen h-[68vh]",
    "xs:object-[-99px_-30px]",
    "md:w-[102vw] md:h-[116vh] md:object-[-36px_-100px]",
    "xxl:object-[0px_-60px] xxl:object-contain",
    "4-xl:object-[-154px_10px]",
  );
  return (
    <div className="absolute inset-0 top-[-112px] overflow-hidden">
      <Video
        className={classes}
        src={props.src}
        controls={false}
        loop
        muted
        preload="auto"
      />
      <div className='hidden md:block'>
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
    </div>
  )
}
