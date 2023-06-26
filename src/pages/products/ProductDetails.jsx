import React, { useRef, useEffect, useState } from 'react';
import { Box, Image, TabIndicator, useBreakpointValue, useToast, Spinner, Tabs, TabList, Tab, TabPanels, TabPanel, Stack, Modal, ModalContent, ModalFooter, ModalBody, FormControl, FormLabel, ModalCloseButton, ModalHeader, ModalOverlay, Input, Icon, Button, Flex, Text, Grid } from '@chakra-ui/react';
import { BsImage, BsDownload, BsXLg, BsTrash3 } from "react-icons/bs";
import * as ProductsService from "../../services/ProductsService";
import { AlertDialogCustom } from '../../components/general/AlertDialogCustom';
import '../../assets/css/products.css'
import Select from 'react-select'
import API_URL from '../../environment';

export function ProductDetails ({ isOpen, fetchProducts, productDetails, setProductDetails, handleClose, setIsOpen, invalidFields, setInvalidFields, listSuppliers }) {
    const isMobile = useBreakpointValue({ base: true, md: false });
    const [loadSave, setLoadSave] = useState(false);
    const toast = useToast()
    const [modalIsLoading, setModalIsLoading] = useState(false);
    const [alertRemoveProduct, setAlertRemoveProduct] = useState(false);
    const [autocompleteSupplier, setAutocompleteSupplier] = React.useState([]);
    const [selectedImage, setSelectedImage] = useState("");
    const fileInputRef = useRef(null);
    
    const handleChangeProductDetails = (e) => {
        setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
    };

    const fieldsRequired = ["name", "asin", "sku", "provider_id", "quantity"];

    //Al iniciar el componente
    useEffect(() => {
        if (isOpen == true) {
            if (productDetails.id) {
                getProduct();
            }
        }
    }, [isOpen]);

    const getProduct = async () => {
        setModalIsLoading(true);
        const response = await ProductsService.getProductById(productDetails.id);

        //Seleccionar proveedor
        if (response.data.provider_id && listSuppliers) {
            const supplier = listSuppliers.find(x => x.value == response.data.provider_id);
            setAutocompleteSupplier(supplier);
        }
        setProductDetails(response.data);
        setModalIsLoading(false);
    }

    const saveProduct = async () => {
      try {

        const invalidFields = [];
        // Validar campos requeridos
        for (var i = 0; i < fieldsRequired.length; i++) {
            if (!productDetails[fieldsRequired[i]]) {
              invalidFields.push(fieldsRequired[i]);
            }
        }

        if (invalidFields.length > 0) {
          setInvalidFields(invalidFields);
          toast({ title: 'Error.', description: "Rellena los campos obligatorios.", status: 'error', duration: 3000, isClosable: true })
          return;
        } else {
          setInvalidFields([]);
        }
        setLoadSave(true);
        const response = productDetails.id != null ? await ProductsService.saveProduct(productDetails) : await ProductsService.createProduct(productDetails);
        
        if (response.data != null) {
          setProductDetails({});
          setLoadSave(false);
          setIsOpen(false);
          toast({ title: 'Guardado.', description: "Se ha guardado el producto correctamente.", status: 'success', duration: 5000, isClosable: true });
          fetchProducts();
        } else {
          setLoadSave(false);
          toast({ title: 'Error.', description: `${response.code}: ${response.error}`, status: 'error', duration: 5000, isClosable: true })
        }
      } catch (error) {
        setLoadSave(false);
        setIsOpen(false);
        toast({ title: 'Error.', description: "Ha ocurrido un error al guardar el producto. Inténtalo de nuevo más tarde.", status: 'error', duration: 5000, isClosable: true })
      }
    }

    const removeProduct = async (remove) => {
      if (remove) {
        
        setAlertRemoveProduct(false);
        setModalIsLoading(true);
        const response = await ProductsService.removeProduct(productDetails.id);
        
        if (response.data != null) {
          setProductDetails({});
          setModalIsLoading(false);
          setIsOpen(false);
          toast({ title: 'Guardado.', description: "Se ha eliminado el producto correctamente.", status: 'success', duration: 5000, isClosable: true });
          fetchProducts();
        } else {
          setModalIsLoading(false);
          toast({ title: 'Error.', description: `${response.code}: ${response.error}`, status: 'error', duration: 5000, isClosable: true })
        }
      } else {
        setAlertRemoveProduct(true);
      }
    }

    const handleChangeAutocomplete = (option, select) => {
        setProductDetails({ ...productDetails, [select.name]: option.value });
        setAutocompleteSupplier(option);
    }

    const handleChangeImage = (event) => {
        const file = event.target.files[0];
        // Realiza el procesamiento necesario con el archivo (subida a servidor, validaciones, etc.)
        setSelectedImage(URL.createObjectURL(file));
        setProductDetails({ ...productDetails, main_image: file });
      };

      const handleButtonClickChangeImage = () => {
        fileInputRef.current.click();
      };

    return (
        <>
          <Modal isOpen={isOpen} size={"2xl"} onClose={handleClose}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>Producto</ModalHeader>
            <ModalCloseButton />
            { !modalIsLoading && <>
              <ModalBody>
                <Tabs colorScheme='primary'>
                    <TabList overflowX="auto" overflowY="hidden">
                        <Tab fontSize={['xs', 'md']} border="0">Detalles</Tab>
                        <Tab fontSize={['xs', 'md']} border="0">Historial de pedidos</Tab>
                    </TabList>
                    { !isMobile && <TabIndicator mt="-1.5px" height="2px" bg="primary.500" borderRadius="1px"/>}
                    <TabPanels>
                        <TabPanel>
                            <Box w={150} mb={5}>
                                <FormLabel>Imagen</FormLabel>
                                {selectedImage ? (
                                    <Image borderRadius="lg" src={selectedImage} />
                                ) : (
                                    <>
                                        { productDetails.main_image ? 
                                            <Image borderRadius="lg" src={`${API_URL}/img/${productDetails.main_image}`} /> : 
                                            <Flex cursor="pointer" onClick={handleButtonClickChangeImage} borderRadius="lg" bg="gray.100" h="100px" alignItems="center" justifyContent="center">
                                                <Icon fontSize={"2xl"} color="grey.500" as={BsImage} mr={1}/> 
                                            </Flex>
                                        }
                                    </>
                                    
                                )}
                                <Button 
                                    fontSize={['xs', 'md']} 
                                    bg="primary.500" 
                                    color="#fff" 
                                    _hover={{ bg: '#fff', color: "primary.500" }} 
                                    mt={2} 
                                    onClick={handleButtonClickChangeImage}
                                >
                                    <Icon as={BsImage} mr={1}/>
                                    <>{ productDetails.main_image ? "Cambiar imagen" : "Añadir imagen"}</>
                                </Button>
                                <Input type="file" ref={fileInputRef} display="none" onChange={handleChangeImage} />
                            </Box>
                            <Stack direction={{ base: "column", md: "row" }} spacing={3} mb={3}>
                                <FormControl isRequired flex={1} mb={3}>
                                    <FormLabel>Producto</FormLabel>
                                    <Input borderColor={invalidFields.includes('name') ? 'red' : null} variant="filled" value={productDetails.name} name="name" onChange={handleChangeProductDetails} placeholder="Ingrese el nombre del producto" />
                                </FormControl>
                                <FormControl flex={1} mb={3}>
                                    <FormLabel>Precio</FormLabel>
                                    <Input type="number" variant="filled" value={productDetails.selling_price} name="selling_price" onChange={handleChangeProductDetails} placeholder="Ingrese el precio del producto" />
                                </FormControl>
                            </Stack>
                            <Stack direction="row" spacing={3} mb={3}>
                                <FormControl isRequired flex={1} mb={3}>
                                    <FormLabel>Proveedor</FormLabel>
                                    <Select 
                                        className="select-autocomplete"
                                        classNamePrefix="select-autocomplete"
                                        name="provider_id"
                                        options={listSuppliers} 
                                        value={autocompleteSupplier}
                                        onChange={handleChangeAutocomplete}
                                        noOptionsMessage={ () => "No hay opciones"}
                                        placeholder="Selecciona proveedor"
                                        styles={{ control: (base) => ({ ...base, fontSize: isMobile ? "var(--chakra-fontSizes-xs)" : "var(--chakra-fontSizes-md)"}) }}
                                    />
                                </FormControl>
                                <FormControl isRequired flex={1} mb={3}>
                                    <FormLabel>Cantidad</FormLabel>
                                    <Input type="number" borderColor={invalidFields.includes('quantity') ? 'red' : null} variant="filled" value={productDetails.quantity} name="quantity" onChange={handleChangeProductDetails} placeholder="Ingrese la cantidad en stock" />
                                </FormControl>
                            </Stack>
                            <Stack direction="row" spacing={3} mb={3}>
                                <FormControl isRequired flex={1} mb={3}>
                                    <FormLabel>ASIN</FormLabel>
                                    <Input borderColor={invalidFields.includes('asin') ? 'red' : null} variant="filled" value={productDetails.asin} name="asin" onChange={handleChangeProductDetails} placeholder="Ingrese el ASIN del producto" />
                                </FormControl>
                                <FormControl isRequired flex={1} mb={3}>
                                    <FormLabel>SKU</FormLabel>
                                    <Input borderColor={invalidFields.includes('sku') ? 'red' : null} variant="filled" value={productDetails.sku} name="sku" onChange={handleChangeProductDetails} placeholder="Ingrese el SKU del producto" />
                                </FormControl>
                            </Stack>
                            <Stack direction="row" spacing={3} mb={3}>
                                <FormControl flex={1} mb={3}>
                                    <FormLabel>Descripción</FormLabel>
                                    <Input variant="filled" value={productDetails.description} name="description" onChange={handleChangeProductDetails} placeholder="Ingrese la descripción del producto" />
                                </FormControl>
                            </Stack>
                        </TabPanel>
                        <TabPanel>
                            TODO
                        </TabPanel>
                    </TabPanels>
                </Tabs>
                  
              </ModalBody>
              <ModalFooter alignItems="center" justifyContent="space-between">
                <Flex alignItems="center" justifyContent="center" cursor="pointer" textDecor="underline" onClick={() => removeProduct(false)}>
                  <Icon as={BsTrash3} mr={1}/>
                  <Text>Eliminar</Text>
                </Flex>
                <Flex alignItems="center" justifyContent="center">
                  { loadSave && <Grid width="100%" alignItems="center" justifyContent="center"><Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='primary.500' size='lg' mr={2}/></Grid>}
                  { !loadSave && <Button colorScheme="blue" mr={3} onClick={saveProduct}><Icon as={BsDownload} mr={1}/>Guardar</Button>}
                  { !loadSave && <Button colorScheme="red" onClick={handleClose}><Icon as={BsXLg} mr={1}/>Cancelar</Button>}
                </Flex>
              </ModalFooter>
            </>}

            { modalIsLoading && 
              <Flex alignItems="center" justifyContent="center" minH={250} w="100%">
                <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='primary.500' size='lg' mr={2}/>
              </Flex>
            }
            </ModalContent>
          </Modal>
          <AlertDialogCustom 
            title="Eliminar producto" 
            subtitle="¿Estás seguro? Está acción no podrá deshacerse." 
            isOpen={alertRemoveProduct} 
            cancelCallback={() => setAlertRemoveProduct(false)}
            removeCallback={() => removeProduct(true)}
          />
        </>
    );
  };