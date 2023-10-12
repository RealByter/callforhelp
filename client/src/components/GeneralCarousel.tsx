import React from 'react'
import Carousel from 'react-material-ui-carousel';

interface GeneralCarouselProps {
    items: React.ReactNode[];
}

export const GeneralCarousel: React.FC<GeneralCarouselProps> = ({ items }) => {
    return (
        <Carousel
            animation='slide'
            duration={1000}
            navButtonsAlwaysInvisible
            indicatorIconButtonProps={{
                style: {
                    //TODO change to white after consts
                    color: '#afafaf',
                    backgroundColor: 'transparent',
                    outline: 'none'
                }
            }}
            activeIndicatorIconButtonProps={{
                style: {
                    //TODO change to consts
                    color: 'purple',
                }
            }}
            sx={{ height: '100%', width: '100%' }}>

            {items}
        </Carousel>
    )
}
