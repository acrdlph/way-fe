import React from 'react';
import { NavLink } from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';
import Slider from 'react-slick';
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
      <div className='onboarding'>

        <div className='onboarding-logo'>
          <img
            className='logo'
            src='assets/waitlistlogo.svg'
          />
        </div>

        <div className='onboarding-carousel'>
          <Slider ref='slider' {...imageCarouselSettings}>

            <div className='onboarding-carousel-item'>
              <img src='assets/onboarding-1.png' className='onboarding-carousel-item-image'/>
              <div className='onboarding-carousel-item-text'>
                Bored?
              </div>
            </div>
            <div className='onboarding-carousel-item'>
              <img src='assets/onboarding-2.png' className='onboarding-carousel-item-image'/>
              <div className='onboarding-carousel-item-text'>
                Tell people what you are interested in.
              </div>
            </div>
            <div className='onboarding-carousel-item'>
              <img src='assets/onboarding-3.png' className='onboarding-carousel-item-image'/>
              <div className='onboarding-carousel-item-text'>
                And find out if there is someone you should meet!
              </div>
            </div>

          </Slider>
        </div>

        <div className='onboarding-enter-button'>
          <NavLink to="/signup">
            <RaisedButton
              label="Join the WaitList"
              backgroundColor='#ffd801'
            />
          </NavLink>
        </div>

        <p className='onboarding-legal-texts'>
          We will ask for your phone's GPS to connect you with the people around you.<br/>
          If you don't like that you can also type in your waiting location manually.
        </p>

      </div>
    );
  }
}
