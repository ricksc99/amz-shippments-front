import { useRef, useState, useEffect } from 'react';
import { Grid, Icon, Stack, Skeleton, Flex, Text, Box } from '@chakra-ui/react';
import { Link} from 'react-router-dom';
import { BsAirplaneFill, BsBuildingFillGear, BsThreeDotsVertical, BsFillExclamationTriangleFill, BsFillClipboard2CheckFill, BsFillBoxSeamFill, BsBoxArrowUpRight } from "react-icons/bs";
import { FaMoneyBillWave } from "react-icons/fa";

import * as DashboardService from "../../services/DashboardService";

function currencyFormat(num) {
    return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + '€';
}

export function Metrics () {
  const [metricsData, setMetricsData] = useState([]);
  const [metricsIsLoading, setMetricsIsLoading] = useState(false);

  useEffect(() => {
      const fetchMetrics = async () => {
        try {
          setMetricsIsLoading(true);
          const response = await DashboardService.getMetricsData();
          setMetricsData(response.metrics);
          setMetricsIsLoading(false);
        } catch (error) {
          setMetricsIsLoading(false);
          console.error('Error fetching orders:', error);
        }
      };
  
      fetchMetrics();
    }, []);

    return (
        <>
        <Flex flexWrap={"wrap"} mb="2">
          <Box w={"50%"}>
            <Box bg="#fff" borderRadius="xl" p="4" m="2">
              <Flex alignItems="center" justifyContent="space-between">
                <Flex alignItems="center" justifyContent="flex-start">
                  <Grid bg="#7b8bff54" p={2} borderRadius="md">
                    <Icon fontSize={["2xs", "md"]} color="#7b8bff" as={BsBuildingFillGear}/>
                  </Grid>
                  <Text fontWeight="light" fontSize={['xs', 'lg']} ml={2}>Producciones</Text>
                </Flex>
                <Icon as={BsThreeDotsVertical} mr={1}/>
              </Flex>
              { metricsIsLoading &&
                <Stack p="4" width="100%">
                    <Skeleton height='30px' />
                    <Skeleton height='30px' />
                </Stack>
              }
              { !metricsIsLoading &&
                <Grid mt="2" ml="2">
                  <Flex direction={"row"} alignItems="center" justifyContent={"flex-start"}>
                    <Text mr="2" fontWeight="bold" fontSize={['xl', '2xl']}>4</Text>
                    <Text fontWeight="light" fontSize={['2xs', 'sm']}>Pendientes</Text>
                  </Flex>
                  <Flex direction={"row"} alignItems="center" justifyContent={"flex-start"}>
                    <Text mr="2" fontWeight="bold" fontSize={['xl', '2xl']}>0</Text>
                    <Text fontWeight="light" fontSize={['2xs', 'sm']}>Retrasadas</Text>
                  </Flex>
                </Grid>
              }
            </Box>
          </Box>
          
          <Box w={"50%"}>
            <Box bg="#fff" borderRadius="xl" p="4" m="2">
              <Flex alignItems="center" justifyContent="space-between">
                <Flex alignItems="center" justifyContent="flex-start">
                  <Grid bg="#ffac7b54" p={2} borderRadius="md">
                    <Icon fontSize={["2xs", "md"]} color="#ffac7b" as={BsAirplaneFill}/>
                  </Grid>
                  <Text fontWeight="light" fontSize={['xs', 'lg']} ml={2}>Envíos</Text>
                </Flex>
                <Icon as={BsThreeDotsVertical} mr={1}/>
              </Flex>
              { metricsIsLoading &&
                <Stack p="4" width="100%">
                    <Skeleton height='30px' />
                    <Skeleton height='30px' />
                </Stack>
              }
              { !metricsIsLoading &&
                <Grid mt="2" ml="2">
                  <Flex direction={"row"} alignItems="center" justifyContent={"flex-start"}>
                    <Text mr="2" fontWeight="bold" fontSize={['xl', '2xl']}>2</Text>
                    <Text fontWeight="light" fontSize={['2xs', 'sm']}>En tránsito</Text>
                  </Flex>
                  <Flex direction={"row"} alignItems="center" justifyContent={"flex-start"}>
                    <Text mr="2" fontWeight="bold" fontSize={['xl', '2xl']}>1</Text>
                    <Text fontWeight="light" fontSize={['2xs', 'sm']}>Retrasados</Text>
                    <Icon fontSize="xl" color="#ff8740" as={BsFillExclamationTriangleFill} ml="2"/>
                  </Flex>
                </Grid>
              }
            </Box>
          </Box>
          
          <Box w={"50%"}>
            <Box bg="#fff" borderRadius="xl" p="4" m="2">
              <Flex alignItems="center" justifyContent="space-between">
                <Flex alignItems="center" justifyContent="flex-start">
                  <Grid bg="#ff404054" p={2} borderRadius="md">
                    <Icon fontSize={["2xs", "md"]} color="#ff4040" as={BsFillBoxSeamFill}/>
                  </Grid>
                  <Text fontWeight="light" fontSize={['xs', 'lg']} ml={2}>Alertas de inventario</Text>
                </Flex>
                <Icon as={BsThreeDotsVertical} mr={1}/>
              </Flex>
              { metricsIsLoading &&
                <Stack p="4" width="100%">
                    <Skeleton height='30px' />
                </Stack>
              }
              { !metricsIsLoading &&
                <Grid mt="2" ml="2">
                    <Link to={"inventario"}>
                      <Flex direction={"row"} alignItems="center" justifyContent="center">
                          <Text mr="2" fontWeight="bold" fontSize={['xl', '2xl']}>2</Text>
                          <Icon fontSize="xl" color="#ff8740" as={BsFillExclamationTriangleFill}/>
                      </Flex>
                    </Link>
                </Grid>
              }
            </Box>
          </Box>
          
          <Box w={"50%"}>
            <Box bg="#fff" borderRadius="xl" p="4" m="2">
              <Flex alignItems="center" justifyContent="space-between">
                <Flex alignItems="center" justifyContent="flex-start">
                  <Grid bg="#00932e54" p={2} borderRadius="md">
                    <Icon fontSize={["2xs", "md"]} color="#00932e" as={FaMoneyBillWave}/>
                  </Grid>
                  <Text fontWeight="light" fontSize={['xs', 'lg']} ml={2}>Pagos pendientes</Text>
                </Flex>
                <Icon as={BsThreeDotsVertical} mr={1}/>
              </Flex>
              { metricsIsLoading &&
                <Stack p="4" width="100%">
                    <Skeleton height='30px' />
                </Stack>
              }
              { !metricsIsLoading &&
                <Grid mt="2" ml="2">
                  <Flex direction={"row"} alignItems="center" justifyContent="center">
                    <Text mr="2" fontWeight="bold" fontSize={['xl', '2xl']}>17.800€</Text>
                  </Flex>
                </Grid>
              }
            </Box>
          </Box>
        </Flex>
            {/* {!metricsIsLoading && metricsData.map(metric => (
            <Flex key={metric.id} height="fit-content" bg="#fff" alignItems="center" justifyContent="center" rounded="md" mb={4}>
                <Box>
                    <Icon bg={metric.color ? metric.color : "primary.500"} color="#fff" borderRadius="full" outline="none" fontSize="4xl" as={metric.icon} fontWeight="normal" p={1}/>
                </Box>
                <Flex direction="column" alignItems="center" justifyContent="center" ml={4}>
                    <Text fontSize="sm" fontWeight="normal" color="black" mt={2}>{metric.name}</Text>
                    <Text color={metric.color ? metric.color : ""} fontSize="4xl" fontWeight="bold">{metric.type == "currency" ? currencyFormat(metric.value) : metric.value}</Text>
                </Flex>
            </Flex>
            ))}  */}
        </>
    );
  };