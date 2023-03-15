import React from 'react'
import { AccountConsumer, AccountProvider } from "./AccountContext";
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import parseUrl from 'parse-url';
import _ from 'lodash'
import { ModalProvider } from "react-modal-hook";
import CircularProgress from "../CircularProgress";
import Forbidden from '../../../routes/customViews/extraPages/Forbidden';
import AppLayout from '../../core/Layout';
// import { post } from "../../shared/global";

const AuthManager = (props) => {

    const { loading, error, data } = useQuery(
        gql`
			{
				account {
					id
					fullName
                    initialName
                    gender
					user {
						access
						roles
						password
						login
						activated
					}
                    position {
                        id
                        description
                    }
                    office {
                        id
                        officeDescription
                    }
				}
			}
		`
        ,
        { errorPolicy: 'all' });


    const blank = <div className="gx-loader-view">
        <CircularProgress />
    </div>;


    /*
     background-image: url('/logohisd3.png')  !important;
 
     if(error)
     https://github.com/apollographql/apollo-link/issues/300
     console.log(error.networkError.statusCode);*/

    /*
    <pre>Bad: {error.graphQLErrors.map(({ message }, i) => (
            <span key={i}>{message}</span>
        ))}
      </pre>

        operation: The Operation that errored
    response: The response from the server
   graphQLErrors: An array of errors from the GraphQL endpoint
   networkError: any error during the link execution or server response


   see
   https://github.com/apollographql/apollo-link/issues/300
     */

    if (error) {
        if (error.networkError && error.networkError.statusCode === 403) {
            return <>
                <Forbidden />
            </>
        }
        if (error.networkError && error.networkError.statusCode === 401) {

            const parts = parseUrl(window.location.href);
            const pathname = parts.pathname || ""
            const search = parts.search || ""
            const hash = parts.hash || ""

            window.location = "/login?redirectUrl=" + encodeURIComponent(pathname + search + hash)

        }
    }


    if (!data || loading) {
        return blank;
    }


    return <AccountProvider value={_.get(data, 'account', {})}>
        <AccountConsumer>
            {
                value => {

                    const childrenWithProps = React.Children.map(props.children, child =>
                        React.cloneElement(child, { account: value })
                    );

                    return (
                        <ModalProvider>
                            <AppLayout account={value}>
                                {childrenWithProps}
                            </AppLayout>
                        </ModalProvider>
                    )

                }
            }
        </AccountConsumer>
    </AccountProvider>
};

export default AuthManager;
