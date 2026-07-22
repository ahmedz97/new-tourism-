const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, '../src/assets/i18n/en.json');
const esPath = path.join(__dirname, '../src/assets/i18n/es.json');
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const es = JSON.parse(fs.readFileSync(esPath, 'utf8'));

Object.assign(en.common, {
  continue: 'Continue',
  back: 'Back',
  reset: 'Reset',
  email: 'Email',
  submit: 'Submit',
  cancel: 'Cancel',
  save: 'Save',
  update: 'Update',
  close: 'Close',
  yes: 'Yes',
  no: 'No',
  required: 'Required',
  optional: 'Optional',
  months: {
    january: 'January',
    february: 'February',
    march: 'March',
    april: 'April',
    may: 'May',
    june: 'June',
    july: 'July',
    august: 'August',
    september: 'September',
    october: 'October',
    november: 'November',
    december: 'December',
  },
  errors: {
    fillRequiredFields: 'Please fill all required fields correctly',
    somethingWentWrong: 'Something went wrong',
    emailRequired: 'Email is required',
    emailInvalid: 'Enter a valid email',
    phoneRequired: 'Phone is required',
    phoneInvalid: 'Phone must be digits only (1–28 numbers)',
    nameRequired: 'Name is required',
    countryRequired: 'Country is required',
  },
});

Object.assign(es.common, {
  continue: 'Continuar',
  back: 'Atrás',
  reset: 'Restablecer',
  email: 'Correo electrónico',
  submit: 'Enviar',
  cancel: 'Cancelar',
  save: 'Guardar',
  update: 'Actualizar',
  close: 'Cerrar',
  yes: 'Sí',
  no: 'No',
  required: 'Obligatorio',
  optional: 'Opcional',
  months: {
    january: 'Enero',
    february: 'Febrero',
    march: 'Marzo',
    april: 'Abril',
    may: 'Mayo',
    june: 'Junio',
    july: 'Julio',
    august: 'Agosto',
    september: 'Septiembre',
    october: 'Octubre',
    november: 'Noviembre',
    december: 'Diciembre',
  },
  errors: {
    fillRequiredFields: 'Por favor completa todos los campos obligatorios correctamente',
    somethingWentWrong: 'Algo salió mal',
    emailRequired: 'El correo electrónico es obligatorio',
    emailInvalid: 'Introduce un correo electrónico válido',
    phoneRequired: 'El teléfono es obligatorio',
    phoneInvalid: 'El teléfono debe contener solo dígitos (1–28 números)',
    nameRequired: 'El nombre es obligatorio',
    countryRequired: 'El país es obligatorio',
  },
});

Object.assign(en.checkout, {
  bannerTitle: 'Checkout',
  reviews: 'reviews',
  couponAppliedSuccess: 'Coupon applied successfully!',
  errors: {
    firstNameRequired: 'First name is required',
    firstNameMinLength: 'First name must be at least 2 characters',
    lastNameRequired: 'Last name is required',
    lastNameMinLength: 'Last name must be at least 2 characters',
    countryRequired: 'Country is required',
    phoneRequired: 'Phone is required',
    phoneInvalid: 'Phone must be digits only (1–28 numbers)',
    emailRequired: 'Email is required',
    emailInvalid: 'Enter a valid email',
    paymentMethodRequired: 'Payment method is required',
    couponRequired: 'Please enter a coupon code',
    invalidCoupon: 'Invalid coupon code',
  },
});

Object.assign(es.checkout, {
  bannerTitle: 'Pago',
  reviews: 'reseñas',
  couponAppliedSuccess: '¡Cupón aplicado con éxito!',
  errors: {
    firstNameRequired: 'El nombre es obligatorio',
    firstNameMinLength: 'El nombre debe tener al menos 2 caracteres',
    lastNameRequired: 'El apellido es obligatorio',
    lastNameMinLength: 'El apellido debe tener al menos 2 caracteres',
    countryRequired: 'El país es obligatorio',
    phoneRequired: 'El teléfono es obligatorio',
    phoneInvalid: 'El teléfono debe contener solo dígitos (1–28 números)',
    emailRequired: 'El correo electrónico es obligatorio',
    emailInvalid: 'Introduce un correo electrónico válido',
    paymentMethodRequired: 'El método de pago es obligatorio',
    couponRequired: 'Por favor introduce un código de cupón',
    invalidCoupon: 'Código de cupón inválido',
  },
});

