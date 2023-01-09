import React from "react";
import {Redirect, Route} from 'react-router-dom';

type Props = {
    path?: string,
    exact?: boolean,
    component?: any,
    authenticated: boolean,
    redirectPath: string
}
export const ProtectedRoute = (props: Props) => {
    const Component = props.component;
    if (!props.path)
        return (
            <Route
                render={routeProps  =>
                    (
                        <Redirect to={{ pathname: props.redirectPath,
                            state: { from: routeProps.location }}}
                        />
                    )
                }
            />
        );

    return (
        <Route
            render={routeProps  =>
                props.authenticated ? (
                    <Component />
                ) : (
                    <Redirect to={{ pathname: props.redirectPath,
                        state: { from: routeProps.location }}}
                    />
                )
            }
        />
    )
}
export default ProtectedRoute;
