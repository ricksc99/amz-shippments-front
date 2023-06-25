import React, { useState, useEffect, useRef } from 'react';
import { useToast, Spinner, Select, Stack, Skeleton, Grid, Tooltip, Popover, Flex, Box, PopoverTrigger, Button, PopoverContent, PopoverHeader, PopoverBody, FormControl, FormLabel, Input, PopoverFooter } from '@chakra-ui/react';
import * as DashboardService from "../../services/DashboardService";
import { format } from 'date-fns'


import CalendarA from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const typesEvent = [
  { "title": "En producción", "id": 1, "color": "#7b8bff"},
  { "title": "En tránsito", "id": 2, "color": "#ffac7b"},
  { "title": "Entregado", "id": 3, "color": "#7bff91"},
  { "title": "Otro", "id": 4, "color": "#fbff48"}
]

export function Calendar () {
    const [events, setEvents] = useState([]);
    const [calendarDataIsLoading, setCalendarDataIsLoading] = useState(false);
    const [date, setDate] = useState(new Date());
    const [openNewEvent, setOpenNewEvent] = useState(false);
    const [newEventData, setNewEventData] = useState({ title: "", start: undefined, type: undefined});
    const [loadNewEvent, setLoadNewEvent] = useState(false);
    const toast = useToast()

  
    useEffect(() => {
      const fetchCalendar = async () => {
        try {
          setCalendarDataIsLoading(true);
          const response = await DashboardService.getCalendarData();
          setEvents(response.events);
          setCalendarDataIsLoading(false);
        } catch (error) {
          setCalendarDataIsLoading(false);
          console.error('Error fetching orders:', error);
        }
      };

      fetchCalendar();

    }, []);

    const handleDateChange = (newDate) => {
      setDate(newDate);
    };
    
    const tileContent = ({ date, view }) => {
      if (view === 'month' && events && events.length > 0) {
        const event = events.find(x => x.start == format(date, 'yyyy-MM-dd'));
        if (event != null) {
          return (
            <Tooltip label={event.title} placement='right' hasArrow arrowSize={10}>
              <Flex justifyContent="center" alignItems="center">
                <Box mt={1} w="7px" h="7px" bg={event.color} borderRadius="full"></Box>
              </Flex>
            </Tooltip>
          );
        }
      }
      return null;
    };

    const handleClickDay = (newDate) => {
      setDate(newDate);
      setOpenNewEvent(true);
      setNewEventData({ title: "", start: format(newDate, 'yyyy-MM-dd'), type: null});
    }

    const addEvent = () => {
      setLoadNewEvent(true);
      setTimeout(() => {
        const eventsList = events;
  
        if (newEventData && newEventData.type != null) {
          newEventData.color = typesEvent.find(x => x.id == newEventData.type).color;
        }
        eventsList.push(newEventData);
        toast({ title: 'Guardado.', description: "Se ha guardado el evento correctamente.", status: 'success', duration: 5000, isClosable: true })
        setEvents(eventsList);
        setNewEventData({ title: "", start: null, type: null});
        setOpenNewEvent(false);
        setLoadNewEvent(false);
      }, 2000);
    }

    const handleChangeNewEventData = (e) => {
      setNewEventData({ ...newEventData, [e.target.name]: e.target.value });
    }
  
    return (
      <>
        {calendarDataIsLoading &&
          <Stack p="4" width="100%">
            <Skeleton height='150px' />
          </Stack>
        }
        { !calendarDataIsLoading &&
          <Grid bg="#fff" borderRadius="xl" p="4" mb="4">
            <CalendarA
              width="100%"
              onChange={handleDateChange}
              value={date}
              onClickDay={handleClickDay}
              tileContent={tileContent}
            />
            <Popover
              isOpen={openNewEvent}
              onClose={() => setOpenNewEvent(false)}
              placement="top"
              boxShadow='2xl'
            >
              <PopoverContent>
                <PopoverHeader>Añadir evento</PopoverHeader>
                <PopoverBody>
                  <FormControl mt={4}>
                    <FormLabel>Nombre:</FormLabel>
                    <Input type="text" name="title" value={newEventData.title} onChange={(e) => handleChangeNewEventData(e)}/>
                  </FormControl>
                  <FormControl mt={4}>
                    <FormLabel>Fecha:</FormLabel>
                    <Input type="date" name="start" value={newEventData.start} onChange={(e) => handleChangeNewEventData(e)}/>
                  </FormControl>
                  <FormControl mt={4}>
                    <FormLabel>Tipo:</FormLabel>
                    <Select placeholder="Selecciona" name="type" value={newEventData.type} onChange={(e) => handleChangeNewEventData(e)}>
                      {typesEvent.map(event => (
                        <option key={event.id} value={event.id}>{event.title}</option>
                      ))}
                    </Select>
                  </FormControl>
                </PopoverBody>
                <PopoverFooter display='flex' justifyContent='flex-end' alignItems='center'>
                  { loadNewEvent && <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='primary.500' size='lg' mr={2}/>}
                  { !loadNewEvent && <Button colorScheme="blue" onClick={() => addEvent()}>Guardar</Button>}
                  <Button disabled={loadNewEvent} colorScheme="red" ml={1} onClick={() => setOpenNewEvent(false)}>Cancelar</Button>
                </PopoverFooter>
              </PopoverContent>
            </Popover>
          </Grid>
        }
      </>
    );
  };