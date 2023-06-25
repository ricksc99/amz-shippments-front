import React, { useState } from 'react';
import { BrowserRouter as Router, Link, useLocation } from 'react-router-dom';
import { Image, Box, Flex, Icon, Text, Spacer, Divider, IconButton, Tooltip, Fade, useBreakpointValue } from '@chakra-ui/react';
import { BiMenu, BiHomeAlt, BiBuildings, BiCube, BiCalendarEvent, BiLogOut, BiRightArrowAlt, BiLeftArrowAlt, BiExtension, BiIdCard, BiChat } from "react-icons/bi";
import AmazonLogo from "../../assets/images/logo_amazon.png";
import AmazonLogoXs from "../../assets/images/logo_amazon_xs.png";

const listMenu = [
    {
      name: "Menú principal",
      list: [
        { name: "Inicio", link: "/", icon: BiHomeAlt},
        { name: "Pedidos", link: "/orders", icon: BiCalendarEvent},
        { name: "Productos", link: "/productos", icon: BiCube},
        { name: "Proveedores", link: "/suppliers", icon: BiBuildings},
      ]
    },
    {
      name: "Ajustes",
      list: [
        { name: "Perfil", link: "/perfil", icon: BiIdCard},
        { name: "Ajustes", link: "/ajustes", icon: BiExtension},
        { name: "Ayuda", link: "/ayuda", icon: BiChat}
      ]
    }
];
  
  // Componente del menú lateral
export function Sidebar ({ onLogout }) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    let isMobile = useBreakpointValue({ base: true, md: false });

    const handleSidebarToggle = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const isMenuActive = (path) => {
        return location.pathname === path;
    };

    const getWidthSidebar = () => {
        if (document.getElementById("sidebar") != null) {
            if (isSidebarOpen && !isMobile) {
                return "250px";
            } else if (!isSidebarOpen && !isMobile) {
                return "70px";
            } else if (isSidebarOpen && isMobile) {
                return "100vw";
            } else if (!isSidebarOpen && isMobile) {
                return "0px";
            }
        } else {
            return "250px";
        }
    }

    return (
        <>
            <Box id="sidebar" bg="#fff" color="secondary" height="100vh" display={(isMobile && !isSidebarOpen) ? "none" : "block"} width={getWidthSidebar()} p="4" boxShadow='xl' overflow="hidden" transition="width 0.3s ease" position="relative">
                <Flex pos="sticky" direction="column" justify="space-between" h="100%">
                { isSidebarOpen == true &&
                    <Box position="absolute" top="0" right="0" p="4" zIndex="1">
                        <IconButton
                            icon={isSidebarOpen ? <BiLeftArrowAlt /> : <BiRightArrowAlt />}
                            bg="primary.500"
                            color="#fff"
                            borderRadius="full"
                            outline="none"
                            fontSize="xl"
                            _hover={{ bg: '#fff', color: "primary.500" }}
                            onClick={handleSidebarToggle}
                            // ...
                        />
                    </Box>
                }
                <Flex direction="column" gap="2">
                    <Link to="/">
                    <Box fontSize="lg" fontWeight="bold">
                        { isSidebarOpen == true && <Image w={100} src={AmazonLogo} alt="Logo" />}
                        { isSidebarOpen == false && <Image w={50} src={AmazonLogoXs} alt="Logo" />}
                    </Box>
                    </Link>
                    <Spacer />
                    { isSidebarOpen == false &&
                        <Fade in={!isSidebarOpen}>
                            <IconButton
                                icon={<BiRightArrowAlt />}
                                color="secondary"
                                bg="none"
                                outline="none"
                                fontSize="xl"
                                _hover={{ color: "primary.500", borderColor: "#fff" }}
                                onClick={handleSidebarToggle}
                                // ...
                            />
                        </Fade>
                    }
                    {listMenu.map(menuName => (
                    <Box key={menuName.name}>
                        { isSidebarOpen == true &&
                        <Fade in={isSidebarOpen}>
                            <Box fontSize="lg" fontWeight="bold" mt="5" mb="2" color="black" textTransform="uppercase">
                            {menuName.name}
                            </Box>
                        </Fade>
                        }
                        {menuName.list.map(menu => (
                            <Link to={menu.link} onClick={() => { isMobile ? handleSidebarToggle() : null }} key={menu.link} w="100%">
                                <Tooltip label={menu.name} isDisabled={isSidebarOpen ? true : false} placement='right' hasArrow arrowSize={10}>
                                <Flex alignItems="center" justifyContent="start" p="2" rounded="md" fontSize={isSidebarOpen ? "lg" : "2xl"} bg={isMenuActive(menu.link) ? "primary.500" : ""} color={isMenuActive(menu.link) ? "#fff" : ""} fontWeight="normal">
                                    <Icon as={menu.icon} fontWeight="normal" mr={1} /> {isSidebarOpen ? menu.name : ""}
                                </Flex>
                                </Tooltip>
                            </Link>
                        ))} 
                    </Box>
                    ))} 
                </Flex>
                <Box>
                    <Divider orientation='horizontal'/>
                    <Link onClick={onLogout} w="100%">
                        <Flex alignItems="center" justifyContent="start" p="2" rounded="md" fontSize={isSidebarOpen ? "lg" : "2xl"} fontWeight="normal">
                            <Icon as={BiLogOut} fontWeight="normal" mr={1} /> {isSidebarOpen ? "Logout" : ""}
                        </Flex>
                    </Link>
                    <Flex alignItems="center" justifyContent="center" p="2" rounded="md" fontSize={isSidebarOpen ? "xs" : "2xs"} fontWeight="light">
                    <Text>v.20230523</Text>
                    </Flex>
                </Box>
                </Flex>
            </Box>
            {(isMobile && !isSidebarOpen) &&
                <Box position="absolute" bottom="2" left="2" zIndex="1">
                    <IconButton
                        icon={<BiMenu />}
                        bg="primary.500"
                        color="#fff"
                        borderRadius="full"
                        outline="none"
                        fontSize="xl"
                        _hover={{ bg: '#fff', color: "primary.500" }}
                        onClick={handleSidebarToggle}
                        // ...
                    />
                </Box>
            }
        </>
    );
};