Object.assign(en.contact, {
  bannerTitle: 'Contact',
  imageAlt: 'contact us',
  errors: {
    nameRequired: 'Name is required',
    emailRequired: 'Email is required',
    emailInvalid: 'Enter a valid email',
    phoneRequired: 'Phone is required',
    phoneInvalid: 'Phone must be digits only (1–28 numbers)',
    subjectRequired: 'Subject is required',
    countryRequired: 'Country is required',
    messageRequired: 'Message is required',
    sendFailed: 'Failed to send message',
  },
});

Object.assign(es.contact, {
  bannerTitle: 'Contacto',
  imageAlt: 'contáctanos',
  errors: {
    nameRequired: 'El nombre es obligatorio',
    emailRequired: 'El correo electrónico es obligatorio',
    emailInvalid: 'Introduce un correo electrónico válido',
    phoneRequired: 'El teléfono es obligatorio',
    phoneInvalid: 'El teléfono debe contener solo dígitos (1–28 números)',
    subjectRequired: 'El asunto es obligatorio',
    countryRequired: 'El país es obligatorio',
    messageRequired: 'El mensaje es obligatorio',
    sendFailed: 'Error al enviar el mensaje',
  },
});

Object.assign(en.signup, {
  bannerTitle: 'Sign Up',
  birthDatePlaceholder: 'Birth date',
  errors: {
    phoneInvalid: 'Phone must be digits only (1–28 numbers)',
    registrationFailed: 'Registration failed',
  },
});

Object.assign(es.signup, {
  bannerTitle: 'Registrarse',
  birthDatePlaceholder: 'Fecha de nacimiento',
  errors: {
    phoneInvalid: 'El teléfono debe contener solo dígitos (1–28 números)',
    registrationFailed: 'Error en el registro',
  },
});

Object.assign(en.login, {
  bannerTitle: 'Login',
  errors: {
    loginFailed: 'Login failed',
    loginError: 'Login error',
  },
});

Object.assign(es.login, {
  bannerTitle: 'Iniciar sesión',
  errors: {
    loginFailed: 'Error al iniciar sesión',
    loginError: 'Error de inicio de sesión',
  },
});

Object.assign(en.home, {
  whenYouGo: 'When do you go?',
  ourBlog: 'Our Blog',
  latestBlogNews: 'Our Latest Blog & News',
  videoBackgroundTitle: 'Tourism Video Background',
});

Object.assign(es.home, {
  whenYouGo: '¿Cuándo viajas?',
  ourBlog: 'Nuestro Blog',
  latestBlogNews: 'Nuestro Último Blog y Noticias',
  videoBackgroundTitle: 'Video de Fondo Turístico',
});

Object.assign(en.about, {
  bannerTitle: 'About Us',
  ourTeam: 'Our Team',
  meetExpertsTeam: 'Meet With Our Experts Team',
});

Object.assign(es.about, {
  bannerTitle: 'Acerca de Nosotros',
  ourTeam: 'Nuestro Equipo',
  meetExpertsTeam: 'Conoce a Nuestro Equipo de Expertos',
});

Object.assign(en.blog, {
  bannerTitle: 'Blog',
  ourBlog: 'Our Blog',
  latestBlogNews: 'Our Latest Blog & News',
  noDataMatched: 'No data matched',
});

Object.assign(es.blog, {
  bannerTitle: 'Blog',
  ourBlog: 'Nuestro Blog',
  latestBlogNews: 'Nuestro Último Blog y Noticias',
  noDataMatched: 'No hay datos que coincidan',
});

Object.assign(en.faq, { bannerTitle: 'FAQ' });
Object.assign(es.faq, { bannerTitle: 'Preguntas Frecuentes' });
Object.assign(en.cart, { bannerTitle: 'Cart' });
Object.assign(es.cart, { bannerTitle: 'Carrito' });

