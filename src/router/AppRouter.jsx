import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ChakraProvider, CSSReset, Flex, GridItem } from '@chakra-ui/react';

// Importa los componentes de las diferentes páginas
import Dashboard from '../pages/dashboard/Dashboard';

import theme from '../theme';
import { Sidebar } from '../components/general/Sidebar';
import { Login } from '../pages/login/Login';
import { PrivateRoute } from './PrivateRoute';
import { Suppliers } from '../pages/suppliers/Suppliers';
import { Orders } from '../pages/orders/Orders';

// Componente principal de la aplicación
const App = () => {
  const [isLogged, setIsLogged] = useState(false);
  
  if (sessionStorage.getItem("isLogged") && sessionStorage.getItem("isLogged") == "true" && !isLogged) {
    setIsLogged(true);
  }

  const onLogout = () => {
    setIsLogged(false);
    sessionStorage.clear();
  }

  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <Router>
        <Flex height="100vh" width="100vw">
          { isLogged &&
            <GridItem>
              <Sidebar onLogout={onLogout} />
            </GridItem>
          }
          <GridItem w="100%" overflow="auto" bg="#efefef" p="4">
            <Routes>
              <Route exact path="/login" element={ isLogged ? <Dashboard isLogged={isLogged} setIsLogged={setIsLogged} /> : <Login setIsLogged={setIsLogged} />} />
              <Route exact path="/" element={
                <PrivateRoute>
                  <Dashboard isLogged={isLogged} setIsLogged={setIsLogged} />
                </PrivateRoute>
              } />
              <Route exact path="/suppliers" element={
                <PrivateRoute>
                  <Suppliers isLogged={isLogged} setIsLogged={setIsLogged} />
                </PrivateRoute>
              } />
              <Route exact path="/orders" element={
                <PrivateRoute>
                  <Orders isLogged={isLogged} setIsLogged={setIsLogged} />
                </PrivateRoute>
              } />
            </Routes>
          </GridItem>
        </Flex>
      </Router>
    </ChakraProvider>
  );
};

export default App;
