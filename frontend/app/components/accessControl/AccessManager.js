import { AccountContext } from './AccountContext'
import React, { useContext } from 'react';
import _ from 'lodash'
import Forbidden from '../../../routes/customViews/extraPages/Forbidden';
import ResetPassword from '../../../pages/resetPassword';
// import Forbidden from "../../pages/forbidden";
// import ResetPassword from "../../pages/resetPassword";


export function isInRole(role, rolesRepo) {
    return _.includes(rolesRepo || [], role);
}


export function isInAnyRole(roles, rolesRepo) {

    roles = _.isArray(roles) ? roles : [];
    var found = false;
    roles.forEach(function (i) {

        // console.log(i)
        if (isInRole(i, rolesRepo)) {
            found = true;
        }

    });


    return found;
}



const AccessManager = (props) => {
    const accountContext = useContext(AccountContext);

    //allowedRoles
    const roles = props.roles || ['ROLE_USER'];

    const account = accountContext;


    if (!_.get(account, 'user.activated', false))
        return <div><ResetPassword account={account} /></div>

    const currentRoles = _.get(account, 'user.roles', []);
    if (Array.isArray(roles)) {


        if (isInAnyRole(roles, currentRoles)) {
            return <>{props.children}</>
        }
    }
    if (typeof roles === 'string') {
        if (isInRole(roles, currentRoles)) {
            return <>{props.children}</>
        }
    }

    return <Forbidden />
};


export default AccessManager;