Object.assign(en.forgetPassword, {
  bannerTitle: 'Forget Password',
  errors: { invalidOtp: 'Enter the correct otp code' },
});
Object.assign(es.forgetPassword, {
  bannerTitle: 'Olvidar Contraseña',
  errors: { invalidOtp: 'Introduce el código OTP correcto' },
});

en.makeTrip = {
  ...en.makeTrip,
  bannerTitle: 'Make Your Trip',
  steps: {
    chooseDestinations: 'Choose Your Destinations',
    pickupTravelDates: 'Pickup Travel Dates',
    completeInformation: 'Complete Your Information',
  },
  step1: {
    title: 'Where would you like to go?',
    subtitle: 'Select your dream destination from our amazing collection',
  },
  step2: {
    title: 'When do you want to travel?',
    subtitle: 'Choose your preferred travel dates',
  },
  step3: {
    title: 'Tell us about yourself',
    subtitle: 'Fill in your details to complete your trip inquiry',
  },
  viewDetails: 'View Details',
  dateType: {
    title: 'Select Date Type',
    exact: 'I know the exact dates',
    approximate: 'I have approximate dates',
  },
  dateRange: {
    title: 'Select Date Range',
    label: 'Select a date range',
    startDate: 'Start date',
    endDate: 'End date',
  },
  selectMonth: 'Select Month',
  personalInfo: {
    title: 'Personal Information',
    firstName: 'First name',
    firstNamePlaceholder: 'Ahmed',
    lastName: 'Last name',
    lastNamePlaceholder: 'Zenger',
    emailPlaceholder: 'ahmed@gmail.com',
    nationality: 'Nationality',
    phone: 'Phone number',
    phonePlaceholder: '01069769249',
  },
  budget: {
    title: 'Budget & Preferences',
    min: 'Min Budget',
    max: 'Max Budget',
    flightOffer: 'Add flight offer to my trip',
  },
  travelers: {
    title: 'Travelers',
    adults: 'Adults ( +12 )',
    children: 'Children ( 2 to 11 )',
    infants: 'Infants ( 0 to 2 )',
  },
  notes: {
    title: 'Additional Notes',
    label: 'Notes',
    placeholder: 'Add any special requests or notes here...',
  },
  submitInquiry: 'Submit Inquiry',
  errors: {
    destinationRequired: 'Please select at least one destination',
    firstNameRequired: 'First name is required',
    lastNameRequired: 'Last name is required',
    nationalityRequired: 'Nationality is required',
  },
};

es.makeTrip = {
  ...es.makeTrip,
  bannerTitle: 'Haz Tu Viaje',
  steps: {
    chooseDestinations: 'Elige Tus Destinos',
    pickupTravelDates: 'Elige Fechas de Viaje',
    completeInformation: 'Completa Tu Información',
  },
  step1: {
    title: '¿A dónde te gustaría ir?',
    subtitle: 'Selecciona tu destino soñado de nuestra increíble colección',
  },
  step2: {
    title: '¿Cuándo quieres viajar?',
    subtitle: 'Elige tus fechas de viaje preferidas',
  },
  step3: {
    title: 'Cuéntanos sobre ti',
    subtitle: 'Completa tus datos para finalizar la consulta de viaje',
  },
  viewDetails: 'Ver Detalles',
  dateType: {
    title: 'Seleccionar Tipo de Fecha',
    exact: 'Conozco las fechas exactas',
    approximate: 'Tengo fechas aproximadas',
  },
  dateRange: {
    title: 'Seleccionar Rango de Fechas',
    label: 'Selecciona un rango de fechas',
    startDate: 'Fecha de inicio',
    endDate: 'Fecha de fin',
  },
  selectMonth: 'Seleccionar Mes',
  personalInfo: {
    title: 'Información Personal',
    firstName: 'Nombre',
    firstNamePlaceholder: 'Ahmed',
    lastName: 'Apellido',
    lastNamePlaceholder: 'Zenger',
    emailPlaceholder: 'ahmed@gmail.com',
    nationality: 'Nacionalidad',
    phone: 'Número de teléfono',
    phonePlaceholder: '01069769249',
  },
  budget: {
    title: 'Presupuesto y Preferencias',
    min: 'Presupuesto Mín.',
    max: 'Presupuesto Máx.',
    flightOffer: 'Añadir oferta de vuelo a mi viaje',
  },
  travelers: {
    title: 'Viajeros',
    adults: 'Adultos ( +12 )',
    children: 'Niños ( 2 a 11 )',
    infants: 'Bebés ( 0 a 2 )',
  },
  notes: {
    title: 'Notas Adicionales',
    label: 'Notas',
    placeholder: 'Añade solicitudes especiales o notas aquí...',
  },
  submitInquiry: 'Enviar Consulta',
  errors: {
    destinationRequired: 'Por favor selecciona al menos un destino',
    firstNameRequired: 'El nombre es obligatorio',
    lastNameRequired: 'El apellido es obligatorio',
    nationalityRequired: 'La nacionalidad es obligatoria',
  },
};

