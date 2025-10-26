import React, { useState, useEffect, useMemo } from "react";
import { Truck, CreditCard, DollarSign, Smartphone, MapPin, Save, User, Phone, CheckCircle, ChevronRight, ChevronLeft, Edit, ChevronDown } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatINR } from '@/lib/currency';
import { useNavigate, useSearchParams } from 'react-router-dom';

// --- Utility and Mock Data ---

const cn = (...classes) => classes.filter(Boolean).join(' ');

/**
 * ADDRESS DATA STRUCTURE: NEPAL_ADDRESS_DATA
 * * This object holds all the available Districts/Cities for the dropdown.
 * The structure is: 
 * { "Province Name": ["District 1", "District 2", "New District/City Name"], ... }
 * * To add a new City/District:
 * 1. Find the correct Province key (e.g., "Bagmati Province").
 * 2. Add the new city name as a string to that Province's array.
 * * EXAMPLE: "Hetauda" has been added to "Bagmati Province" below.
 */
const NEPAL_ADDRESS_DATA = {
    "Koshi Province": [
        "Bhojpur",
        "Dhankuta",
        "Ilam",
        "Jhapa",
        "Khotang",
        "Morang",
        "Okhaldhunga",
        "Sankhuwasabha",
        "Sunsari",
        "Taplejung",
        "Terhathum",
        "Udayapur"
    ],
    "Madhesh Province": [
        "Bara",
        "Dhanusha",
        "Mahottari",
        "Parsa",
        "Rautahat",
        "Saptari",
        "Sarlahi",
        "Siraha"
    ],
    "Bagmati Province": [
        "Bhaktapur",
        "Chitwan",
        "Dhading",
        "Dolakha",
        "Kabhrepalanchok",
        "Kathmandu", // Added Kathmandu for better testing
        "Lalitpur",
        "Makwanpur",
        "Nuwakot",
        "Ramechhap",
        "Rasuwa",
        "Sindhuli",
        "Sindhupalchok"
    ],
    "Gandaki Province": [
        "Baglung",
        "Gorkha",
        "Kaski",
        "Lamjung",
        "Manang",
        "Mustang",
        "Myagdi",
        "Nawalpur"
    ],
    "Lumbini Province": [
        "Arghakhanchi",
        "Banke",
        "Bardiya",
        "Dang",
        "Gulmi",
        "Kapilvastu",
        "Palpa",
        "Pyuthan",
        "Rolpa",
        "Rupandehi"
    ],
    "Karnali Province": [
        "Dailekh",
        "Dolpa",
        "Jajarkot",
        "Kalikot",
        "Humla",
        "Mugu",
        "Salyan",
        "Surkhet"
    ],
    "Sudurpashchim Province": [
        "Bajhang",
        "Bajura",
        "Achham",
        "Doti",
        "Kailali",
        "Kanchanpur",
        "Dadeldhura",
        "Baitadi",
        "Darchula"
    ]
};

