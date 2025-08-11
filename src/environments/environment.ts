export const environment = {
    production: false,
    api: {
        baseUrl: 'http://localhost:5293/api/',
        auth: {
            controller: 'Auth/',
            enpoints: {
                Login: 'Login',
                Register: 'Register',
                
            },
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