en.profile = {
  bannerTitle: 'My Profile',
  changePhoto: 'Change Photo',
  uploadImage: 'Upload Your Image',
  nav: {
    dashboard: 'Dashboard',
    myProfile: 'My Profile',
    myBooking: 'My Booking',
    myWishlist: 'My Wishlist',
    settings: 'Settings',
    logout: 'Logout',
  },
  dashboard: {
    title: 'Dashboard Overview',
    subtitle: "Welcome back! Here's your activity summary",
    totalBookings: 'Total Bookings',
    favoriteTours: 'Favorite Tours',
  },
  info: {
    title: 'Profile Information',
    subtitle: 'Your personal details and account information',
    fullName: 'Full Name',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    joinDate: 'Join Date',
  },
  bookings: {
    title: 'My Bookings',
    subtitle: 'Manage and view your tour bookings',
    guests: 'Guests:',
    adults: 'Adults',
    children: 'Children',
    infants: 'Infants',
    totalPrice: 'Total Price:',
    bookingDate: 'Booking Date:',
    emptyTitle: 'No Tours in Booking Cart',
    emptyMessage: 'Start exploring and book your first tour!',
  },
  wishlist: {
    title: 'My Wishlist',
    subtitle: 'Your saved favorite tours',
    emptyTitle: 'No Tours in Wishlist',
    emptyMessage: 'Add tours to your wishlist to save them for later!',
  },
  settings: {
    title: 'Account Settings',
    subtitle: 'Update your profile information and preferences',
    fullNamePlaceholder: 'Your Full Name',
    phonePlaceholder: 'Your Phone',
    password: 'Password',
    passwordPlaceholder: 'Your Password',
    confirmPassword: 'Confirm Password',
    confirmPasswordPlaceholder: 'Confirm Your Password',
    nationality: 'Nationality',
    selectNationality: 'Select Your Nationality',
    updateButton: 'Update Profile Info',
  },
  imageUpdatedSuccess: 'Profile image updated',
  updateSuccess: 'Profile updated',
  errors: {
    loginRequired: 'Please Login First',
    uploadFailed: 'Upload failed',
    updateFailed: 'Failed to update profile',
    fixFormErrors: 'Please fix the form errors',
  },
};

