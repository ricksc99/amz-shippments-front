import React, { useState } from 'react';
import { Icon, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Button, useDisclosure } from '@chakra-ui/react';
import { BsArrowReturnLeft, BsXLg, BsTrash3 } from "react-icons/bs";

export function AlertDialogCustom({title, subtitle, isOpen, cancelCallback, removeCallback}) {
    const { onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef()
  
    return (
      <>
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                {title}
              </AlertDialogHeader>
  
              <AlertDialogBody>
                {subtitle}
              </AlertDialogBody>
  
              <AlertDialogFooter>
                <Button colorScheme="blue" ref={cancelRef} onClick={cancelCallback}>
                  <Icon as={BsArrowReturnLeft} mr={1}/>
                  Atrás
                </Button>
                <Button colorScheme='red' onClick={removeCallback} ml={3}>
                  <Icon as={BsTrash3} mr={1}/>
                  Eliminar
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </>
    )
  }