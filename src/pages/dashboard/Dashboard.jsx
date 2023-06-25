import React from 'react';
import { Spacer, Grid, Flex, Box } from '@chakra-ui/react';
import { Calendar } from './Calendar';
import { Metrics } from './Metrics';
import { Orders } from '../orders/Orders';

export default function Dashboard () {
  return (
    <>
      <Flex direction={['column', 'row']} justify="center" align="start">
        <Grid w={['100%', '49%']}>
          <Calendar />
        </Grid>
        <Spacer />
        <Box w={['100%', '49%']} borderRadius="xl">
          <Metrics />
        </Box>
      </Flex>
      <Orders />
    </>
  );
};
