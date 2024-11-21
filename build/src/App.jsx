import { Route, Routes, Navigate } from "react-router-dom"
import NotFound from "./pages/notFound"
import Home from "./pages/home"
import Contact from "./pages/contact"
import Admin from "./pages/admin/admin"
import Login from "./pages/login"
import Statistics from './pages/admin/statistics';
import Users from './pages/admin/users';
import Sales from './pages/admin/sales';
import NewSale from "./pages/admin/newSale";
import Reports from './pages/admin/reports';
import Help from './pages/admin/help';
import About from './pages/admin/about';
import Panel from "./pages/admin/panel";
import NewUser from "./pages/admin/newUser";
import Store from "./pages/admin/store";
import EditUser from "./pages/admin/editUser";
import EditSale from "./pages/admin/editSale";

import ProtectedRoute from "./components/ProtectedRoute";
import ProductList from "./pages/admin/products"
import Car from "./pages/admin/car"
import CartForm from "./pages/admin/cartForm"
import Products from "./pages/products"
import Catalog from "./pages/catalog"
import ProductIcecream from "./pages/admin/productIcecream"
import ProductAddition from "./pages/admin/productAddition"
import CapturarCamara from "./pages/admin/CameraCapture"

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/login" element={<Login />} />
        <Route 
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        >
          <Route path="panel" element={<Panel />} />
          <Route path="statistics/:name" element={<Statistics />} />
          <Route path="products" element={<ProductList />} />
          <Route path="newIcecream" element={<ProductIcecream />} />
          <Route path="newAddition" element={<ProductAddition />} />
          <Route path="editIcecream/:id" element={<ProductIcecream />} />
          <Route path="editAddition/:id" element={<ProductAddition />} />
          <Route path="store" element={<Store />} />
          <Route path="car" element={<Car />} />
          <Route path="newCart" element={<CartForm />} />
          <Route path="editCart/:id" element={<CartForm />} />
          <Route path="users" element={<Users />} />
          <Route path="newUser" element={<NewUser />} />
          <Route path="editUser" element={<EditUser />} />
          <Route path="sales" element={<Sales />} />
          <Route path="newSale" element={<NewSale />} />
          <Route path="editSale" element={<EditSale />} />
          <Route path="reports" element={<Reports />} />
          <Route path="capturar" element={<CapturarCamara />} />
          <Route path="help" element={<Help />} />
          <Route path="about" element={<About />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App