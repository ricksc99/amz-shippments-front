import React from 'react';
import { Icon, useBreakpointValue, Button, Text, Flex, Image } from '@chakra-ui/react';
import { BsPlusLg } from "react-icons/bs";
import ImageNotResults from'../../assets/images/image-not-results.png';

export function NotResults({ addCallback }) {
    const isMobile = useBreakpointValue({ base: true, md: false });
  
    return (
        <Flex minH="200px" direction="column" alignItems="center" justifyContent="center" mb={20} p={4}>
            <Image w={isMobile ? 200 : 400} src={ImageNotResults} alt="Logo" />
            <Flex direction="column" alignItems="center" justifyContent="center" maxW="600px">
                <Text textAlign="center" fontSize={["lg", "2xl"]} fontWeight="bold" color="black">Oops, parece que los resultados se han esfumado en una expedición espacial</Text>
                <Text mt={3} textAlign="center" fontSize={["sm", "lg"]} fontWeight="light" color="black">Si quieres llenar de vida este universo vacío, ¡simplemente pulsa el botón de añadir!</Text>
                <Button mt={4} fontSize={['xs', 'md']} onClick={() => addCallback()} bg="primary.500" color="#fff" borderRadius="full" fontWeight={"light"} outline="none" _hover={{ bg: '#fff', color: "primary.500" }}  ml={1} mr={isMobile ? 0 : 3}>
                    <Icon as={BsPlusLg} mr={1}/>Añadir
                </Button>
            </Flex>
        </Flex>
    )
  }