// Simple municipality helper: if a mapping exists, use it; otherwise generate placeholder municipalities
const MUNICIPALITY_OVERRIDES: Record<string, string[]> = {
    // small explicit examples (optional)
    "Bhojpur": [
        "Bhojpur",
        "Aamchok",
        "Hatuwagadhi",
        "Bhimfedi",
        "Tungeshwor",
        "Salpasilichho"
    ],
    "Dhankuta": [
        "Dhankuta",
        "Sangurigadhi",
        "Chaubise",
        "Chhathar",
        "Sangkhupati",
        "Hatikumr",
        "Antu",
        "Jarmang"
    ],
    "Morang": [
        "Biratnagar",
        "Belbari",
        "Rangeli",
        "Pathari Shanishchare",
        "Letang",
        "Sukrabare",
        "Ratuwamai"
    ],
    "Sunsari": [
        "Inaruwa",
        "Itahari",
        "Dharan",
        "Barahkshetra",
        "Ramdhuni",
        "Harinagara",
        "Gadhi"
    ],
    "Saptari": [
        "Rajbiraj",
        "Dakneshwori",
        "Bodebarsain",
        "Balan Bihul",
        "Tilathi Koiladi",
        "Surunga",
        "Bishnupur",
        "Khajura"
    ],

    "Bara": [
        "Kalaiya",
        "Parwanipur",
        "Pheta",
        "Karaiyamai",
        "Mahagadhimai"
    ],
    "Rautahat": [
        "Gaur",
        "Ishworpur",
        "Chandrapur",
        "Brindaban",
        "Paroha"
    ],
    "Kathmandu": [
        "Kathmandu",
        "Kirtipur",
        "Budhanilkantha",
        "Mahalaxmi",
        "Tokha"
    ],
    "Bhaktapur": [
        "Bhaktapur",
        "Madhyapur Thimi",
        "Suryabinayak"
    ],
    "Lalitpur": [
        "Lalitpur",
        "Godawari",
        "Konjyosom"
    ],

    "Pokhara": [
        "Pokhara",
        "Lekhnath",
        "Rupakot Majhuwagadhi"
    ],
    "Kaski": [
        "Pokhara",
        "Madi",
        "Rupa"
    ],

    "Rupandehi": [
        "Siddharthanagar",
        "Bhairahawa",
        "Lumbini"
    ],
    "Kapilvastu": [
        "Taulihawa",
        "Kapilvastu",
        "Shivaraj"
    ],
    "Jumla": [
        "Jumla",
        "Sinja",
        "Tatopani"
    ],
    "Dolpa": [
        "Dolkha",
        "Mudke",
        "Thuli Bheri"
    ],
    "Kailali": [
        "Dhangadhi",
        "Attariya",
        "Ghodaghodi"
    ],
    "Kanchanpur": [
        "Mahendranagar",
        "Bedkot",
        "Krishnapur"
    ]

};

function getMunicipalities(district: string) {
    if (!district) return [];
    if (MUNICIPALITY_OVERRIDES[district]) return MUNICIPALITY_OVERRIDES[district];
    // Fallback generated list for UX
    return [`${district} Municipality`, `${district} Urban`, `${district} Rural`];
}



// Placeholder for initial state
const PROVINCE_PLACEHOLDER = 'Select Province';
const PROVINCES = [PROVINCE_PLACEHOLDER, ...Object.keys(NEPAL_ADDRESS_DATA)];

const PAYMENT_METHODS = [
    { id: 'card', name: 'Credit/Debit Card (Dummy 4242)', icon: CreditCard, details: 'You will be redirected to a secure payment gateway.' },
    { id: 'cod', name: 'Cash on Delivery', icon: DollarSign, details: 'Pay in cash when your order arrives.' },
    { id: 'wallet', name: 'E-Wallet (Khalti/Esewa Mock)', icon: Smartphone, details: 'Complete the payment using your preferred digital wallet.' },
];

const STORAGE_KEY = 'medizoSavedAddress';

// --- Main Checkout Component ---

