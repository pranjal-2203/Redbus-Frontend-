import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Buses from "./pages/Buses";
import GovernmentBuses from "./pages/GovernmentBuses";
import FAQ from "./pages/FAQ";
import MyBookings from "./pages/MyBookings";
import PassengerDetails from "./pages/PassengerDetails";
import BookingSummary from "./pages/BookingSummary";
import BoardingDropping from "./pages/BoardingDropping";
import BusDetails from "./pages/BusDetails";
import ContactSupport from "./pages/ContactSupport";
import Help from "./pages/Help";
import Confirmation from "./pages/confirmation";
import Payment from "./pages/payment";
import Account from "./pages/Account";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Offers from "./pages/Offers";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/home" element={<Home />} />
                <Route path="/buses" element={<Buses />} />
                <Route path="/bus/:id" element={<BusDetails />} />
                <Route path="/boarding-dropping" element={<BoardingDropping />} />
                <Route path="/passenger-details" element={<PassengerDetails />} />
                <Route path="/booking-summary" element={<BookingSummary />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/confirmation" element={<Confirmation />} />
                <Route path="/my-bookings" element={<MyBookings />} />
                <Route path="/government-buses" element={<GovernmentBuses />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/help" element={<Help />} />
                <Route path="/contact-support" element={<ContactSupport />} />
                <Route path="/account" element={<Account />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/offers" element={<Offers />} />
                <Route path="/offers/:id" element={<Offers />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;