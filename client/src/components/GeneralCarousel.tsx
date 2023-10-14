import React from 'react'
import Carousel from 'react-material-ui-carousel';
import { carouselActiveIndicatorIconButtonProps, carouselIndicatorIconButtonProps } from '../consts/genericCarouselStyles';

interface GeneralCarouselProps {
    items: React.ReactNode[];
}

export const GeneralCarousel: React.FC<GeneralCarouselProps> = ({ items }) => {
    return (
        <Carousel
            duration={1000}
            animation='slide'
            navButtonsAlwaysInvisible
            sx={{ height: '100%', width: '100%' }}
            indicatorIconButtonProps={carouselIndicatorIconButtonProps}
            activeIndicatorIconButtonProps={carouselActiveIndicatorIconButtonProps}>

            {items}
        </Carousel>
    )
}
