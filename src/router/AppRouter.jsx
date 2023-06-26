import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Grid, ChakraProvider, CSSReset, Flex, GridItem } from '@chakra-ui/react';

// Importa los componentes de las diferentes páginas
import Dashboard from '../pages/dashboard/Dashboard';

import theme from '../theme';
import { Sidebar } from '../components/general/Sidebar';
import { Login } from '../pages/login/Login';
import { PrivateRoute } from './PrivateRoute';
import { Suppliers } from '../pages/suppliers/Suppliers';
import { Orders } from '../pages/orders/Orders';
import { Products } from '../pages/products/Products';
import { Header } from '../components/general/Header';

// Componente principal de la aplicación
const App = () => {
  const [isLogged, setIsLogged] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  if (sessionStorage.getItem("isLogged") && sessionStorage.getItem("isLogged") == "true" && !isLogged) {
    setIsLogged(true);
  }

  const onLogout = () => {
    setIsLogged(false);
    sessionStorage.clear();
  }

  const handleSidebarToggle = () => {
      setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    };
    handleResize(); // Verificar el tamaño de la ventana al cargar la página
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <Router>
        { isLogged && !isSidebarOpen &&
          <Header onLogout={onLogout} handleSidebarToggle={handleSidebarToggle} />
        }
        <Flex height="100vh" width="100vw" marginTop={(isMobile && !isSidebarOpen) ? "40px" : "0px"}>
          { isLogged &&
            <GridItem>
              <Sidebar onLogout={onLogout} isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} handleSidebarToggle={handleSidebarToggle} />
            </GridItem>
          }
          <GridItem w="100%" overflow="auto" bg={["#fff", "#efefef"]} p={["0", "4"]}>
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
              <Route exact path="/products" element={
                <PrivateRoute>
                  <Products isLogged={isLogged} setIsLogged={setIsLogged} />
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
