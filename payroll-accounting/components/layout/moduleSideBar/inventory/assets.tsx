const AccountingAccountsPayableMenu = {
    route: {
      path: "/inventory",
      routes: [
        {
          path: "/inventory/assets/masterfile",
          name: "Asset Masterfile",
          routes: [
            {
              path: "/inventory/assets/masterfile/all",
              name: "All Assets",
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
  