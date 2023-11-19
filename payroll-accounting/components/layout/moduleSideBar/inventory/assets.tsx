const AccountingAccountsPayableMenu = {
    route: {
      path: "/inventory",
      routes: [
        {
          path: "/inventory/assets/masterfile",
          name: "Assets",
          routes: [
            {
              path: "/inventory/assets/masterfile/all",
              name: "All Assets",
            },
            {
              path: "/inventory/assets/masterfile/upcoming-maintenance",
              name: "Upcoming Maintenance",
            },
          ],
        }, 
        {
          path: "/inventory/assets/configuration/maintenance-type",
          name: "Configurations",
          routes: [
            {
              path: "/inventory/assets/configuration/maintenance-type",
              name: "Maintenance Type",
            },
          ],
        },
       
      ],
    },
    location: {
      pathname: "/",
    },
  };
  
  export default AccountingAccountsPayableMenu;
  