export default function CheckoutPage() {
    const { items, subtotal, clear } = useCart();

    // CALCULATIONS for Order Summary
    const TAX_RATE = 0.13; // 13% VAT for calculation
    const taxAmount = subtotal * TAX_RATE;
    const shippingCost = 0; // Keeping shipping free for demo
    const totalPayable = subtotal + shippingCost; // Included shipping cost for proper calculation

    // State for the checkout process
    const [step, setStep] = useState(1);
    const [placed, setPlaced] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Form Data State
    const [savedAddress, setSavedAddress] = useState(null);
    const [shippingForm, setShippingForm] = useState({
        fullName: '',
        phone: '',
        addressLine: '',
        province: PROVINCE_PLACEHOLDER,
        city: '', // Now represents the District (The "Cities Dropdown")
        municipality: '', // Represents the specific City/Municipality/Area Name
        postalCode: '',
    });
    const [selectedPayment, setSelectedPayment] = useState(PAYMENT_METHODS[0].id);

    // Load saved address from local storage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const addr = JSON.parse(stored);
                // Ensure new field is initialized, falling back if not present in old storage
                const loadedForm = {
                    ...shippingForm, // Use default state as base
                    ...addr,
                    municipality: addr.municipality || '',
                }

                setSavedAddress(loadedForm);
                if (NEPAL_ADDRESS_DATA[addr.province]) {
                    setShippingForm(loadedForm);
                } else {
                    // Reset province/city if they are invalid for the mock data
                    setShippingForm(prev => ({
                        ...prev,
                        ...loadedForm,
                        province: PROVINCE_PLACEHOLDER,
                        city: ''
                    }));
                }
            }
        } catch (error) {
            console.error("Error loading saved address:", error);
        }
    }, []);



    const handleFormChange = (e) => {
        const { name, value } = e.target;
        // Province change: set default district + municipality
        if (name === 'province') {
            if (value === PROVINCE_PLACEHOLDER) {
                setShippingForm(prev => ({ ...prev, province: value, city: '', municipality: '' }));
            } else {
                const newCities = NEPAL_ADDRESS_DATA[value] || [];
                const firstCity = newCities[0] || '';
                const mun = getMunicipalities(firstCity);
                setShippingForm(prev => ({ ...prev, province: value, city: firstCity, municipality: mun[0] || '' }));
            }
            return;
        }

        // City (district) change: populate municipality dropdown
        if (name === 'city') {
            const mun = getMunicipalities(value);
            setShippingForm(prev => ({ ...prev, city: value, municipality: mun[0] || '' }));
            return;
        }

        setShippingForm(prev => ({ ...prev, [name]: value }));
    };

    const saveCurrentAddress = () => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(shippingForm));
            setSavedAddress(shippingForm);
            // Replaced alert() with console log/visual feedback for safety
            console.log("Address saved successfully!");
        } catch (error) {
            console.error("Error saving address:", error);
        }
    };

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Initialize step from query param (e.g., ?step=2 for payment)
    useEffect(() => {
        const s = Number(searchParams.get('step') || 0);
        if (s >= 1 && s <= 3) setStep(s);
    }, [searchParams]);

    // Read snapshot saved by Cart when user clicked "Checkout selected items".
    // Fallback to computing from current cart if snapshot not present.
    const summarySnapshot = (() => {
        try {
            const raw = localStorage.getItem('checkout:summary');
            if (!raw) return null;
            return JSON.parse(raw);
        } catch {
            return null;
        }
    })();

    const selectedIdsRaw = (() => {
        try {
            const raw = localStorage.getItem('checkout:selected');
            if (!raw) return null;
            const arr = JSON.parse(raw) as string[];
            if (!Array.isArray(arr)) return null;
            return arr;
        } catch {
            return null;
        }
    })();

    const checkoutItems = summarySnapshot?.items && Array.isArray(summarySnapshot.items)
        ? summarySnapshot.items
        : (selectedIdsRaw && selectedIdsRaw.length > 0 ? items.filter(i => selectedIdsRaw.includes(i._id)) : items);

    const checkoutSubtotal = summarySnapshot?.subtotal ?? checkoutItems.reduce((s, i) => s + i.price * i.qty, 0);
    const checkoutTax = summarySnapshot?.tax ?? (checkoutSubtotal * TAX_RATE);
    const checkoutShipping = summarySnapshot?.shipping ?? (checkoutSubtotal > 1500 ? 0 : (checkoutSubtotal === 0 ? 0 : 65));
    const checkoutTotal = summarySnapshot?.total ?? (checkoutSubtotal + checkoutShipping);

    // Redirect to cart when no items are present (prevent direct access to checkout)
    useEffect(() => {
        // If user attempted to checkout selected items but none are available, redirect back to cart
        if (checkoutItems.length === 0 && !placed) navigate('/cart');
    }, [checkoutItems.length, placed, navigate]);

    const handlePlaceOrder = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                // Not authenticated
                alert('Please sign in to place an order');
                navigate('/login');
                setIsLoading(false);
                return;
            }

            // Use the snapshot items/amounts if available so the order matches the cart summary
            const itemsToSend = (summarySnapshot && Array.isArray(summarySnapshot.items))
                ? summarySnapshot.items.map((it: any) => ({ productId: it.productId, name: it.name, price: it.price, qty: it.qty }))
                : items.map((i: any) => ({ productId: i._id, name: i.name, price: i.price, qty: i.qty }));

            const body = {
                items: itemsToSend,
                subtotal: checkoutSubtotal,
                tax: checkoutTax,
                shipping: checkoutShipping,
                total: checkoutTotal,
                shippingAddress: shippingForm,
            };

            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(body),
            });

            let data: any;
            try {
                data = await res.json();
            } catch {
                throw new Error('Server returned an invalid response');
            }

            if (!res.ok) {
                throw new Error(data?.message || data?.error || `Order failed with status ${res.status}`);
            }

            setOrderId(data._id || data.id || '');
            setPlaced(true);
            clear();
            // Clear the checkout snapshot/selection so future checkouts start fresh
            try { localStorage.removeItem('checkout:selected'); localStorage.removeItem('checkout:summary'); } catch { }
        } catch (err: any) {
            console.error('place order error', err);
            alert('Could not place order: ' + (err?.message || 'Server error'));
        } finally {
            setIsLoading(false);
        }
    };

    // --- Render Functions for Steps ---

    const renderShippingAddressForm = () => {
        const isProvinceSelected = shippingForm.province && shippingForm.province !== PROVINCE_PLACEHOLDER;
        const currentCities = isProvinceSelected ? (NEPAL_ADDRESS_DATA[shippingForm.province] || []) : [];
        const showCitySelect = isProvinceSelected && currentCities.length > 0;

        // Municipality dropdown options based on selected district
        const municipalOptions = shippingForm.city ? getMunicipalities(shippingForm.city) : [];
        const showMunicipalitySelect = municipalOptions.length > 0;

        // Validation: all fields required (postal code required)
        const isFormValid = Boolean(
            shippingForm.fullName &&
            shippingForm.addressLine &&
            shippingForm.phone &&
            shippingForm.city &&
            shippingForm.municipality &&
            shippingForm.province &&
            shippingForm.province !== PROVINCE_PLACEHOLDER &&
            shippingForm.postalCode
        );

        // Determine if the form should be hidden (when a saved address is confirmed for use)
        const isFormBeingUsed = !savedAddress || (savedAddress && shippingForm.fullName !== savedAddress.fullName);


        return (
            <form className="space-y-6 bg-white p-6 rounded-xl shadow-md border" onSubmit={(e) => e.preventDefault()}>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 border-b pb-3">
                    <Truck size={20} /> Shipping Details
                </h2>

                {/* Saved Address Display / Prompt */}
                {savedAddress && isFormValid && shippingForm.fullName === savedAddress.fullName ? (
                    <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center">
                        <div>
                            <p className="font-semibold text-primary">Shipping to Saved Address:</p>
                            <p className="text-sm text-gray-700">{savedAddress.fullName} ({savedAddress.phone})</p>
                            <p className="text-xs text-gray-600">
                                {savedAddress.addressLine}, {savedAddress.municipality}, {savedAddress.city}, {savedAddress.province}, {savedAddress.postalCode}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setSavedAddress(null)} // Allows user to edit the address in the form below
                            className="mt-3 sm:mt-0 flex-shrink-0 flex items-center justify-center gap-1 text-sm text-primary hover:text-primary/80 font-medium px-3 py-1 border border-primary/50 rounded-md bg-white hover:bg-primary/10 transition"
                        >
                            <Edit size={16} /> Change Address
                        </button>
                    </div>
                ) : (
                    <p className="text-sm text-gray-600">Enter your delivery details below.</p>
                )}

                {/* Dynamic Form based on Saved Address state */}
                {(savedAddress === null || shippingForm.fullName !== savedAddress.fullName) && (
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">

                        {/* 1. Full Name */}
                        <InputGroup label="Full Name" name="fullName" value={shippingForm.fullName} onChange={handleFormChange} icon={User} required />

                        {/* 2. Phone */}
                        <InputGroup label="Phone Number" name="phone" value={shippingForm.phone} onChange={handleFormChange} icon={Phone} type="tel" required />

                        {/* 3. Province Select */}
                        <SelectGroup label="Province" name="province" value={shippingForm.province} onChange={handleFormChange} options={PROVINCES} required />

                        {/* 4. District Select (Cities Dropdown) */}
                        {showCitySelect ? (
                            <SelectGroup
                                label="District" // Updated Label to clarify
                                name="city" // State field 'city' holds the district name
                                value={shippingForm.city}
                                onChange={handleFormChange}
                                options={currentCities}
                                required
                            />
                        ) : (
                            <div className="h-full flex items-end">
                                <div className="text-sm text-gray-500 flex items-center p-2 rounded-md bg-gray-100 w-full h-10">
                                    <MapPin size={16} className="mr-2" /> Select a Province first
                                </div>
                            </div>
                        )}


                        {/* 5. Municipality/Area - dropdown that appears after selecting district */}
                        {showMunicipalitySelect ? (
                            <SelectGroup
                                label="Municipality / Area"
                                name="municipality"
                                value={shippingForm.municipality}
                                onChange={handleFormChange}
                                options={municipalOptions}
                                required
                            />
                        ) : (
                            <div className="h-full flex items-end">
                                <div className="text-sm text-gray-500 flex items-center p-2 rounded-md bg-gray-100 w-full h-10">
                                    <MapPin size={16} className="mr-2" /> Select a District first
                                </div>
                            </div>
                        )}

                        {/* 6. Postal Code Text Input (required) */}
                        <InputGroup label="Postal Code" name="postalCode" value={shippingForm.postalCode} onChange={handleFormChange} type="text" required />


                        {/* 7. Address Line (Street/Tole) - Spans two columns */}
                        <div className="sm:col-span-2">
                            <InputGroup
                                label="Address Line (Street/Tole)"
                                name="addressLine"
                                value={shippingForm.addressLine}
                                onChange={handleFormChange}
                                icon={MapPin}
                                required
                            />
                        </div>
                    </div>
                )}

                <div className="flex justify-between items-center pt-2">
                    {/* Show Save Button if not using a saved address AND the form is currently valid */}
                    {!savedAddress && isFormValid && (
                        <button
                            type="button"
                            onClick={saveCurrentAddress}
                            className="flex items-center gap-1 text-sm text-gray-600 hover:text-primary transition-colors p-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                        >
                            <Save size={16} /> Save this Address
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={() => setStep(2)}
                        disabled={!isFormValid}
                        className="ml-auto flex items-center gap-2 h-10 px-6 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                        Continue to Payment <ChevronRight size={16} />
                    </button>
                </div>
            </form>
        );
    };

    const renderPaymentMethod = () => (
        <div className="space-y-6 bg-white p-6 rounded-xl shadow-md border">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 border-b pb-3">
                <CreditCard size={20} /> Payment Method
            </h2>

            <div className="space-y-4">
                {PAYMENT_METHODS.map((method) => (
                    <label
                        key={method.id}
                        className={cn(
                            "flex items-center justify-between p-4 rounded-xl cursor-pointer border transition-all",
                            selectedPayment === method.id ? 'border-primary ring-2 ring-primary/50 bg-primary/5' : 'border-gray-200 hover:border-gray-400'
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value={method.id}
                                checked={selectedPayment === method.id}
                                onChange={() => setSelectedPayment(method.id)}
                                className="h-5 w-5 text-primary focus:ring-primary accent-primary cursor-pointer" // increased size slightly for touch target
                            />
                            <method.icon size={22} className="text-primary" />
                            <div>
                                <span className="font-semibold text-gray-800">{method.name}</span>
                                <p className="text-xs text-gray-500">{method.details}</p>
                            </div>
                        </div>
                    </label>
                ))}
            </div>

            <div className="flex justify-between pt-4 border-t">
                <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center gap-2 h-10 px-4 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <ChevronLeft size={16} /> Back to Shipping
                </button>
                <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex items-center gap-2 h-10 px-6 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
                >
                    Review Order <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );

    const renderReviewOrder = () => (
        <div className="space-y-6 bg-white p-6 rounded-xl shadow-md border">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 border-b pb-3">
                <CheckCircle size={20} /> Final Review
            </h2>

            {/* Shipping Summary */}
            <div className="border p-4 rounded-xl shadow-sm bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-lg text-gray-800">Delivery To:</h3>
                    <button onClick={() => setStep(1)} className="text-sm text-primary hover:text-primary/80 flex items-center gap-1">
                        <Edit size={14} /> Edit
                    </button>
                </div>
                <p className="text-gray-700 font-medium">{shippingForm.fullName} ({shippingForm.phone})</p>
                <p className="text-sm text-gray-600">
                    {shippingForm.addressLine},
                    <span className="font-semibold"> {shippingForm.municipality}</span>, {/* Area Name */}
                    {shippingForm.city}, {shippingForm.province}, {shippingForm.postalCode}
                </p>
            </div>

            {/* Payment Summary */}
            <div className="border p-4 rounded-xl shadow-sm bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-lg text-gray-800">Payment Via:</h3>
                    <button onClick={() => setStep(2)} className="text-sm text-primary hover:text-primary/80 flex items-center gap-1">
                        <Edit size={14} /> Edit
                    </button>
                </div>
                <p className="text-gray-700 font-medium">
                    {PAYMENT_METHODS.find(m => m.id === selectedPayment)?.name || 'Unknown Method'}
                </p>
                <p className="text-sm text-gray-600">
                    {PAYMENT_METHODS.find(m => m.id === selectedPayment)?.details}
                </p>
            </div>

            <div className="flex justify-between pt-4 border-t">
                <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 h-10 px-4 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <ChevronLeft size={16} /> Back to Payment
                </button>
                <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={isLoading}
                    className="flex items-center gap-2 h-10 px-6 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 shadow-lg shadow-green-600/30"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </>
                    ) : (
                        'Place Order'
                    )}
                </button>
            </div>
        </div>
    );

    // --- Initial/Final Render State Checks ---

    if (items.length === 0 && !placed) {
        return (
            <section className="container py-16 bg-gray-50 min-h-screen">
                <div className="mx-auto max-w-md p-8 bg-white rounded-xl shadow-lg border border-gray-200 text-center">
                    <CreditCard size={48} className="text-primary mx-auto mb-4" />
                    <div className="text-lg font-medium text-gray-700">Your cart is empty.</div>
                </div>
            </section>
        );
    }

    if (placed) {
        return (
            <section className="container py-24 bg-gray-50 min-h-screen">
                <div className="mx-auto max-w-md rounded-xl shadow-2xl bg-white border border-green-200 p-8 text-center">
                    <CheckCircle size={48} className="mx-auto mb-4 text-emerald-600" />
                    <h1 className="text-3xl font-bold text-gray-900">Order Placed Successfully!</h1>
                    <p className="mt-4 text-sm text-gray-600">
                        Thank you for your purchase. Your order <span className="font-mono text-primary font-semibold">#{orderId}</span> has been confirmed.
                    </p>
                    <p className="mt-2 text-sm text-gray-600">
                        The total amount of **{formatINR(checkoutTotal)}** will be processed via your selected method.
                    </p>
                    <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); setPlaced(false); setStep(1); }}
                        className="mt-6 inline-flex items-center justify-center h-10 px-6 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
                    >
                        Go Back to Checkout Demo
                    </a>
                </div>
            </section>
        );
    }

    // --- Main Checkout Layout ---
    return (
        <section className="container py-12 lg:py-20 bg-gray-50 min-h-screen font-sans">
            <style>{`
                /* Local styling overrides for this page */
                .font-sans { font-family: 'Inter', sans-serif; }
                .container { padding-left: 1rem; padding-right: 1rem; max-width: 1400px; margin-left: auto; margin-right: auto; }
                .text-primary { color: #10B981; }
                .bg-primary { background-color: #10B981; }
                .hover\\:bg-primary\\/90:hover { background-color: #059669; }
                .text-primary-foreground { color: white; }
                .border-primary { border-color: #10B981; }
                .ring-primary\\/50 { --tw-ring-color: rgba(16, 185, 129, 0.5); }
                .bg-primary\\/5 { background-color: rgba(16, 185, 129, 0.05); }
                .border-primary\\/20 { border-color: rgba(16, 185, 129, 0.2); }
                .accent-primary { accent-color: #10B981; }
                .rounded-xl { border-radius: 0.75rem; }
            `}</style>

            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8 lg:mb-10">Secure Checkout</h1>

            {/* Progress Stepper */}
            <div className="flex justify-between items-center max-w-xl mx-auto mb-10">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex-1 flex flex-col items-center relative z-10">
                        <div className="h-10 w-10 rounded-full grid place-items-center font-bold text-lg transition-all duration-300 shadow-md flex-shrink-0"
                            onClick={() => s < step && setStep(s)}
                            style={{ cursor: s < step ? 'pointer' : 'default' }}
                        >
                            {s <= step ? (
                                <CheckCircle size={20} className="text-white bg-primary rounded-full p-0.5" />
                            ) : (
                                s
                            )}
                        </div>
                        <span className={cn(
                            "mt-2 text-sm font-medium text-center transition-colors",
                            s <= step ? 'text-gray-900' : 'text-gray-500'
                        )}>
                            {s === 1 ? 'Shipping' : s === 2 ? 'Payment' : 'Review'}
                        </span>
                        {s < 3 && (
                            <div className={cn(
                                "absolute top-5 h-0.5 w-[calc(100%+2.5rem)] right-0 translate-x-1/2 transition-all duration-500 -z-10",
                                s < step ? 'bg-primary' : 'bg-gray-300',
                            )}></div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">

                {/* Left Column: Form Steps */}
                <div>
                    {step === 1 && renderShippingAddressForm()}
                    {step === 2 && renderPaymentMethod()}
                    {step === 3 && renderReviewOrder()}
                </div>

                {/* Right Column: Order Summary */}
                <div className="h-max lg:sticky lg:top-10 rounded-xl shadow-2xl border border-gray-300 bg-white p-6 space-y-4">
                    <div className="text-2xl font-bold text-gray-900 border-b pb-3">Order Summary</div>

                    {/* Item List - show selected/checkout items snapshot when available */}
                    <h3 className="font-semibold text-gray-700 text-sm pt-2">Selected Items:</h3>
                    <ul className="space-y-3 text-base max-h-56 overflow-y-auto pr-1 pb-2">
                        {checkoutItems.map((i: any) => {
                            const id = i._id ?? i.productId ?? `${i.name}-${i.qty}`;
                            const name = i.name || 'Unknown Product';
                            const qty = i.qty || 0;
                            const price = i.price || 0;
                            const itemTotal = price * qty;

                            return (
                                <li key={id} className="flex items-center justify-between text-gray-700 border-b border-dashed pb-2">
                                    {/* Left: Name and quantity */}
                                    <div className="flex flex-col">
                                        <span className="font-medium">{name}</span>
                                        <span className="text-xs text-gray-500 font-mono">
                                            {qty} × {formatINR(price)}
                                        </span>
                                    </div>

                                    {/* Right: Total amount */}
                                    <span className="font-bold text-right text-primary">
                                        {formatINR(itemTotal)}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>


                    {/* Charges Breakdown */}
                    <div className="border-t pt-4 space-y-2">
                        <div className="flex items-center justify-between text-base text-gray-700"><span>Subtotal</span><span className="font-medium">{formatINR(checkoutSubtotal)}</span></div>

                        <div className="flex items-center justify-between text-base text-gray-700"><span>Tax (<span className="font-mono">{TAX_RATE * 100}%</span> VAT)</span><span className="font-medium">{formatINR(checkoutTax)}</span></div>

                        <div className="flex items-center justify-between text-base text-green-600"><span>Shipping</span><span className="font-bold">{checkoutShipping === 0 ? 'Free' : formatINR(checkoutShipping)}</span></div>
                    </div>

                    {/* Final Total */}
                    <div className="border-t border-double border-gray-400 pt-4 flex items-center justify-between font-bold text-2xl">
                        <span>Total Payable</span>
                        <span className="text-primary">{formatINR(checkoutTotal)}</span>
                    </div>

                    {/* Static summary: actions are handled in the main steps; no buttons here to keep summary read-only */}
                </div>
            </div>
        </section>
    );
}

// --- Helper Components for Form Styling ---

const InputGroup = ({ label, name, value, onChange, icon: Icon, type = 'text', required = false }: any) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="relative">
            {Icon && <Icon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />}
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                required={required}
                className={cn("mt-1 h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition", Icon && "pl-10")}
                // Set input type for mobile keyboard
                inputMode={type === 'tel' ? 'numeric' : 'text'}
            />
        </div>
    </div>
);

// SelectGroup includes the custom ChevronDown icon.
const SelectGroup = ({ label, name, value, onChange, options, required = false }: any) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="relative">
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                // appearance-none ensures the native arrow is hidden
                className="mt-1 h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none cursor-pointer text-gray-700"
                disabled={options.length === 0} // Disable if no options (like when no province is selected)
            >
                {/* Conditionally add the placeholder option if it exists in the list */}
                {options.includes(PROVINCE_PLACEHOLDER) && (
                    <option value={PROVINCE_PLACEHOLDER} disabled className="text-gray-400">
                        {PROVINCE_PLACEHOLDER}
                    </option>
                )}

                {options.filter(opt => opt !== PROVINCE_PLACEHOLDER).map((option) => (
                    <option key={option} value={option} className="text-gray-900">{option}</option>
                ))}
            </select>
            {/* Custom Down Arrow Icon */}
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
    </div>
);
