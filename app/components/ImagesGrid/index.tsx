import { ViewImage } from '@atproto/api/dist/client/types/app/bsky/embed/images'
import { styled } from '@nextui-org/react'
import Zoom from 'react-medium-image-zoom'

const GridContainer = styled('div', {
  height: '300px',
  display: 'grid',
  gap: '2px',
  borderRadius: '8px',
  overflow: 'hidden',
  variants: {
    layout: {
      '1x1': {
        gridTemplateColumns: '1fr',
      },
      '1x2': {
        gridTemplateColumns: '1fr 1fr',
      },
      '2x2': {
        gridTemplateRows: '1fr 1fr',
        gridTemplateColumns: '1fr 1fr',
      },
    },
  },
})

const GridItem = styled('div', {
  height: '100%',
  '& div': {
    height: '100%',
  },
  '& div div': {
    height: '100%',
  },
})

const Img = styled('img', {
  height: '100%',
  objectFit: 'cover',
})

/**
 * ImagesGrid props.
 */
export type ImagesGridProps = {
  images: ViewImage[]
}

/**
 * ImagesGrid component.
 */
export const ImagesGrid: React.FC<ImagesGridProps> = (props) => {
  const { images } = props

  if (images.length === 3) {
    return (
      <GridContainer layout="2x2">
        <GridItem css={{ gridRow: '1 / 3', gridColumn: '1 / 2' }}>
          <Zoom>
            <Img src={images[0].fullsize} alt={images[0].alt} />
          </Zoom>
        </GridItem>
        <GridItem css={{ gridRow: '1 / 2', gridColumn: '2 / 3' }}>
          <Zoom>
            <Img src={images[1].fullsize} alt={images[1].alt} />
          </Zoom>
        </GridItem>
        <GridItem css={{ gridRow: '2 / 2', gridColumn: '2 / 3' }}>
          <Zoom>
            <Img src={images[2].fullsize} alt={images[2].alt} />
          </Zoom>
        </GridItem>
      </GridContainer>
    )
  } else {
    return (
      <GridContainer
        layout={
          images.length === 1 ? '1x1' : images.length === 2 ? '1x2' : '2x2'
        }
      >
        {images.map((image, index) => (
          <GridItem key={index}>
            <Zoom>
              <Img src={image.fullsize} alt={image.alt} />
            </Zoom>
          </GridItem>
        ))}
      </GridContainer>
    )
  }
}