es.profile = {
  bannerTitle: 'Mi Perfil',
  changePhoto: 'Cambiar Foto',
  uploadImage: 'Sube Tu Imagen',
  nav: {
    dashboard: 'Panel',
    myProfile: 'Mi Perfil',
    myBooking: 'Mis Reservas',
    myWishlist: 'Lista de Deseos',
    settings: 'Configuración',
    logout: 'Cerrar Sesión',
  },
  dashboard: {
    title: 'Resumen del Panel',
    subtitle: '¡Bienvenido de nuevo! Aquí está el resumen de tu actividad',
    totalBookings: 'Reservas Totales',
    favoriteTours: 'Tours Favoritos',
  },
  info: {
    title: 'Información del Perfil',
    subtitle: 'Tus datos personales e información de la cuenta',
    fullName: 'Nombre Completo',
    email: 'Correo electrónico',
    phone: 'Teléfono',
    address: 'Dirección',
    joinDate: 'Fecha de Registro',
  },
  bookings: {
    title: 'Mis Reservas',
    subtitle: 'Gestiona y consulta tus reservas de tours',
    guests: 'Huéspedes:',
    adults: 'Adultos',
    children: 'Niños',
    infants: 'Bebés',
    totalPrice: 'Precio Total:',
    bookingDate: 'Fecha de Reserva:',
    emptyTitle: 'No hay Tours en el Carrito',
    emptyMessage: '¡Empieza a explorar y reserva tu primer tour!',
  },
  wishlist: {
    title: 'Mi Lista de Deseos',
    subtitle: 'Tus tours favoritos guardados',
    emptyTitle: 'No hay Tours en la Lista de Deseos',
    emptyMessage: '¡Añade tours a tu lista para guardarlos!',
  },
  settings: {
    title: 'Configuración de la Cuenta',
    subtitle: 'Actualiza la información y preferencias de tu perfil',
    fullNamePlaceholder: 'Tu Nombre Completo',
    phonePlaceholder: 'Tu Teléfono',
    password: 'Contraseña',
    passwordPlaceholder: 'Tu Contraseña',
    confirmPassword: 'Confirmar Contraseña',
    confirmPasswordPlaceholder: 'Confirma Tu Contraseña',
    nationality: 'Nacionalidad',
    selectNationality: 'Selecciona Tu Nacionalidad',
    updateButton: 'Actualizar Información del Perfil',
  },
  imageUpdatedSuccess: 'Imagen de perfil actualizada',
  updateSuccess: 'Perfil actualizado',
  errors: {
    loginRequired: 'Por favor inicia sesión primero',
    uploadFailed: 'Error al subir',
    updateFailed: 'Error al actualizar el perfil',
    fixFormErrors: 'Por favor corrige los errores del formulario',
  },
};

en.tourDetails = {
  reviews: 'reviews',
  duration: 'Duration',
  time: 'Time',
  availability: 'Availability',
  tourType: 'Tour Type',
  description: 'Description',
  highlights: 'Highlights',
  included: 'Included',
  notIncluded: 'Not Included',
  itinerary: 'Itinerary',
  locationMap: 'Location Map',
  faqs: "FAQ's",
  reviewsTitle: 'Reviews',
  basedOnVerifiedReviews: 'Based On Verified Reviews',
  clientReviews: 'Clients Reviews',
  noReviews: 'No reviews yet. Be the first to review this tour!',
  leaveReview: 'Leave A Review',
  reviewNamePlaceholder: 'Name...',
  reviewRatePlaceholder: 'Rate of Star ...',
  saveForNextReview: 'Save your name, rate for the next time review',
  reviewCommentPlaceholder: 'Write a Comment....',
  bookThisTour: 'Book This Tour',
  from: 'From',
  chooseDate: 'Choose a date',
  guests: 'Guests',
  adults: 'Adults (+12 years)',
  children: 'Children (2-12 years)',
  infants: 'Infants (0-2 years)',
  bookingNow: 'Booking Now',
  bookNow: 'Book Now',
  errors: {
    startDateRequired: 'Start date is required',
    noData: 'No data available.',
    chooseStartDate: 'Please choose a start date',
    formInvalid: 'Form is not valid, must choose start date',
    bookingFailed: 'Booking failed',
    reviewSubmitFailed: 'Error submitting review',
  },
  reviewQuality: {
    newTour: 'New Tour',
    excellent: 'Excellent Quality',
    veryGood: 'Very Good Quality',
    good: 'Good Quality',
    average: 'Average Quality',
    belowAverage: 'Below Average Quality',
    noRating: 'No Rating Available',
  },
};

