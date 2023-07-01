import React, { useEffect } from "react";
import { Menu } from "antd";
import Link from "next/link";

import { useRouter } from "next/router";
import CustomScrollbars from "../../../util/CustomScrollbars";
import SidebarLogo from "./SidebarLogo";
import UserProfile from "./UserProfile";
import {
  NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR,
  NAV_STYLE_NO_HEADER_MINI_SIDEBAR,
  THEME_TYPE_LITE,
} from "../../../constants/ThemeSetting";
import IntlMessages from "../../../util/IntlMessages";
import { useDispatch, useSelector } from "react-redux";
import { setPathName } from "../../../redux/actions";

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const SidebarContent = ({ account }) => {
  const navStyle = useSelector(({ settings }) => settings.navStyle);
  const themeType = useSelector(({ settings }) => settings.themeType);
  const dispatch = useDispatch();
  const router = useRouter();

  const getNoHeaderClass = (navStyle) => {
    if (
      navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR ||
      navStyle === NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR
    ) {
      return "gx-no-header-notifications";
    }
    return "";
  };
  const getNavStyleSubMenuClass = (navStyle) => {
    if (navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR) {
      return "gx-no-header-submenu-popup";
    }
    return "";
  };

  useEffect(() => {
    dispatch(setPathName(router.pathname));
  }, [router.pathname]);

  const selectedKeys = router.pathname.substr(1);
  const defaultOpenKeys = selectedKeys.split("/")[1];

  return (
    <>
      <SidebarLogo />
      <div className="gx-sidebar-content">
        <div
          className={`gx-sidebar-notifications ${getNoHeaderClass(navStyle)}`}
        >
          <UserProfile account={account} />
        </div>
        <CustomScrollbars className="gx-layout-sider-scrollbar">
          <Menu
            defaultOpenKeys={[defaultOpenKeys]}
            selectedKeys={[selectedKeys]}
            theme={themeType === THEME_TYPE_LITE ? "lite" : "dark"}
            mode="inline"
          >
            <MenuItemGroup
              key="main"
              className="gx-menu-group"
              title={<IntlMessages id="sidebar.main" />}
            >
              <SubMenu
                key="dashboard"
                popupClassName={getNavStyleSubMenuClass(navStyle)}
                title={
                  <span>
                    <i className="icon icon-dasbhoard" />
                    <span>
                      <IntlMessages id="sidebar.dashboard" />
                    </span>
                  </span>
                }
              >
                <Menu.Item key="main/dashboard/crm">
                  <Link href="/main/dashboard/crm">
                    <span>
                      <IntlMessages id="sidebar.dashboard.stat" />
                    </span>
                  </Link>
                </Menu.Item>
              </SubMenu>
              {/* Masterfile */}
              <SubMenu
                key="masterfile"
                popupClassName={getNavStyleSubMenuClass(navStyle)}
                title={
                  <span>
                    <i className="icon icon-ckeditor" />
                    <span>
                      <IntlMessages id="sidebar.masterfile" />
                    </span>
                  </span>
                }
              >
                <Menu.Item key="main/masterfile/items">
                  <Link href="/main/masterfile/items">
                    <span>
                      <IntlMessages id="sidebar.masterfile.items" />
                    </span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="main/masterfile/suppliers">
                  <Link href="/main/masterfile/suppliers">
                    <span>
                      <IntlMessages id="sidebar.masterfile.suppliers" />
                    </span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="main/masterfile/signatures">
                  <Link href="/main/masterfile/signatures">
                    <span>
                      <IntlMessages id="sidebar.masterfile.signatures" />
                    </span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="main/masterfile/others">
                  <Link href="/main/masterfile/others">
                    <span>
                      <IntlMessages id="sidebar.masterfile.others" />
                    </span>
                  </Link>
                </Menu.Item>
              </SubMenu>
              {/* Transaction */}
              <SubMenu
                key="transaction"
                popupClassName={getNavStyleSubMenuClass(navStyle)}
                title={
                  <span>
                    <i className="icon icon-orders" />
                    <span>
                      <IntlMessages id="sidebar.transactions" />
                    </span>
                  </span>
                }
              >
                <Menu.Item key="main/transactions/pr">
                  <Link href="/main/transactions/pr">
                    <span>
                      <IntlMessages id="sidebar.transactions.pr" />
                    </span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="main/transactions/po">
                  <Link href="/main/transactions/po">
                    <span>
                      <IntlMessages id="sidebar.transactions.po" />
                    </span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="main/transactions/pomonitoring">
                  <Link href="/main/transactions/pomonitoring">
                    <span>
                      <IntlMessages id="sidebar.transactions.pomonitoring" />
                    </span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="main/transactions/dr">
                  <Link href="/main/transactions/dr">
                    <span>
                      <IntlMessages id="sidebar.transactions.dr" />
                    </span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="main/transactions/rts">
                  <Link href="/main/transactions/rts">
                    <span>
                      <IntlMessages id="sidebar.transactions.rts" />
                    </span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="main/transactions/issuances">
                  <Link href="/main/transactions/issuances">
                    <span>
                      <IntlMessages id="sidebar.transactions.issuances" />
                    </span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="main/transactions/mp">
                  <Link href="/main/transactions/mp">
                    <span>
                      <IntlMessages id="sidebar.transactions.mp" />
                    </span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="main/transactions/adjustments">
                  <Link href="/main/transactions/adjustments">
                    <span>
                      <IntlMessages id="sidebar.transactions.adjustments" />
                    </span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="main/transactions/bc">
                  <Link href="/main/transactions/bc">
                    <span>
                      <IntlMessages id="sidebar.transactions.bc" />
                    </span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="main/transactions/markup">
                  <Link href="/main/transactions/markup">
                    <span>
                      <IntlMessages id="sidebar.transactions.markup" />
                    </span>
                  </Link>
                </Menu.Item>
              </SubMenu>
              {/* SHOP */}
              <Menu.Item key="main/shop">
                <Link href="/main/shop">
                  <a>
                    <i className="icon icon-shopping-cart" />
                    <span>
                      <IntlMessages id="sidebar.shop" />
                    </span>
                  </a>
                </Link>
              </Menu.Item>
              {/* Reports */}
              <SubMenu
                key="reports"
                popupClassName={getNavStyleSubMenuClass(navStyle)}
                title={
                  <span>
                    <i className="icon icon-hotel-booking" />
                    <span>
                      <IntlMessages id="sidebar.reports" />
                    </span>
                  </span>
                }
              >
                <Menu.Item key="main/reports/stockcard">
                  <Link href="/main/reports/stockcard">
                    <span>
                      <IntlMessages id="sidebar.reports.stockcard" />
                    </span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="main/reports/onhand">
                  <Link href="/main/reports/onhand">
                    <span>
                      <IntlMessages id="sidebar.reports.onhand" />
                    </span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="main/reports/expenses">
                  <Link href="/main/reports/expenses">
                    <span>
                      <IntlMessages id="sidebar.reports.expenses" />
                    </span>
                  </Link>
                </Menu.Item>
                {/* <Menu.Item key="main/reports/issuances">
                  <Link href="/main/reports/issuances">
                    <span><IntlMessages id="sidebar.reports.issuances" /></span></Link>
                </Menu.Item> */}
                <Menu.Item key="main/reports/dr">
                  <Link href="/main/reports/dr">
                    <span>
                      <IntlMessages id="sidebar.reports.dr" />
                    </span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="main/reports/dritems">
                  <Link href="/main/reports/dritems">
                    <span>
                      <IntlMessages id="sidebar.reports.dritems" />
                    </span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="main/reports/chargeditems">
                  <Link href="/main/reports/chargeditems">
                    <span>
                      <IntlMessages id="sidebar.reports.chargeditems" />
                    </span>
                  </Link>
                </Menu.Item>
              </SubMenu>
            </MenuItemGroup>
            {/* Service Management */}
            {/* <MenuItemGroup key="service-management" className="gx-menu-group"
              title={<IntlMessages id="sidebar.service-management" />}>
              <Menu.Item key="service/servicemanagment">
                <Link href="/service/servicemanagment"><a><i className="icon icon-select" /><span><IntlMessages
                  id="sidebar.servicemanagment" /></span></a></Link>
              </Menu.Item>
            </MenuItemGroup> */}
            {/* <MenuItemGroup key="asset-management" className="gx-menu-group"
              title={<IntlMessages id="sidebar.asset-management" />}>
              <Menu.Item key="asset/manage">
                <Link href="/asset/manage"><a><i className="icon icon-apps" /><span><IntlMessages
                  id="sidebar.assetmanage" /></span></a></Link>
              </Menu.Item>
              <Menu.Item key="asset/gas">
                <Link href="/asset/gas"><a><i className="icon icon-select" /><span><IntlMessages
                  id="sidebar.gas-slip" /></span></a></Link>
              </Menu.Item>
            </MenuItemGroup> */}
            <MenuItemGroup
              key="project-management"
              className="gx-menu-group"
              title={<IntlMessages id="sidebar.project-management" />}
            >
              <Menu.Item key="projects/customer">
                <Link href="/projects/customer">
                  <a>
                    <i className="icon icon-avatar" />
                    <span>
                      <IntlMessages id="sidebar.customer" />
                    </span>
                  </a>
                </Link>
              </Menu.Item>
              <Menu.Item key="projects/project-list">
                <Link href="/projects/project-list">
                  <a>
                    <i className="icon icon-product-list" />
                    <span>
                      <IntlMessages id="sidebar.projects" />
                    </span>
                  </a>
                </Link>
              </Menu.Item>
            </MenuItemGroup>
            {/* Asset */}
            <MenuItemGroup
              key="asset-management"
              className="gx-menu-group"
              title={<IntlMessages id="sidebar.asset-management" />}
            >
              <Menu.Item key="assets/customer">
                <Link href="/assets/customer">
                  <a>
                    <i className="icon icon-avatar" />
                    <span>
                      <IntlMessages id="sidebar.customer" />
                    </span>
                  </a>
                </Link>
              </Menu.Item>
              <Menu.Item key="assets/manage">
                <Link href="/assets/manage">
                  <a>
                    <i className="icon icon-company" />
                    <span>
                      <IntlMessages id="sidebar.asset.manage" />
                    </span>
                  </a>
                </Link>
              </Menu.Item>
              <Menu.Item key="assets/job-order">
                <Link href="/assets/job-order">
                  <a>
                    <i className="icon icon-product-list" />
                    <span>
                      <IntlMessages id="sidebar.asset.joborder" />
                    </span>
                  </a>
                </Link>
              </Menu.Item>
              <SubMenu
                key="gasoline"
                popupClassName={getNavStyleSubMenuClass(navStyle)}
                title={
                  <span>
                    <i className="icon icon-hotel-booking" />
                    <span>
                      <IntlMessages id="sidebar.asset.gas-monitoring" />
                    </span>
                  </span>
                }
              >
                <Menu.Item key="assets/gasoline/type">
                  <Link href="/assets/gasoline/type">
                    <span>
                      <IntlMessages id="sidebar.asset.gas.type" />
                    </span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="assets/gasoline/po">
                  <Link href="/assets/gasoline/po">
                    <span>
                      <IntlMessages id="sidebar.asset.gas.po" />
                    </span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="assets/gasoline/ledger">
                  <Link href="/assets/gasoline/ledger">
                    <span>
                      <IntlMessages id="sidebar.asset.gas.ledger" />
                    </span>
                  </Link>
                </Menu.Item>
              </SubMenu>
            </MenuItemGroup>
            {/* Billing & Finances */}
            <MenuItemGroup
              key="billing-finances"
              className="gx-menu-group"
              title={<IntlMessages id="sidebar.billing-finances" />}
            >
              {/* <Menu.Item key="billing/jobs">
                <Link href="/billing/jobs">
                  <a>
                    <i className="icon icon-product-list" />
                    <span>
                      <IntlMessages id="sidebar.jobs" />
                    </span>
                  </a>
                </Link>
              </Menu.Item> */}

              <Menu.Item key="billing/billingaccounts">
                <Link href="/billing/billingaccounts">
                  <a>
                    <i className="icon icon-pricing-table" />
                    <span>
                      <IntlMessages id="sidebar.billingaccounts" />
                    </span>
                  </a>
                </Link>
              </Menu.Item>
              <Menu.Item key="billing/otc">
                <Link href="/billing/otc">
                  <a>
                    <i className="icon icon-chart-bar" />
                    <span>
                      <IntlMessages id="sidebar.otc" />
                    </span>
                  </a>
                </Link>
              </Menu.Item>

              <SubMenu
                key="cashier"
                popupClassName={getNavStyleSubMenuClass(navStyle)}
                title={
                  <span>
                    <i className="icon icon-revenue-new" />
                    <span>
                      <IntlMessages id="sidebar.cashier" />
                    </span>
                  </span>
                }
              >
                <Menu.Item key="billing/cashier/accountfolios">
                  <Link href="/billing/cashier/accountfolios">
                    <span>
                      <IntlMessages id="sidebar.cashier.accountfolios" />
                    </span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="billing/cashier/cashtransaction">
                  <Link href="/billing/cashier/cashtransaction">
                    <span>
                      <IntlMessages id="sidebar.cashier.cashtransaction" />
                    </span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="billing/cashier/voidpayments">
                  <Link href="/billing/cashier/voidpayments">
                    <span>
                      <IntlMessages id="sidebar.cashier.voidpayments" />
                    </span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="billing/cashier/terminals">
                  <Link href="/billing/cashier/terminals">
                    <span>
                      <IntlMessages id="sidebar.cashier.terminals" />
                    </span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="billing/cashier/collection">
                  <Link href="/billing/cashier/collection">
                    <span>
                      <IntlMessages id="sidebar.cashier.collection" />
                    </span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="billing/cashier/cashieradmin">
                  <Link href="/billing/cashier/cashieradmin">
                    <span>
                      <IntlMessages id="sidebar.cashier.cashieradmin" />
                    </span>
                  </Link>
                </Menu.Item>
              </SubMenu>
              {/* Sales Report */}
              <SubMenu
                key="billing-finances-reports"
                popupClassName={getNavStyleSubMenuClass(navStyle)}
                title={
                  <span>
                    <i className="icon icon-chart-line" />
                    <span>
                      <IntlMessages id="sidebar.billing-finances.reports" />
                    </span>
                  </span>
                }
              >
                <Menu.Item key="billing/reports/salesreport">
                  <Link href="/billing/reports/salesreport">
                    <span>
                      <IntlMessages id="sidebar.billing-finances.reports.salesreport" />
                    </span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="billing/reports/cashflow">
                  <Link href="/billing/reports/cashflow">
                    <span>
                      <IntlMessages id="sidebar.billing-finances.reports.cashflow" />
                    </span>
                  </Link>
                </Menu.Item>
              </SubMenu>
            </MenuItemGroup>
            {/* Admintrator Menu */}
            <MenuItemGroup
              key="in-built-apps"
              className="gx-menu-group"
              title={<IntlMessages id="sidebar.admin" />}
            >
              <Menu.Item key="admin/employees">
                <Link href="/admin/employees">
                  <a>
                    <i className="icon icon-auth-screen" />
                    <span>
                      <IntlMessages id="sidebar.admin.employee" />
                    </span>
                  </a>
                </Link>
              </Menu.Item>

              <Menu.Item key="admin/offices">
                <Link href="/admin/offices">
                  <a>
                    <i className="icon icon-home" />
                    <span>
                      <IntlMessages id="sidebar.admin.office" />
                    </span>
                  </a>
                </Link>
              </Menu.Item>

              <SubMenu
                key="admin-others"
                popupClassName={getNavStyleSubMenuClass(navStyle)}
                title={
                  <span>
                    <i className="icon icon-extra-components" />
                    <span>
                      <IntlMessages id="sidebar.admin.others" />
                    </span>
                  </span>
                }
              >
                <Menu.Item key="admin/others/position">
                  <Link href="/admin/others/position">
                    <span>
                      <IntlMessages id="sidebar.admin.others.position" />
                    </span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="admin/others/company">
                  <Link href="/admin/others/company">
                    <span>
                      <IntlMessages id="sidebar.admin.others.company" />
                    </span>
                  </Link>
                </Menu.Item>
              </SubMenu>
            </MenuItemGroup>
            {/* Admintrator Menu */}
          </Menu>
        </CustomScrollbars>
      </div>
    </>
  );
};

SidebarContent.propTypes = {};
export default SidebarContent;
