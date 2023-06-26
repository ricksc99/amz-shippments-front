import React, { useState, useEffect } from 'react';
import { TabIndicator, useBreakpointValue, useToast, Spinner, Editable, EditablePreview, EditableInput, Tabs, TabList, Tab, TabPanels, TabPanel, Stack, Select, NumberInput, NumberInputField, Modal, ModalContent, ModalFooter, ModalBody, FormControl, FormLabel, ModalCloseButton, ModalHeader, ModalOverlay, InputGroup, InputLeftElement, Input, Icon, Avatar, Table, Thead, Tr, Th, Td, Tbody, Box, Link, Button, Flex, Text, Grid, Divider } from '@chakra-ui/react';
import { BsDownload, BsXLg, BsPlusLg, BsSearch, BsBoxArrowInUpRight, BsTelephone, BsEnvelope, BsTrash3 } from "react-icons/bs";
import { ChevronDownIcon, ChevronUpIcon, EmailIcon, PhoneIcon } from "@chakra-ui/icons";
import * as SuppliersService from "../../services/SuppliersService";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AlertDialogCustom } from '../../components/general/AlertDialogCustom';
import { SupplierDetails } from './SupplierDetails';
import { NotResults } from '../../components/general/NotResults';

export function Suppliers () {
    const isMobile = useBreakpointValue({ base: true, md: false });
    const [suppliersIsLoading, setSuppliersIsLoading] = useState(false);
    const [filter, setFilter] = useState({});
    const [supplierDetails, setSupplierDetails] = useState({});
    const [isOpen, setIsOpen] = useState(false);
    const toast = useToast()
    const [data, setData] = useState([]);
    const [modalIsLoading, setModalIsLoading] = useState(false);
    const [invalidFields, setInvalidFields] = useState([]);
    const [notExistResults, setNotExistResults] = useState(false);
    
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
        setNotExistResults(false);
        const response = await SuppliersService.getAllSuppliers("id,contact_name,contact_email,contact_phone,name,full_address");
        setData(response.data);
        setSuppliersIsLoading(false);
        if (response.data.length == 0) {
          setNotExistResults(true);
        }
      } catch (error) {
        setSuppliersIsLoading(false);
        setNotExistResults(true);
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
          { !suppliersIsLoading && !notExistResults &&
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

          { notExistResults &&
            <NotResults addCallback={addSupplier} />
          }

          <SupplierDetails 
            setIsOpen={setIsOpen} 
            isOpen={isOpen} 
            fetchSuppliers={fetchSuppliers} 
            supplierDetails={supplierDetails} 
            setSupplierDetails={setSupplierDetails} 
            handleClose={handleClose}
            invalidFields={invalidFields}
            setInvalidFields={setInvalidFields}
          />
        </Grid>
    );
  };