es.tourDetails = {
  reviews: 'reseñas',
  duration: 'Duración',
  time: 'Hora',
  availability: 'Disponibilidad',
  tourType: 'Tipo de Tour',
  description: 'Descripción',
  highlights: 'Destacados',
  included: 'Incluido',
  notIncluded: 'No Incluido',
  itinerary: 'Itinerario',
  locationMap: 'Mapa de Ubicación',
  faqs: 'Preguntas Frecuentes',
  reviewsTitle: 'Reseñas',
  basedOnVerifiedReviews: 'Basado en Reseñas Verificadas',
  clientReviews: 'Reseñas de Clientes',
  noReviews: 'Aún no hay reseñas. ¡Sé el primero en reseñar este tour!',
  leaveReview: 'Dejar una Reseña',
  reviewNamePlaceholder: 'Nombre...',
  reviewRatePlaceholder: 'Calificación de estrellas ...',
  saveForNextReview: 'Guarda tu nombre y calificación para la próxima reseña',
  reviewCommentPlaceholder: 'Escribe un comentario....',
  bookThisTour: 'Reservar Este Tour',
  from: 'Desde',
  chooseDate: 'Elige una fecha',
  guests: 'Huéspedes',
  adults: 'Adultos (+12 años)',
  children: 'Niños (2-12 años)',
  infants: 'Bebés (0-2 años)',
  bookingNow: 'Reservando Ahora',
  bookNow: 'Reservar Ahora',
  errors: {
    startDateRequired: 'La fecha de inicio es obligatoria',
    noData: 'No hay datos disponibles.',
    chooseStartDate: 'Por favor elige una fecha de inicio',
    formInvalid: 'El formulario no es válido, debes elegir fecha de inicio',
    bookingFailed: 'Error en la reserva',
    reviewSubmitFailed: 'Error al enviar la reseña',
  },
  reviewQuality: {
    newTour: 'Nuevo Tour',
    excellent: 'Calidad Excelente',
    veryGood: 'Muy Buena Calidad',
    good: 'Buena Calidad',
    average: 'Calidad Media',
    belowAverage: 'Calidad Por Debajo del Promedio',
    noRating: 'Sin Calificación Disponible',
  },
};

en.aboutCategory = {
  convenientBooking: 'Convenient Booking Platforms',
  multiDestination: 'Multi-Destination Itineraries',
  customPackages: 'Customized Travel Packages',
  destinationExpertise: 'Destination Expertise',
  sustainableTravel: 'Sustainable Travel Initiatives',
  exclusiveDeals: 'Exclusive Deals and Discounts',
};

es.aboutCategory = {
  convenientBooking: 'Plataformas de Reserva Convenientes',
  multiDestination: 'Itinerarios Multi-Destino',
  customPackages: 'Paquetes de Viaje Personalizados',
  destinationExpertise: 'Experiencia en Destinos',
  sustainableTravel: 'Iniciativas de Viaje Sostenible',
  exclusiveDeals: 'Ofertas y Descuentos Exclusivos',
};

en.booknow = {
  title: 'First Booking Get 70% Discount!',
  description:
    'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
  button: 'Book Now',
};

es.booknow = {
  title: '¡Primera Reserva con 70% de Descuento!',
  description:
    'Es un hecho establecido que un lector se distraerá con el contenido legible de una página al mirar su diseño.',
  button: 'Reservar Ahora',
};

en.destinationCart = { tourCount: 'tour' };
es.destinationCart = { tourCount: 'tour' };
en.testimonial = { ourClients: 'Our Clients' };
es.testimonial = { ourClients: 'Nuestros Clientes' };
en.pagination = {
  label: 'Pagination',
  page: 'page',
  currentPage: "You're on page",
};
es.pagination = {
  label: 'Paginación',
  page: 'página',
  currentPage: 'Estás en la página',
};

en.destinationDetails = {
  description: 'Description',
  information: 'Information',
  share: 'Share',
  noToursAvailable: 'No tours available in this destination',
};

es.destinationDetails = {
  description: 'Descripción',
  information: 'Información',
  share: 'Compartir',
  noToursAvailable: 'No hay tours disponibles en este destino',
};

en.paymentPaypal = {
  title: 'Payment PayPal',
  processing: 'Processing payment...',
  successFallback: 'Payment request sent successfully.',
  failureMessage: 'Payment failure, please try again later',
  backHome: 'Back Home',
  processedSuccess: 'Payment processed',
};

es.paymentPaypal = {
  title: 'Pago PayPal',
  processing: 'Procesando pago...',
  successFallback: 'Solicitud de pago enviada con éxito.',
  failureMessage: 'Error en el pago, inténtalo de nuevo más tarde',
  backHome: 'Volver al Inicio',
  processedSuccess: 'Pago procesado',
};

fs.writeFileSync(enPath, JSON.stringify(en, null, 2) + '\n');
fs.writeFileSync(esPath, JSON.stringify(es, null, 2) + '\n');
console.log('i18n files updated successfully');
