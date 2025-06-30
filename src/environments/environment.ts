import { Customer } from './../app/models/customers/customer-model';
export const environment = {
    production: false,
    firebase : {
        apiKey: "AIzaSyDEWu9iRNpufZ3DR809GWIdPGlxN2Ul_HM",
        authDomain: "tailorbhai.firebaseapp.com",
        projectId: "tailorbhai",
        storageBucket: "tailorbhai.firebasestorage.app",
        messagingSenderId: "959465911664",
        appId: "1:959465911664:web:3bf3e6ee1ccf96e15e4bb5",
        measurementId: "G-6KDTXT6FTX"
    },
    api: {
        baseUrl: 'http://tailorbhai.runasp.net/api/',
        customer: {
            enpoint: 'Customer',
        },
        orders: {
            endpoint: 'Order',
        },
        measurment: {
            endpoint: 'Measurement'
        },
        auth: {
            login: '/auth/login',
            register: '/auth/register',
            logout: '/auth/logout'
        },
        products: {
            getAll: '/products',
            getById: (id: string) => `/products/${id}`,
            create: '/products/create',
            update: (id: string) => `/products/update/${id}`,
            delete: (id: string) => `/products/delete/${id}`
        },
        home: {
            getRecentOrders: 'GetRecentOrders',
        },
    }
  };