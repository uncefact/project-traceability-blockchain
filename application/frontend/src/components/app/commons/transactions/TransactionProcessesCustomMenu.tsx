import React from "react";
import styles from './TransactionProcessesCustomMenu.module.scss';

export const TransactionProcessesCustomMenu = React.forwardRef(
    // @ts-ignore
    ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
        const [value, setValue] = React.useState('');
        //@ts-ignore
        // const newChildren = children[0];
        // //@ts-ignore
        // newChildren.props.children = newChildren.props.children.filter((child) => !value || child.type==='div' || child.props.children.toLowerCase().includes(value.toLowerCase()));
        // console.log(newChildren.props.children);
        // newChildren.props.children = newChildren.props.children


        // console.log("children[1]: ", children[1]);
        // @ts-ignore
        // console.log("children[0].props: ", React.Children.toArray(children[0]));
        return (
            <div
                // @ts-ignore
                ref={ref}
                style={style}
                className={className}
                aria-labelledby={labeledBy}
            >
                {/*<h4 className="text-center">Search</h4>*/}
                {/*<FormControl*/}
                {/*    autoFocus*/}
                {/*    className="mx-3 my-2 w-auto"*/}
                {/*    placeholder="Type to filter..."*/}
                {/*    onChange={(e) => setValue(e.target.value)}*/}
                {/*    value={value}*/}
                {/*/>*/}
                <ul className={'list-unstyled '+styles.Scrollable}>
                    {
                        // @ts-ignore
                        React.Children.toArray(children[0].props.children.filter((child) => !value || child.type==='div' || child.props.children.toLowerCase().includes(value.toLowerCase())))
                    }
                </ul>
                <ul className="list-unstyled">
                    {
                        // @ts-ignore
                        React.Children.toArray(children[1])
                    }
                </ul>
            </div>
        );
    },
);
