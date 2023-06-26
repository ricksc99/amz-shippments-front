import React, { useState } from 'react';
import { BrowserRouter as Router, Link, useLocation } from 'react-router-dom';
import { Grid, Image, Box, Flex, Icon, Text, Spacer, Divider, IconButton, Tooltip, Fade, useBreakpointValue } from '@chakra-ui/react';
import { BiMenu, BiHomeAlt, BiBuildings, BiCube, BiCalendarEvent, BiLogOut, BiRightArrowAlt, BiLeftArrowAlt, BiExtension, BiIdCard, BiChat } from "react-icons/bi";
import AmazonLogoXs from "../../assets/images/logo_amazon_xs.png";

  // Componente del menú lateral
export function Header ({ onLogout, handleSidebarToggle }) {
    const location = useLocation();
    let isMobile = useBreakpointValue({ base: true, md: false });

    return (
        <Flex display={isMobile ? "flex" : "none"} position="fixed" width="100%" id="header" bg="primary.500" color="secondary" p={2} alignItems="center" justifyContent="space-between">
            <Icon onClick={() => handleSidebarToggle()} as={BiMenu} fontSize={"2xl"} color="#fff" fontWeight="normal"/>
            <Icon onClick={() => onLogout()} as={BiLogOut} fontSize={"2xl"} color="#fff" fontWeight="normal"/> 
        </Flex>
    );
};