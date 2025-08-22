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
            controller: 'Customer/',
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
                createSuitTypeParameter: 'CreateSuitTypeParameter',
                getSuitTypeParameterById: 'GetSuitTypeParameterById',
                updateSuitTypeParameter: 'UpdateSuitTypeParameter',
                getSuitTypeParameters: 'GetSuitTypeParameters',
                deleteSuitTypeParameter: 'DeleteSuitTypeParameter',
                updateSuitTypeParameterStatus: 'UpdateSuitTypeParameterStatus',
                restoreDeletedSuitTypeParameter: 'RestoreDeletedSuitTypeParameter'
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
        }
    }
  };