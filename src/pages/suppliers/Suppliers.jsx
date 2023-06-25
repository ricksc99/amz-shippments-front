import React, { useState, useEffect } from 'react';
import { TabIndicator, useBreakpointValue, useToast, Spinner, Editable, EditablePreview, EditableInput, Tabs, TabList, Tab, TabPanels, TabPanel, Stack, Select, NumberInput, NumberInputField, Modal, ModalContent, ModalFooter, ModalBody, FormControl, FormLabel, ModalCloseButton, ModalHeader, ModalOverlay, InputGroup, InputLeftElement, Input, Icon, Avatar, Table, Thead, Tr, Th, Td, Tbody, Box, Link, Button, Flex, Text, Grid, Divider } from '@chakra-ui/react';
import { BsPlusLg, BsSearch, BsBoxArrowInUpRight, BsTelephone, BsEnvelope } from "react-icons/bs";
import { ChevronDownIcon, ChevronUpIcon, EmailIcon, PhoneIcon } from "@chakra-ui/icons";
import * as SuppliersService from "../../services/SuppliersService";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

export function Suppliers () {
    const isMobile = useBreakpointValue({ base: true, md: false });
    const [suppliersIsLoading, setSuppliersIsLoading] = useState(false);
    const [suppliersData, setSuppliersData] = useState(false);
    const [filter, setFilter] = useState({});
    const [supplierDetails, setSupplierDetails] = useState({});
    const [isOpen, setIsOpen] = useState(false);
    const [loadSave, setLoadSave] = useState(false);
    const toast = useToast()
    const [data, setData] = useState([]);
    const [modalIsLoading, setModalIsLoading] = useState(false);
    const [invalidFields, setInvalidFields] = useState([]);
    
    const columns = [
      { name: "Nombre", field: 'contact_name' },
      { name: "Contacto", field: 'contact' },
      { name: "Empresa", field: 'name' },
      { name: "Dirección", field: 'full_address' }
    ];

    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

    const handleSort = (key) => {
      let direction = "asc";
      if (sortConfig.key === key && sortConfig.direction === "asc") {
        direction = "desc";
      }
  
      const sortedData = [...data].sort((a, b) => {
        if (a[key] < b[key]) {
          return direction === "asc" ? -1 : 1;
        }
        if (a[key] > b[key]) {
          return direction === "asc" ? 1 : -1;
        }
        return 0;
      });
  
      setData(sortedData);
      setSortConfig({ key, direction });
    };
  
    const getSortIcon = (key) => {
      if (sortConfig.key === key) {
        return sortConfig.direction === "asc" ? <ChevronUpIcon /> : <ChevronDownIcon />;
      }
      return null;
    };

    //Al iniciar el componente
    useEffect(() => {
        fetchSuppliers();
    }, []);

    //Al cambiar de estado el objeto filter
    useEffect(() => {
      if (filter && filter.search != null) {

      }
    }, [filter]);

    const fetchSuppliers = async () => {
      try {
        setSuppliersIsLoading(true);
        const response = await SuppliersService.getAllSuppliers("id,contact_name,contact_email,contact_phone,name,full_address");
        setData(response.data);
        setSuppliersIsLoading(false);
      } catch (error) {
        setSuppliersIsLoading(false);
        console.error('Error fetching orders:', error);
      }
    };

    const searchSupplier = (e) => {
      setFilter({ ...filter, [e.target.name]: e.target.value });
    };

    const openSupplierDetails = async (supplier) => {
        if (supplier.isNew) {
          setIsOpen(true);
          setSupplierDetails(supplier);
        } else {
          try {
            setIsOpen(true);
            setModalIsLoading(true);
            const response = await SuppliersService.getSupplierById(supplier.id);
            setSupplierDetails(response.data);
            setModalIsLoading(false);
          } catch (error) {
            setModalIsLoading(false);
            console.error('Error fetching orders:', error);
          }
        }
    }

    const addSupplier = () => {
        openSupplierDetails({ isNew: true });
    }

    const handleClose = () => {
      setIsOpen(false);
      setInvalidFields([]);
      setSupplierDetails({});
    };

    const handleChangeSupplierDetails = (e, type, index) => {
        setSupplierDetails({ ...supplierDetails, [e.target.name]: e.target.value });
    };

    const saveSupplier = async () => {
      try {

        const invalidFields = [];
        // Validar campos requeridos
        if (!supplierDetails.contact_name) {
          invalidFields.push('contact_name');
        }
        if (!supplierDetails.name) {
          invalidFields.push('name');
        }

        if (invalidFields.length > 0) {
          setInvalidFields(invalidFields);
          toast({ title: 'Error.', description: "Rellena los campos obligatorios.", status: 'error', duration: 3000, isClosable: true })
          return;
        } else {
          setInvalidFields([]);
        }
        setLoadSave(true);
        const response = supplierDetails.id != null ? await SuppliersService.saveSupplier(supplierDetails) : await SuppliersService.createSupplier(supplierDetails);
        
        if (response.data != null) {
          setSupplierDetails({});
          setLoadSave(false);
          setIsOpen(false);
          toast({ title: 'Guardado.', description: "Se ha guardado el proveedor correctamente.", status: 'success', duration: 5000, isClosable: true });
          fetchSuppliers();
        } else {
          setLoadSave(false);
          toast({ title: 'Error.', description: `${response.code}: ${response.error}`, status: 'error', duration: 5000, isClosable: true })
        }
      } catch (error) {
        setLoadSave(false);
        setIsOpen(false);
        toast({ title: 'Error.', description: "Ha ocurrido un error al guardar el proveedor. Inténtalo de nuevo más tarde.", status: 'error', duration: 5000, isClosable: true })
      }
    }

    return (
        <Grid bg="#fff" borderRadius="xl">
          <Divider orientation='horizontal'/>
          <Flex p={3}>
            <Text textTransform="uppercase" fontSize="lg" fontWeight="bold" color="black">Proveedores</Text>
          </Flex>
          <Flex p={3} justifyContent="space-between" alignItems="center">
            <Grid>
            <InputGroup>
              <InputLeftElement pointerEvents='none'>
                <Icon color='gray.300' as={BsSearch} mr={1}/>
              </InputLeftElement>
              <Input value={filter.search} name="search" onChange={searchSupplier} borderRadius={"full"} type='text' placeholder='Buscar' />
            </InputGroup>
            </Grid>
            <Grid>
              <Button fontSize={['xs', 'md']} onClick={() => addSupplier()} bg="primary.500" color="#fff" borderRadius="full" fontWeight={"light"} outline="none" _hover={{ bg: '#fff', color: "primary.500" }}  ml={1} mr={isMobile ? 0 : 3}>
              {isMobile ? ( <><Icon as={BsPlusLg} mr={1}/>Añadir</> ) : ( <><Icon as={BsPlusLg} mr={1}/>Añadir proveedor</> )}
              </Button>
            </Grid>
          </Flex>
          <Divider orientation='horizontal'/>
          { !suppliersIsLoading &&
            <Grid overflow={"auto"}>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    {columns.map((col) => (
                      <Th key={col.field} onClick={() => handleSort(col.field)} cursor="pointer" fontWeight="medium" fontSize={['xs', 'md']}>
                        {col.name} {getSortIcon(col.field)}
                      </Th>
                    ))}
                  </Tr>
                </Thead>
                <Tbody>
                  {data.map((item) => (
                    <Tr borderBottom={"1px solid #EDF2F7"} key={item.id} onClick={() => openSupplierDetails(item)} _hover={{ bgColor: "#685cfe4d", cursor: "pointer" }}>
                      <Td borderBottom={"0px"} whiteSpace="nowrap">
                        <Flex alignItems="center" justifyContent="flex-start">
                          <Avatar size='md' name={item.contact_name} mr={2} />
                          <Text fontWeight="medium" fontSize={['xs', 'md']}>{item.contact_name}</Text>
                        </Flex>
                      </Td>
                      <Td whiteSpace="nowrap" borderBottom={"0px"}>
                        <Box>
                          {item.contact_phone && <Flex alignItems="center" justifyContent="flex-start" mb={2}>
                            <Icon as={BsTelephone} mr={1}/>
                            <Text fontSize={['xs', 'md']}>{item.contact_phone}</Text>
                          </Flex>}
                          {item.contact_email && <Flex alignItems="center" justifyContent="flex-start">
                            <Icon as={BsEnvelope} mr={1}/>
                            <Text fontSize={['xs', 'md']}>{item.contact_email}</Text>
                          </Flex>}
                        </Box>
                      </Td>
                      <Td borderBottom={"0px"} whiteSpace="nowrap">
                        <Link href={item.website} isExternal alignItems="center" justifyContent="flex-start" mb={2}>
                          <Text fontSize={['xs', 'md']} fontWeight="normal">{item.name} <Icon as={BsBoxArrowInUpRight} ml={1}/></Text>
                        </Link>
                      </Td>
                      
                      {isMobile ? (
                        <Td borderBottom={"0px"} fontSize={['xs', 'md']}>
                          <Box maxW="250px" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap" wordWrap="break-word">
                            {item.full_address}
                          </Box>
                        </Td>
                      ) : (
                        <Td borderBottom={"0px"} fontSize={['xs', 'md']}>
                          <Box maxW="350px" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap" wordWrap="break-word">
                            {item.full_address}
                          </Box>
                        </Td>
                      )}
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Grid>
          }

          { suppliersIsLoading && 
            <Flex alignItems="center" justifyContent="center" minH={250} w="100%">
              <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='primary.500' size='lg' mr={2}/>
            </Flex>
          }

          <Modal isOpen={isOpen} size={"2xl"} onClose={handleClose}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>Proveedor</ModalHeader>
            <ModalCloseButton />
            { !modalIsLoading && <>
              <ModalBody>
                <Tabs colorScheme='primary'>
                    <TabList overflowX="auto" overflowY="hidden">
                        <Tab fontSize={['xs', 'md']} border="0">Detalles</Tab>
                        <Tab fontSize={['xs', 'md']} border="0">Información pago</Tab>
                        <Tab fontSize={['xs', 'md']} border="0">Productos</Tab>
                        <Tab fontSize={['xs', 'md']} border="0">Pedidos</Tab>
                    </TabList>
                    { !isMobile && <TabIndicator mt="-1.5px" height="2px" bg="primary.500" borderRadius="1px"/>}
                    <TabPanels>
                        <TabPanel>
                            <Stack direction="row" spacing={3} mb={3}>
                                <FormControl isRequired flex={1} mb={3}>
                                    <FormLabel>Nombre de contacto</FormLabel>
                                    <Input borderColor={invalidFields.includes('contact_name') ? 'red' : null} variant="filled" value={supplierDetails.contact_name} name="contact_name" onChange={handleChangeSupplierDetails} placeholder="Ingrese el nombre del contacto" />
                                </FormControl>
                            </Stack>
                            <Stack direction="row" spacing={3} mb={3}>
                                <FormControl flex={1} mb={3}>
                                    <FormLabel>Email de contacto</FormLabel>
                                    <Input variant="filled" value={supplierDetails.contact_email} name="contact_email" onChange={handleChangeSupplierDetails} type="email" placeholder="E-mail" />
                                </FormControl>
                                <FormControl flex={1} mb={3}>
                                    <FormLabel>Teléfono de contacto</FormLabel>
                                    <Input variant="filled" value={supplierDetails.contact_phone} name="contact_phone" onChange={handleChangeSupplierDetails} type="tel" placeholder="Teléfono" />
                                </FormControl>
                            </Stack>
                            <Stack direction="row" spacing={3} mb={3}>
                                <FormControl isRequired flex={1} mb={3}>
                                    <FormLabel>Nombre de la empresa</FormLabel>
                                    <Input borderColor={invalidFields.includes('name') ? 'red' : null} variant="filled" value={supplierDetails.name} name="name" onChange={handleChangeSupplierDetails} placeholder="Ingrese el nombre de la empresa" />
                                </FormControl>
                            </Stack>
                            <Stack direction="row" spacing={3} mb={3}>
                                <FormControl flex={1} mb={3}>
                                    <FormLabel>URL de la empresa</FormLabel>
                                    <Input variant="filled" value={supplierDetails.website} name="website" onChange={handleChangeSupplierDetails} placeholder="Ingrese la URL de la empresa" />
                                </FormControl>
                            </Stack>
                            <Stack direction="row" spacing={3} mb={3}>
                                <FormControl flex={1} mb={3}>
                                    <FormLabel>Dirección de la empresa</FormLabel>
                                    <Input variant="filled" value={supplierDetails.full_address} name="full_address" onChange={handleChangeSupplierDetails} placeholder="Ingrese la dirección de la empresa" />
                                </FormControl>
                            </Stack>

                        </TabPanel>
                        <TabPanel>
                          TODO PAGO
                        </TabPanel>
                        <TabPanel>
                          TODO PRODUCTOS
                        </TabPanel>
                        <TabPanel>
                          TODO PEDIDOS
                        </TabPanel>
                    </TabPanels>
                </Tabs>
                  
              </ModalBody>
              <ModalFooter>
                { loadSave && <Grid width="100%" alignItems="center" justifyContent="center"><Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='primary.500' size='lg' mr={2}/></Grid>}
                { !loadSave && <Button colorScheme="blue" mr={3} onClick={saveSupplier}>Guardar</Button>}
                { !loadSave && <Button colorScheme="red" onClick={handleClose}>Cancelar</Button>}
              </ModalFooter>
            </>}

            { modalIsLoading && 
              <Flex alignItems="center" justifyContent="center" minH={250} w="100%">
                <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='primary.500' size='lg' mr={2}/>
              </Flex>
            }
            </ModalContent>
          </Modal>
        </Grid>
    );
  };