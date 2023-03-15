import React from "react";

export const taskList = [
  {
    id: 1,
    title: 'Make the home page dynamic',
    completed: false,
    user: {
      projectName: 'Chatbull',
      avatar: 'https://via.placeholder.com/150x150'
    },
    dueDate: 'Tomorrow',
    tags: [1, 2]
  }, {
    id: 2,
    title: 'Design wireframes based on the requirements',
    completed: false,
    user: {
      projectName: 'Wieldy',
      avatar: 'https://via.placeholder.com/150x150'
    },
    dueDate: 'Today',
    tags: [2, 4]
  }, {
    id: 3,
    title: 'Need to define microinteraction on click of signin button',
    completed: false,
    user: {
      projectName: 'Jumbo',
      avatar: 'https://via.placeholder.com/150x150'
    },
    dueDate: '21 Jul',
    tags: [1, 2, 3]
  }, {
    id: 4,
    title: 'New page need to be designed for property listing',
    completed: false,
    user: {
      projectName: 'Wieldy',
      avatar: 'https://via.placeholder.com/150x150'
    },
    dueDate: '23 Jul',
    tags: [2, 3, 4]
  }, {
    id: 5,
    title: 'Design wireframes based on the requirements',
    completed: false,
    user: {
      projectName: 'Wieldy',
      avatar: 'https://via.placeholder.com/150x150'
    },
    dueDate: '1 Aug',
    tags: [2, 4]
  }];

export const recentActivity = [
  {
    id: 1,
    day: 'Today',
    tasks: [
      {
        id: 1,
        name: 'Mila Alba',
        title: [<span className="gx-link" key={1}>Mila Alba</span>, ' left a 5 star review on ',
        <span className="gx-link" key={2}>Albama’s House</span>],
        avatar: 'https://via.placeholder.com/150x150',
        imageList: [],
      },
      {
        id: 2,
        name: 'Bob Builder',
        title: ['Callback request from ', <span className="gx-link" key={3}>Bob Builder</span>, ' for the property ',
          <span className="gx-link" key={4}>Dimitri House</span>],
        avatar: 'https://via.placeholder.com/150x150',
        imageList: [],
      },
      {
        id: 3,
        name: 'Tom Moody',
        title: ['Congratulations to ', <span className="gx-link" key={5}>Tom Moody</span>,
          ' for joining 10+ club '],
        avatar: 'https://via.placeholder.com/150x150',
        imageList: [],
      },
      {
        id: 4,
        name: 'Norman Dolphi',
        title: ['Norman Dolphi is looking for a house in New Jersy, USA'],
        avatar: '',
        imageList: [],
      },
    ]
  },
  {
    id: 2,
    day: 'Yesterday',
    tasks: [
      {
        id: 5,
        name: 'Kily Johns',
        title: ['Agent ',
          <span className="gx-link" key={7}>Kily Johns</span>, ' has added 7 new photos to the property ',
          <span key={6} className="gx-link">Albama’s House</span>],
        avatar: '',
        imageList: ['https://via.placeholder.com/150x150', 'https://via.placeholder.com/150x150', 'https://via.placeholder.com/150x150', 'https://via.placeholder.com/150x150', 'https://via.placeholder.com/150x150', 'https://via.placeholder.com/150x150', 'https://via.placeholder.com/150x150',],
      },
      {
        id: 6,
        name: 'Tom Moody',
        title: ['Welcome to a new agent ', <span className="gx-link" key={8}>Tom Moody in the Company</span>],
        avatar: 'https://via.placeholder.com/150x150',
        imageList: [],
      },
      {
        id: 7,
        name: 'Oliver Shorter',
        title: [<span className="gx-link" key={9}>Oliver Shorter</span>, ' is looking for an office space in ',
        <span className="gx-link" key={10}>Colorado, USA</span>],
        avatar: 'https://via.placeholder.com/150x150',
        imageList: [],
      }, {
        id: 8,
        name: 'Mila Alba',
        title: [<span className="gx-link" key={11}>Mila Alba</span>, ' left a 5 star review on ',
        <span className="gx-link" key={12}>Albama’s House</span>],
        avatar: 'https://via.placeholder.com/150x150',
        imageList: [],
      },
    ]
  }];

