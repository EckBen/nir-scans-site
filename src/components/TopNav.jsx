import { NavLink } from "react-router";
import styled from 'styled-components';

import { GiCorn } from "react-icons/gi";
import { MdHome, MdGridOn } from "react-icons/md";
import { FaCog } from "react-icons/fa";
import { IoIosQrScanner } from "react-icons/io";

const StyledNavLink = styled(NavLink)`
  color: white;
  text-decoration: none;
  padding: 10px 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &:hover {
    color: gray;
  }
  
  &.active {
    color: coral !important;
  }

  @media (max-width: 390px) {
    font-size: 0.7rem;
    padding: 6px 7px;
  }
`;

const VerticalDivider = styled('div')`
  background-color: rgb(100,100,100);
  height: 75%;
  width: 1px;
`;

const StyledNav = styled('nav')`
    background-color: black;
    height: 60px;
    display: flex;
    align-items: center;

    @media (max-width: 550px) {
        justify-content: center;
    }

    @media (max-width: 390px) {
        height: 45px;
    }
`;

export default function TopNav() {
    return (
        <StyledNav>
            <StyledNavLink to='/'>
                <MdHome />
                Home
            </StyledNavLink>
            <VerticalDivider />
            <StyledNavLink to='/samples'>
                <div className='relative'>
                    <div className='absolute -left-1 -top-1'>
                        <IoIosQrScanner size='1.5em' />
                    </div>
                    <GiCorn />
                </div>
                Samples
            </StyledNavLink>
            <VerticalDivider />
            <StyledNavLink to='/plants'>
                <GiCorn />
                Plants
            </StyledNavLink>
            <VerticalDivider />
            <StyledNavLink to='/fields'>
                <MdGridOn />
                Fields
            </StyledNavLink>
            <VerticalDivider />
            <StyledNavLink to='/settings'>
                <FaCog />
                Settings
            </StyledNavLink>
        </StyledNav>
    );
}

// Add icons
// Make a reasonable size
// Make bottom nav and make it show and this hide on small screens
// Make Home component with tiles
// Create tables