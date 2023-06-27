import React, { useState } from 'react';
import { TabIndicator, useBreakpointValue, useToast, Spinner, Tabs, TabList, Tab, TabPanels, TabPanel, Stack, Modal, ModalContent, ModalFooter, ModalBody, FormControl, FormLabel, ModalCloseButton, ModalHeader, ModalOverlay, Input, Icon, Button, Flex, Text, Grid } from '@chakra-ui/react';
import { BsDownload, BsXLg, BsTrash3 } from "react-icons/bs";
import * as SuppliersService from "../../services/SuppliersService";
import { AlertDialogCustom } from '../../components/general/AlertDialogCustom';

export function SupplierDetails ({ isOpen, fetchSuppliers, supplierDetails, setSupplierDetails, handleClose, setIsOpen, invalidFields, setInvalidFields }) {
    const isMobile = useBreakpointValue({ base: true, md: false });
    const [loadSave, setLoadSave] = useState(false);
    const toast = useToast()
    const [modalIsLoading, setModalIsLoading] = useState(false);
    const [alertRemoveSupplier, setAlertRemoveSupplier] = useState(false);
    
    const handleChangeSupplierDetails = (e) => {
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

    const removeSupplier = async (remove) => {
      if (remove) {
        
        setAlertRemoveSupplier(false);
        setModalIsLoading(true);
        const response = await SuppliersService.removeSupplier(supplierDetails.id);
        
        if (response.data != null) {
          setSupplierDetails({});
          setModalIsLoading(false);
          setIsOpen(false);
          toast({ title: 'Guardado.', description: "Se ha eliminado el proveedor correctamente.", status: 'success', duration: 5000, isClosable: true });
          fetchSuppliers();
        } else {
          setModalIsLoading(false);
          toast({ title: 'Error.', description: `${response.code}: ${response.error}`, status: 'error', duration: 5000, isClosable: true })
        }
      } else {
        setAlertRemoveSupplier(true);
      }
    }

    return (
        <>
          <Modal scrollBehavior={"inside"} isOpen={isOpen} size={"2xl"} onClose={handleClose}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>Proveedor</ModalHeader>
            <ModalCloseButton />
            { !modalIsLoading && <>
              <ModalBody pl={["1", "6"]} pr={["1", "6"]}>
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
              <ModalFooter pl={["1", "6"]} pr={["1", "6"]} alignItems="center" justifyContent="space-between">
                <Flex alignItems="center" justifyContent="center" cursor="pointer" textDecor="underline" onClick={() => removeSupplier(false)}>
                  { supplierDetails.id &&
                    <>
                      <Icon as={BsTrash3} mr={1}/>
                      <Text>Eliminar</Text>
                    </>
                  }
                </Flex>
                <Flex alignItems="center" justifyContent="center">
                  { loadSave && <Grid width="100%" alignItems="center" justifyContent="center"><Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='primary.500' size='lg' mr={2}/></Grid>}
                  { !loadSave && <Button colorScheme="blue" mr={3} onClick={saveSupplier}><Icon as={BsDownload} mr={1}/>Guardar</Button>}
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
            title="Eliminar proveedor" 
            subtitle="¿Estás seguro? Está acción no podrá deshacerse." 
            isOpen={alertRemoveSupplier} 
            cancelCallback={() => setAlertRemoveSupplier(false)}
            removeCallback={() => removeSupplier(true)}
          />
        </>
    );
  };