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