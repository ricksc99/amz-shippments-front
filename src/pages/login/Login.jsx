import { useState } from 'react';
import { useNavigate} from "react-router-dom";
import { Flex, Heading, Input, Button, InputGroup, Stack, InputLeftElement, chakra, Box, Link, Avatar, FormControl, FormHelperText, InputRightElement } from "@chakra-ui/react";

import { FaUserAlt, FaLock } from "react-icons/fa";
const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

export function Login ({ setIsLogged }) {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const onLogin = (e) => {
        navigate("/");
        sessionStorage.setItem("isLogged", true);
        setIsLogged(true);
    }

    const handleShowClick = () => setShowPassword(!showPassword);

    return (
        <Flex flexDirection="column" width="100wh" height="100vh" backgroundColor="lightgray.100" justifyContent="center" alignItems="center" >
            <Stack flexDir="column" mb="2" justifyContent="center" alignItems="center" >
                <Avatar bg="primary.500" />
                <Heading color="primary.500">Bienvenido</Heading>
                <Box minW={{ base: "90%", md: "468px" }}>
                    <form onSubmit={onLogin}>
                        <Stack spacing={4} p="2rem" backgroundColor="whiteAlpha.900" boxShadow="md" borderRadius="xl">
                            <FormControl>
                                <InputGroup>
                                    <InputLeftElement pointerEvents="none" children={<CFaUserAlt color="gray.300" />} />
                                    <Input type="email" placeholder="Dirección de email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                                </InputGroup>
                            </FormControl>
                            <FormControl>
                                <InputGroup>
                                    <InputLeftElement pointerEvents="none" color="gray.300" children={<CFaLock color="gray.300" />} />
                                    <Input type={showPassword ? "text" : "password"} placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
                                    <InputRightElement width="4.5rem">
                                        <Button h="1.75rem" mr="2" size="sm" onClick={handleShowClick}>
                                        {showPassword ? "Ocultar" : "Mostrar"}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                                <FormHelperText textAlign="right">
                                    <Link>¿Has olvidado la contraseña?</Link>
                                </FormHelperText>
                            </FormControl>
                            <Button borderRadius="lg" type="submit" variant="solid" bg="primary.500" color="#fff" width="full" _hover={{ bg: "#fff", color: "primary.500" }}>
                                Entrar
                            </Button>
                        </Stack>
                    </form>
                </Box>
            </Stack>
            <Box>
                ¿Nuevo por aquí?{" "}
                <Link color="primary.500" href="#">Regístrate</Link>
            </Box>
            </Flex>
    );
  };