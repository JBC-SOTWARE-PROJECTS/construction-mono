const InventoryProjectMenu = (query: string) => {
  return {
    route: {
      path: `/inventory/project-details/${query}`,
      routes: [
        {
          path: `/inventory/project-details/${query}`,
          name: 'Projects Menu',
          routes: [
            {
              key: 'bill-quantities',
              path: `/inventory/project-details/${query}/bill-quantities`,
              name: 'Bill of Quantities',
            },
            {
              key: 'work-accomplishments',
              path: `/inventory/project-details/${query}/work-accomplishments`,
              name: 'Work Accomplishments',
            },
            {
              key: 'accomplishments',
              path: `/inventory/project-details/${query}/accomplishments`,
              name: 'Accomplishment Reports',
            },
            {
              key: 'progress',
              path: `/inventory/project-details/${query}/progress`,
              name: 'Progress Reports',
            },
            {
              key: 'materials',
              path: `/inventory/project-details/${query}/materials`,
              name: 'Project Materials Used',
            },
            // {
            //   key: "expenses",
            //   path: `/inventory/project-details/${query}/expenses`,
            //   name: "Project Expenses",
            // },
            {
              key: 'inventory',
              path: `/inventory/project-details/${query}/inventory`,
              name: 'Inventory Monitoring',
            },
            {
              key: 'purchase-requests',
              path: `/inventory/project-details/${query}/purchase-requests`,
              name: 'Purchase Requests',
            },
            {
              key: 'purchase-orders',
              path: `/inventory/project-details/${query}/purchase-orders`,
              name: 'Purchase Orders',
            },
            {
              key: 'rentals',
              path: `/inventory/project-details/${query}/rentals`,
              name: 'Rentals',
            }
          ],
        },
      ],
    },
    location: {
      pathname: '/',
    },
  }
}

export default InventoryProjectMenu