export const ticketList = [
  {
    id: 1,
    avatar: 'https://via.placeholder.com/150x150',
    title: 'Need a quick support on setting',
    description: [<span className="gx-link" key={13}>Joy Parish</span>, "  created ticket 15 mins ago"],
    status: 2
  }, {
    id: 2,
    avatar: 'https://via.placeholder.com/150x150',
    title: 'Pre-sale query about the product',
    description: [<span key={14} className="gx-link">You</span>, " replied 2 days ago"],
    status: 1
  }, {
    id: 3,
    avatar: 'https://via.placeholder.com/150x150',
    title: 'Regarding customization service',
    description: [<span key={15} className="gx-link">Joy Parish</span>, " replied 2 days ago"],
    status: 4
  }
];
export const taskStatus = [
  {
    id: 1,
    title: 'Critical',
    color: 'red'
  }, {
    id: 2,
    title: 'High',
    color: 'orange'
  }, {
    id: 3,
    title: 'Medium',
    color: 'green'
  }, {
    id: 4,
    title: 'Low',
    color: 'light-grey'
  }
];
export const taskTags = [
  {
    id: 1,
    name: 'HTML',
    color: 'red',
  }, {
    id: 2,
    name: 'React',
    color: 'green',
  }, {
    id: 3,
    name: 'JavaScript',
    color: 'blue',
  }, {
    id: 4,
    name: 'CSS',
    color: 'orange',
  }];
export const siteVisit = [
  { name: 'JAN', Gross: 7, Discount: 53, NetSales: 89 },
  { name: 'FEB', Gross: 82, Discount: 22, NetSales: 12 },
  { name: 'MAR', Gross: 11, Discount: 70, NetSales: 7 },
  { name: 'APR', Gross: 98, Discount: 39, NetSales: 3 },
  { name: 'MAY', Gross: 79, Discount: 50, NetSales: 19 },
  { name: 'JUN', Gross: 51, Discount: 86, NetSales: 12 },
  { name: 'JUL', Gross: 70, Discount: 27, NetSales: 49 },
  { name: 'AUG', Gross: 60, Discount: 76, NetSales: 12 },
  { name: 'SEP', Gross: 70, Discount: 13, NetSales: 51 },
  { name: 'OCT', Gross: 11, Discount: 16, NetSales: 12 },
  { name: 'NOV', Gross: 91, Discount: 7, NetSales: 65 },
  { name: 'DEC', Gross: 64, Discount: 66, NetSales: 53 },
];

export const totalSaleData = [
  { name: 'JAN', price: 600 },
  { name: 'FEB', price: 3398 },
  { name: 'MAR', price: 1200 },
  { name: 'APR', price: 4908 },
  { name: 'MAY', price: 2908 },
];

export const totalRevenueData = [
  { name: 'JAN', thisYear: 60 },
  { name: 'FEB', thisYear: 90 },
  { name: 'MAR', thisYear: 50 },
  { name: 'APR', thisYear: 75 },
  { name: 'MAY', thisYear: 60 },
  { name: 'JUN', thisYear: 85 },
  { name: 'JUL', thisYear: 20 },
  { name: 'AUG', thisYear: 75 },
  { name: 'SEP', thisYear: 60 },
  { name: 'OCT', thisYear: 40 },
  { name: 'NOV', thisYear: 75 },
  { name: 'DEC', thisYear: 25 },
];

export const trafficData = [
  { name: 'Page A', value: 0 },
  { name: 'Page B', value: 2000 },
  { name: 'Page C', value: 600 },
  { name: 'Page D', value: 4400 },
  { name: 'Page D', value: 900 },
  { name: 'Page H', value: 4860 },
];
