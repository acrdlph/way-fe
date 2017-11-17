import React from 'react';
import { NavLink } from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';
import Slider from 'react-slick';
import Header from '../components/header';
import './onboarding.less';

// check https://github.com/akiran/react-slick for all styling options
const imageCarouselSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1
};

export default class Onboarding extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <div className='onboarding-image-carousel'>
          <Slider {...imageCarouselSettings}>
            <img src="assets/onboarding-1.png" />
            <img src="assets/onboarding-2.png" />
            <img src="assets/onboarding-3.png" />
          </Slider>
        </div>
        <div className='enter-waitlist-button'>
          <NavLink to="/signup">
            <RaisedButton label="Enter WaitList" />
          </NavLink>
        </div>
      </div>
    );
  }
}
