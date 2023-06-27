import { useRef, useState, useEffect } from 'react';
import { useBreakpointValue, TabIndicator, Stepper, Step, StepIndicator, StepStatus, StepIcon, StepNumber, StepTitle, StepDescription, StepSeparator, useSteps, Tabs, TabList, Tab, TabPanels, TabPanel, AccordionIcon, Accordion, AccordionItem, AccordionButton, AccordionPanel, Skeleton, Stack, Select, NumberInput, IconButton, NumberInputField, Flex, Text, Grid, Divider, Icon, Box, Tag, TagLabel, useDisclosure, Modal, ModalContent, ModalFooter, Button, ModalBody, FormControl, Input, FormLabel, ModalCloseButton, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import { parseISO, format, isAfter, isBefore  } from 'date-fns'
import { BiTime, BiMoney, BiPlus } from "react-icons/bi";
import { IoBoatOutline, IoTrainOutline, IoAirplaneOutline, IoPersonOutline } from "react-icons/io5";
import { BsTruck } from "react-icons/bs";
import * as OrdersService from "../../services/OrdersService";
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

function getIconTypeShippment (id) {
    switch(id) {
        case 1: //Barco
            return IoBoatOutline;
        case 2: //Tren
            return IoTrainOutline;
        case 3: //Camión
            return BsTruck;
        case 4: //Avión
            return IoAirplaneOutline;
      }
}

function getBalancePayment (order) {
    var pending = 0;
    if (order && order.payments && order.payments.length > 0) {
        for (var i = 0; i < order.payments.length; i++) {
            var payment = order.payments[i];
            if (payment.paymentMade == false) {
                pending += payment.value;
            }
        }
    }
    return pending;
}  

function currencyFormat(num) {
    return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + '€';
}

function isExpiredDate(date) {
    var status = 0; //0 = No ha expirado; 1 = Ha expirado; 2 = Es igual;
    var fechaActual = new Date();
    var date = parseISO(date);
    if (isAfter(date, fechaActual)) {
        status = 0;
    } else if (isBefore(date, fechaActual)) {
        status = 1;
    } else {
        status = 2;
    }
    return status;
}

export function Orders () {
    const columnRefs = [useRef(null), useRef(null), useRef(null)];
    const isMobile = useBreakpointValue({ base: true, md: false });
    const [isOpen, setIsOpen] = useState(false);
    const [orderDetails, setOrderDetails] = useState({});
    const [ordersData, setOrdersData] = useState({});
    const [ordersIsLoading, setOrdersIsLoading] = useState(false);
    const steps = [
        { title: 'Etiqueta creada' },
        { title: 'En camino' },
        { title: 'En reparto' },
        { title: 'Entregado' }
    ]
    const { activeStep } = useSteps({
        index: 1,
        count: steps.length,
    })
    const [scrollTimer, setScrollTimer] = useState(null);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [actualColumnPosition, setActualColumnPosition] = useState(0);
    const [handleScrollStarted, setHandleScrollStarted] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
          try {
            setOrdersIsLoading(true);
            const response = await OrdersService.getAllOrders();
            setOrdersData(response);
            setOrdersIsLoading(false);
          } catch (error) {
            setOrdersIsLoading(false);
            console.error('Error fetching orders:', error);
          }
        };
    
        fetchOrders();
    }, []);

    const openOrderDetails = (order) => {
        setIsOpen(true);
        setOrderDetails(order);
    }

    const handleOpen = () => {
      setIsOpen(true);
    };
  
    const handleClose = () => {
      setIsOpen(false);
    };

    const handleChangeOrderDetails = (e, type, index) => {
        if (type == "payment" && index >= 0) {
            orderDetails.payments[index][e.target.name] = e.target.value;
            setOrderDetails({ ...orderDetails });
        } else {
            setOrderDetails({ ...orderDetails, [e.target.name]: e.target.value });
        }
    };

    const addPayment = () => {
        orderDetails.payments.push({ value: null, percent: null });
        setOrderDetails({ ...orderDetails });
    }

    const addOrder = (typeOrder) => {
        openOrderDetails({ typeOrder, isNew: true });
    }

    const handleDragStart = (start) => {
        // Lógica de inicio del arrastre
    };
    
    const handleDragEnd = (result) => {
        // Obtener información sobre la tarea arrastrada y la ubicación de destino
        const { draggableId, source, destination } = result;

        // Comprobar si hay una ubicación de destino válida
        if (!destination) {
            return;
        }

        // Comprobar si la tarea se ha movido a una posición diferente
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return;
        }

        // Realizar la actualización del orden de las tareas en función de los datos proporcionados
        // (puedes modificar los datos según tus necesidades)
    };
    
    const handleScroll = (event) => {
        // if (!handleScrollStarted) {
        //     setHandleScrollStarted(true);
        //     clearTimeout(scrollTimer);
        //     // Inicia un nuevo temporizador para detectar el final del scroll en móvil
        //     const newScrollTimer = setTimeout(() => {
        //         // Lógica adicional que deseas ejecutar cuando el scroll ha finalizado en móvil
        //         const { scrollLeft: newScrollLeft } = event.target;
            
        //         // Calcula el ancho de cada columna (250px) y el punto de cambio
        //         var columnsOrder = document.getElementsByClassName("columnOrder");
        //         var columnWidth = 250;
        //         if (columnsOrder && columnsOrder.length > 0) {
        //             columnWidth = columnsOrder[0].clientWidth;
        //         }
        //         const breakpoint = columnWidth / 2;
            
        //         var newIndexColumn = -1;
            
        //         if (newScrollLeft > scrollLeft) {
        //             // Scroll hacia la derecha
        //             if (columnRefs[actualColumnPosition+1]) {
        //                 newIndexColumn = actualColumnPosition+1;
        //             } else {
        //                 newIndexColumn = -1;
        //             }
        //         } else if (newScrollLeft < scrollLeft) {
        //             // Scroll hacia la izquierda
        //             if (columnRefs[actualColumnPosition-1]) {
        //                 newIndexColumn = actualColumnPosition-1;
        //             } else {
        //                 newIndexColumn = -1;
        //             }
        //         }
              
        //         setScrollLeft(newScrollLeft);
    
        //         // Comprueba si el scroll se encuentra más cerca del punto de cambio
        //         // en lugar de estar en el inicio de una columna
        //         if (newIndexColumn > -1) {
        //             columnRefs[newIndexColumn].current.scrollIntoView({
        //                 behavior: 'smooth',
        //                 block: 'start',
        //                 inline: 'center',
        //             });
        //             setActualColumnPosition(newIndexColumn);
        //         }
        //         setHandleScrollStarted(false);
    
        //     }, 100); // Ajusta el tiempo según tus necesidades
        
        //     setScrollTimer(newScrollTimer); // Almacena el temporizador actual
        // }
    };

    return (
        <Grid bg="#fff" borderRadius="xl">
          <Divider orientation='horizontal'/>
          <Flex p={3}>
            <Text textTransform="uppercase" fontSize="lg" fontWeight="bold" color="black">Seguimiento de pedidos</Text>
          </Flex>
          <Divider orientation='horizontal'/>
          <Flex overflow="auto" onScroll={handleScroll}>
            { ordersIsLoading &&
                <Stack p="4" width="100%">
                    <Skeleton height='20px'/>
                    <Skeleton height='20px'/>
                    <Skeleton height='20px'/>
                </Stack>
            }
            {!ordersIsLoading && Object.entries(ordersData).map(([key, typeOrder], indexColumn) => (
                <Grid ref={columnRefs[indexColumn]} minWidth={ !isMobile ? "33%" : null} key={key} borderRadius="xl" p="4" alignContent="start">
                    <Flex alignItems="center" justifyContent="space-between">
                        <Tag
                            size={"lg"}
                            borderRadius='full'
                            variant='solid'
                            bg={typeOrder.colorTag}
                        >
                            <TagLabel fontSize={['sm', 'md']} fontWeight="light">{typeOrder.name} ({typeOrder.list.length})</TagLabel>
                        </Tag>
                        <Icon color="secondary" cursor="pointer" onClick={() => addOrder(typeOrder.id)} fontSize="4xl" as={BiPlus} fontWeight="light" p={1}/>
                    </Flex>
                    <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
                        { typeOrder.list && typeOrder.list.length > 0 &&
                            <Droppable droppableId={typeOrder.name}>
                                {(provided, snapshot) => (
                                    <Grid className="columnOrder" mt={2} minWidth="250px" {...provided.droppableProps} ref={provided.innerRef}>
                                        {typeOrder.list.map((order, index) => (
                                            <Draggable key={order.id} draggableId={order.id.toString()} index={index}>
                                                {provided => (
                                                    <Box 
                                                        cursor="pointer"
                                                        onClick={() => openOrderDetails(order)}
                                                        _hover={{ bg: '#f3f3f3' }} 
                                                        key={order.id} 
                                                        height="fit-content" 
                                                        border="1px solid" 
                                                        borderColor="gray.200" 
                                                        bg="#fff" 
                                                        boxShadow='md' 
                                                        alignItems="center" 
                                                        justifyContent="start" 
                                                        rounded="md" 
                                                        mb={2} 
                                                        p={3}
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <Flex alignItems="center" justifyContent="space-between" mb={2}>
                                                            <Text fontSize={['xs', 'md']} fontWeight="medium" color="black">{order.name} - {order.quantity} unidades</Text>
                                                            <Icon color="secondary" fontSize="2xl" as={getIconTypeShippment(order.idTypeShipment)} fontWeight="normal" p={1}/>
                                                        </Flex>
                                                        { order.end && 
                                                            <Flex>
                                                                <Flex alignItems="center" bg={isExpiredDate(order.end) == 1 ? "#ff4040" : ""} rounded="md" p={1}>
                                                                    <Icon color={isExpiredDate(order.end) == 1 ? "#fff" : "secondary"} fontSize="xl" as={BiTime} fontWeight="normal" p={1}/>
                                                                    <Text color={isExpiredDate(order.end) == 1 ? "#fff" : ""} fontSize={['2xs', 'xs']} fontWeight="normal">{format(parseISO(order.end), 'd MMMM')}</Text>
                                                                </Flex>
                                                                { typeOrder.id == 1 &&
                                                                    <Flex alignItems="center" ml={2}>
                                                                        <Icon color="secondary" fontSize="xl" as={BiMoney} fontWeight="normal" p={1}/>
                                                                        <Text fontSize={['2xs', 'xs']} fontWeight="normal">{currencyFormat(getBalancePayment(order))} restantes</Text>
                                                                    </Flex>
                                                                }
                                                                { typeOrder.id == 2 && order.nameShippingSupplier &&
                                                                    <Flex alignItems="center" ml={2}>
                                                                        <Icon color="secondary" fontSize="xl" as={IoPersonOutline} fontWeight="normal" p={1}/>
                                                                        <Text fontSize={['2xs', 'xs']} fontWeight="normal">Envío con {order.nameShippingSupplier}</Text>
                                                                    </Flex>
                                                                }
                                                                { typeOrder.id == 3 && order.totalCosts &&
                                                                    <Flex alignItems="center" ml={2}>
                                                                        <Icon color="secondary" fontSize="xl" as={BiMoney} fontWeight="normal" p={1}/>
                                                                        <Text fontSize={['2xs', 'xs']} fontWeight="normal">Total {currencyFormat(order.totalCosts)}</Text>
                                                                    </Flex>
                                                                }
                                                            </Flex>
                                                        }

                                                        { typeOrder.id == 2 &&
                                                            <Grid>
                                                                <Stepper mt={2} size='xs' index={2} gap='0'>
                                                                {steps.map((step, index) => (
                                                                    <Step key={index} gap='0'>
                                                                    <StepIndicator>
                                                                        <StepStatus complete={<StepIcon />} />
                                                                    </StepIndicator>
                                                                    <StepSeparator _horizontal={{ ml: '0' }} />
                                                                    </Step>
                                                                ))}
                                                                </Stepper>
                                                                <Flex alignItems="center" justifyContent="center">
                                                                    <Text fontSize={['2xs', 'xs']} fontWeight="normal">En tránsito</Text>
                                                                </Flex>
                                                                <Flex mt={2} alignItems="center" justifyContent="space-between">
                                                                    <Flex direction="column" textAlign="start">
                                                                        <Text fontSize={['2xs', 'xs']} fontWeight="bold">Shanghai</Text>
                                                                        <Text fontSize={['2xs', 'xs']} fontWeight="light">China</Text>
                                                                    </Flex>
                                                                    <Flex direction="column" textAlign="end">
                                                                        <Text fontSize={['2xs', 'xs']} fontWeight="bold">Los Ángeles</Text>
                                                                        <Text fontSize={['2xs', 'xs']} fontWeight="light">USA</Text>
                                                                    </Flex>
                                                                </Flex>
                                                            </Grid>
                                                        }
                                                    </Box>
                                                )}
                                            </Draggable>
                                        ))} 
                                    </Grid>
                                )}
                            </Droppable>
                        }
                    </DragDropContext>
                </Grid>
            ))}
          </Flex>
          <Modal scrollBehavior={"inside"} isOpen={isOpen} size={"2xl"} onClose={handleClose}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>Modal de Pedido</ModalHeader>
            <ModalCloseButton />
            <ModalBody pl={["1", "6"]} pr={["1", "6"]}>
                <Tabs colorScheme='primary'>
                    <TabList overflowX="auto" overflowY="hidden">
                        { orderDetails.isNew != true && <Tab border="0">Detalles</Tab>}
                        { orderDetails.isNew != true && <Tab border="0">Seguimiento</Tab> }
                    </TabList>
                    { !isMobile && <TabIndicator mt="-1.5px" height="2px" bg="primary.500" borderRadius="1px"/>}
                    <TabPanels>
                        <TabPanel>
                            <Stack direction={{ base: "column", md: "row" }} spacing={3} mb={3}>
                                <FormControl flex={1} mb={3}>
                                    <FormLabel>Nombre de Pedido</FormLabel>
                                    <Input variant="filled" value={orderDetails.name} name="name" onChange={handleChangeOrderDetails} placeholder="Ingrese el nombre del pedido" />
                                </FormControl>
                                <FormControl flex={0.6}>
                                    <FormLabel>Fecha de Vencimiento</FormLabel>
                                    <Input variant="filled" type="date" />
                                </FormControl>
                            </Stack>

                            <Stack direction={{ base: "column", md: "row" }} spacing={3} mb={3}>
                                <FormControl flex={1}>
                                    <FormLabel>Producto</FormLabel>
                                    <Select variant="filled" placeholder="Selecciona">
                                        <option>Producto 1</option>
                                        <option>Producto 2</option>
                                        <option>Producto 3</option>
                                    </Select>
                                </FormControl>

                                <FormControl flex={0.3}>
                                    <FormLabel>Cantidad</FormLabel>
                                    <NumberInput variant="filled">
                                    <NumberInputField />
                                    </NumberInput>
                                </FormControl>
                            </Stack>
                    
                            <Accordion allowToggle mt={5}>
                                <AccordionItem>
                                    <AccordionButton>
                                        <Box as="span" flex='1' textAlign='left'>
                                            <Text fontSize="lg" fontWeight="light">
                                                Opciones avanzadas
                                            </Text>
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                    <AccordionPanel pb={4}>
                                        <Stack direction={{ base: "column", md: "row" }} spacing={3} mb={3}>
                                            <FormControl flex={1}>
                                                <FormLabel>Proveedor</FormLabel>
                                                <Select variant="filled" placeholder="Selecciona">
                                                    <option>Proveedor 1</option>
                                                    <option>Proveedor 2</option>
                                                    <option>Proveedor 3</option>
                                                </Select>
                                            </FormControl>
                                            <FormControl flex={1}>
                                                <FormLabel>Tipo de Envío</FormLabel>
                                                <Select variant="filled" placeholder="Selecciona">
                                                    <option>Barco</option>
                                                    <option>Avión</option>
                                                    <option>Tren</option>
                                                    <option>Camión</option>
                                                </Select>
                                            </FormControl>
                                        </Stack>

                                        <Stack direction="row" spacing={3} mb={3}>
                                            <FormControl flex={1}>
                                                <FormLabel>Estado</FormLabel>
                                                <Select variant="filled" placeholder="Selecciona">
                                                    <option>En producción</option>
                                                    <option>En tránsito</option>
                                                    <option>Entregado</option>
                                                </Select>
                                            </FormControl>
                                        </Stack>

                                        <FormControl mb={3}>
                                            <FormLabel>Pagos</FormLabel>
                                            <Stack spacing={2}>
                                                { orderDetails.payments && orderDetails.payments.map((payment, index) => (
                                                    <Stack direction="row">
                                                        <Input variant="filled" placeholder="Pago" value={payment.value} name="value" onChange={(e) => handleChangeOrderDetails(e, 'payment', index)} />
                                                        <Input variant="filled" placeholder="Porcentaje" name="percent" value={payment.percent} onChange={(e) => handleChangeOrderDetails(e, 'payment', index)} />
                                                    </Stack>
                                                ))}
                                            </Stack>
                                            <Button colorScheme="blue" mt={2} onClick={addPayment}>
                                                <BiPlus /> Añadir pago
                                            </Button>
                                        </FormControl>
                                    </AccordionPanel>
                                </AccordionItem>
                            </Accordion>
                        </TabPanel>
                        <TabPanel>
                        <Stepper index={activeStep} orientation='vertical' height='400px' gap='0'>
                            {steps.map((step, index) => (
                                <Step key={index}>
                                <StepIndicator>
                                    <StepStatus
                                    complete={<StepIcon />}
                                    incomplete={<StepNumber />}
                                    active={<StepNumber />}
                                    />
                                </StepIndicator>

                                <Box flexShrink='0'>
                                    <StepTitle>{step.title}</StepTitle>
                                    <StepDescription>{step.description}</StepDescription>
                                </Box>

                                <StepSeparator />
                                </Step>
                            ))}
                            </Stepper>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
                
            </ModalBody>
            <ModalFooter pl={["1", "6"]} pr={["1", "6"]}>
                <Button colorScheme="blue" mr={3} onClick={handleClose}>
                Guardar
                </Button>
                <Button colorScheme="red" onClick={handleClose}>Cancelar</Button>
            </ModalFooter>
            </ModalContent>
          </Modal>
        </Grid>
    );
  };