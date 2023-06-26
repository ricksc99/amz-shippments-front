import React, { useState, useEffect } from 'react';
import { Image, TabIndicator, useBreakpointValue, useToast, Spinner, Editable, EditablePreview, EditableInput, Tabs, TabList, Tab, TabPanels, TabPanel, Stack, Select, NumberInput, NumberInputField, Modal, ModalContent, ModalFooter, ModalBody, FormControl, FormLabel, ModalCloseButton, ModalHeader, ModalOverlay, InputGroup, InputLeftElement, Input, Icon, Avatar, Table, Thead, Tr, Th, Td, Tbody, Box, Link, Button, Flex, Text, Grid, Divider } from '@chakra-ui/react';
import { BsImage, BsXLg, BsPlusLg, BsSearch, BsBoxArrowInUpRight, BsTelephone, BsEnvelope, BsTrash3 } from "react-icons/bs";
import { ChevronDownIcon, ChevronUpIcon, EmailIcon, PhoneIcon } from "@chakra-ui/icons";
import * as ProductsService from "../../services/ProductsService";
import * as SuppliersService from "../../services/SuppliersService";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ProductDetails } from './ProductDetails';
import API_URL from '../../environment';
import { NotResults } from '../../components/general/NotResults';

export function Products () {
    const isMobile = useBreakpointValue({ base: true, md: false });
    const [productsIsLoading, setProductsIsLoading] = useState(false);
    const [filter, setFilter] = useState({});
    const [productDetails, setProductDetails] = useState({});
    const [isOpen, setIsOpen] = useState(false);
    const toast = useToast()
    const [data, setData] = useState([]);
    const [invalidFields, setInvalidFields] = useState([]);
    const [listSuppliers, setListSuppliers] = useState([]);
    const [notExistProducts, setNotExistProducts] = useState(false);
    
    const columns = [
      { name: "Producto", field: 'name' },
      { name: "Precio", field: 'selling_price' },
      { name: "ASIN", field: 'asin' },
      { name: "SKU", field: 'sku' },
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

    const currencyFormat = (num) => {
        return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + '€';
    }

    //Al iniciar el componente
    useEffect(() => {
        fetchProducts();
        fetchSuppliers()
    }, []);

    //Al cambiar de estado el objeto filter
    useEffect(() => {
      if (filter && filter.search != null) {

      }
    }, [filter]);

    const fetchProducts = async () => {
      try {
        setNotExistProducts(false);
        setProductsIsLoading(true);
        const response = await ProductsService.getAllProducts("id,contact_name,contact_email,contact_phone,name,full_address");
        setData(response.data);
        setProductsIsLoading(false);
        if (response.data.length == 0) {
            setNotExistProducts(true);
        }
      } catch (error) {
        setProductsIsLoading(false);
        console.error('Error fetching orders:', error);
      }
    };

    const fetchSuppliers = async () => {
      try {
        let response = await SuppliersService.getAllSuppliers("id,contact_name,name");
        response.data = response.data.map(item => ({
            value: item.id,
            label: item.contact_name
        }));
        setListSuppliers(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    const searchProduct = (e) => {
      setFilter({ ...filter, [e.target.name]: e.target.value });
    };

    const openProductDetails = async (product) => {
        if (product.isNew) {
          setIsOpen(true);
          setProductDetails(product);
        } else {
          try {
            setProductDetails(product);
            setIsOpen(true);
            // const response = await ProductsService.getProductById(product.id);
            // setProductDetails(response.data);
          } catch (error) {
            console.error('Error fetching orders:', error);
          }
        }
    }

    const addProduct = () => {
        openProductDetails({ isNew: true });
    }

    const handleClose = () => {
      setIsOpen(false);
      setInvalidFields([]);
      setProductDetails({});
    };

    return (
        <Grid bg="#fff" borderRadius="xl">
          <Divider orientation='horizontal'/>
          <Flex p={3}>
            <Text textTransform="uppercase" fontSize="lg" fontWeight="bold" color="black">Productos</Text>
          </Flex>
          <Flex p={3} justifyContent="space-between" alignItems="center">
            <Grid>
            <InputGroup>
              <InputLeftElement pointerEvents='none'>
                <Icon color='gray.300' as={BsSearch} mr={1}/>
              </InputLeftElement>
              <Input value={filter.search} name="search" onChange={searchProduct} borderRadius={"full"} type='text' placeholder='Buscar' />
            </InputGroup>
            </Grid>
            <Grid>
              <Button fontSize={['xs', 'md']} onClick={() => addProduct()} bg="primary.500" color="#fff" borderRadius="full" fontWeight={"light"} outline="none" _hover={{ bg: '#fff', color: "primary.500" }}  ml={1} mr={isMobile ? 0 : 3}>
              {isMobile ? ( <><Icon as={BsPlusLg} mr={1}/>Añadir</> ) : ( <><Icon as={BsPlusLg} mr={1}/>Añadir producto</> )}
              </Button>
            </Grid>
          </Flex>
          <Divider orientation='horizontal'/>
          { !productsIsLoading && !notExistProducts &&
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
                    <Tr borderBottom={"1px solid #EDF2F7"} key={item.id} onClick={() => openProductDetails(item)} _hover={{ bgColor: "#685cfe4d", cursor: "pointer" }}>
                      <Td borderBottom={"0px"} whiteSpace="nowrap">
                        <Flex alignItems="center" justifyContent="flex-start">
                          { item.main_image != null ? 
                            <Image borderRadius="lg" w={50} src={`${API_URL}/img/${item.main_image}`} />:
                            <Flex w={50} alignItems="center" justifyContent="center">
                                <Icon fontSize={"2xl"} color="grey.500" as={BsImage} mr={1}/> 
                            </Flex>
                          }
                          <Text ml={3} fontWeight="medium" fontSize={['xs', 'md']}>{item.name}</Text>
                        </Flex>
                      </Td>
                      <Td whiteSpace="nowrap" borderBottom={"0px"}>
                        <Box>
                          <Text fontWeight="medium" fontSize={['xs', 'md']}>{item.selling_price ? currencyFormat(item.selling_price) : "0€"}</Text>
                        </Box>
                      </Td>
                      <Td borderBottom={"0px"} whiteSpace="nowrap">
                        <Box>
                          <Text fontWeight="medium" fontSize={['xs', 'md']}>{item.asin}</Text>
                        </Box>
                      </Td>
                      <Td borderBottom={"0px"} whiteSpace="nowrap">
                        <Box>
                          <Text fontWeight="medium" fontSize={['xs', 'md']}>{item.sku}</Text>
                        </Box>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Grid>
          }

          { productsIsLoading && 
            <Flex alignItems="center" justifyContent="center" minH={250} w="100%">
              <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='primary.500' size='lg' mr={2}/>
            </Flex>
          }

          { isOpen &&
            <ProductDetails 
                listSuppliers={listSuppliers}
                setIsOpen={setIsOpen} 
                isOpen={isOpen} 
                fetchProducts={fetchProducts} 
                productDetails={productDetails} 
                setProductDetails={setProductDetails} 
                handleClose={handleClose}
                invalidFields={invalidFields}
                setInvalidFields={setInvalidFields}
            />
          }

          { notExistProducts &&
            <NotResults addCallback={addProduct} />
          }

        </Grid>
    );
  };