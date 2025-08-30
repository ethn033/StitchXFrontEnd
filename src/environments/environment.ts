export const environment = {
    production: false,
    api: {
        baseUrl: 'http://localhost:5293/api/',
        auth: {
            controller: 'Auth/',
            enpoints: {
                Login: 'Login',
                Register: 'Register',
                GetAllUsers: 'GetAllUsers',
                DeleteUser: 'DeleteUser',
                UpdateUser: 'UpdateUser'
                
            },
        },
        order: {
            controller: 'Orders/',
            enpoints: {
                GetAllOrders: 'GetAllOrders',
            }
        },
        customer: {
            controller: 'Customers/',
            enpoints: {
                GetAllCustomers: 'GetAllCustomers',
                GetCustomerById: 'GetCustomerById'
            }
        },
        suitype: {
            controller: 'SuitType/',
            enpoints: {
                GetAllSuitTypes: 'GetAllSuitTypes',
                GetSuitTypeById: 'GetSuitTypeById',
                CreateSuitType: 'CreateSuitType',
                UpdateSuitType: 'UpdateSuitType',
                DeleteSuitType: 'DeleteSuitType',
                UpdateSuitTypeStatus: 'UpdateSuitTypeStatus',
                RestoreDeletedSuitType: 'RestoreDeletedSuitType'
            }
        },
        suitypeparameter: {
            controller: 'SuitTypeParameters/',
            enpoints: {
                CreateSuitTypeParameter: 'CreateSuitTypeParameter',
                GetSuitTypeParameterById: 'GetSuitTypeParameterById',
                UpdateSuitTypeParameter: 'UpdateSuitTypeParameter',
                GetSuitTypeParameters: 'GetSuitTypeParameters',
                DeleteSuitTypeParameter: 'DeleteSuitTypeParameter',
                UpdateSuitTypeParameterStatus: 'UpdateSuitTypeParameterStatus',
                RestoreDeletedSuitTypeParameter: 'RestoreDeletedSuitTypeParameter'
            }
        },
        business: {
            controller: 'Business/',
            enpoints: {
                CreateBusiness: 'CreateBusiness'
            },
        },
        branch: {
            controller: 'Branch/',
            enpoints: {
                CreateBranch: 'CreateBranch'
            },
        },
        measurement: {
            controller: 'Measurements/',
            enpoints: {
                GetAllMeasurements: 'GetAllMeasurements',
                GetMeasurementById: 'GetMeasurementById',
                CreateMeasurement: 'CreateMeasurement',
                UpdateMeasurement: 'UpdateMeasurement',
                DeleteMeasurement: 'DeleteMeasurement',
                UpdateMeasurementStatus: 'UpdateMeasurementStatus'
            },
        },
        measurementdetails: {
            controller: 'MeasurementDetails/',
            enpoints: {
                GetMeasurementDetails: 'GetMeasurementDetails',
                UpdateMeasurementDetails: 'UpdateMeasurementDetails'
            }
        }
    }
  };