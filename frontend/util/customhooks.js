import React, { useState, useEffect } from "react";


export function useLocalStorage(key, initialValue) {
    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState(() => {
        try {
            // Get from local storage by key
            const item = window.localStorage.getItem(key);
            // Parse stored json or if none return initialValue
            // console.log("localstorage => ", item)
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            // If error also return initialValue
            console.log(error);
            return initialValue;
        }
    });

    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const setValue = value => {
        try {
            // Allow value to be a function so we have same API as useState
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;
            // Save state
            setStoredValue(valueToStore);
            // Save to local storage
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            // A more advanced implementation would handle the error case
            console.log(error);
        }
    };

    return [storedValue, setValue];
}



// one use hook
//https://dev.to/gabe_ragland/debouncing-with-react-hooks-jci

export default function useDebounce(value, delay) {
    // State and setters for debounced value
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(
        () => {
            // Set debouncedValue to value (passed in) after the specified delay
            const handler = setTimeout(() => {
                setDebouncedValue(value);
            }, delay);

            // Return a cleanup function that will be called every time ...
            // ... useEffect is re-called. useEffect will only be re-called ...
            // ... if value changes (see the inputs array below).
            // This is how we prevent debouncedValue from changing if value is ...
            // ... changed within the delay period. Timeout gets cleared and restarted.
            // To put it in context, if the user is typing within our app's ...
            // ... search box, we don't want the debouncedValue to update until ...
            // ... they've stopped typing for more than 500ms.
            return () => {
                clearTimeout(handler);
            };
        },
        // Only re-call effect if value changes
        // You could also add the "delay" var to inputs array if you ...
        // ... need to be able to change that dynamically.
        [value]
    );

    return debouncedValue;
}


// export function dialogHook(Component) {
//     const [isVisible, setIsVisible] = useState(false);
//     const [myProps, setMyProps] = useState({});
//     const modal = (
//         <Component
//             visible={isVisible}
//             {...myProps}
//             hide={(args) => {
//                 setIsVisible(false);
//                 if (myProps.onCloseCallback)
//                     myProps.onCloseCallback(args);
//             }}
//         />
//     )
//     return (props, onCloseCallback) => {
//         let tprops = props || {};
//         if (onCloseCallback)
//             tprops.onCloseCallback = onCloseCallback;
//         setMyProps(tprops);
//         return modal;
//     }
// }

export const dialogHook = (Component, onCloseCallback) => {
    const [isVisible, setIsVisible] = useState({
        show: false,
        myProps: {}
    });

    const modal = (
        <Component
            visible={isVisible.show}
            {...isVisible.myProps}
            hide={(args) => {
                if (onCloseCallback) {
                    onCloseCallback(args);
                }
                setIsVisible({ show: false, myProps: {} });
            }}
        />
    )

    return [isVisible.show ? modal : null, setIsVisible];
};
// export function confirmHook(title = "Confirmation", message = "Please confirm", callbackOk, sizep = "tiny", ...theRestArgs) {

//     let args = theRestArgs;

//     const [showConfirm, hideConfirm] = useModal(() => {
//         return <Confirm
//             size={sizep}
//             closeOnDimmerClick={false}
//             open
//             onConfirm={() => {
//                 hideConfirm();
//                 if (callbackOk)
//                     callbackOk(args)
//             }
//             }
//             onCancel={() => { hideConfirm() }}
//             header={title}
//             content={message}
//             className='custom-modal-style'
//         />
//     }, args);


//     return [showConfirm, hideConfirm];


// }



// const CustomAlert = ({ hide, title, message, headerStyle }) => {

//     if (!headerStyle)
//         headerStyle = { backgroundColor: '#fff' }

//     return <Modal open size={"mini"} onClose={hide}>
//         <Modal.Header style={headerStyle}>{title}</Modal.Header>
//         <Modal.Content >
//             {message}
//         </Modal.Content>
//         <Modal.Actions style={{ padding: 7 }}>
//             <Button color={"red"} onClick={hide} size='mini'>
//                 Close
//             </Button>
//         </Modal.Actions>

//     </Modal>
// };

// export function alertMessage(call) {


//     const [title, setTitle] = useState('Title');
//     const [message, setMessage] = useState('Message');
//     const [headerStyle, setHeaderStyle] = useState({ backgroundColor: '#4d63ff', color: 'white', padding: 10, fontSize: 16 });

//     const [showAlert, hideAlert] = useModal(() => {
//         return <CustomAlert
//             hide={(args) => {
//                 hideAlert();
//                 if (callBack) {
//                     callBack(args)
//                 }
//             }}
//             title={title}
//             message={message}
//             headerStyle={headerStyle}
//         />
//     }, [title, message, headerStyle]);



//     return (title, message, callBack) => {

//         setTitle(title);
//         setMessage(message);

//         showAlert()

//     }


// }
