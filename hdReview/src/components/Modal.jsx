import React from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";

export function Modal(props) {
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => setOpen(!open);

    return (
        <>
            <Dialog open={props.open} handler={handleOpen}>
                {props.userData.attributes == undefined ? (
                    ""
                ) : (
                    <>
                        {" "}
                        <DialogHeader>
                            {props.userData.attributes == undefined
                                ? ""
                                : props.userData.attributes.userName}
                        </DialogHeader>
                        <DialogBody>
                            Жалоба -{" "}
                            {props.userData
                                ? props.userData.attributes.userComment
                                : ""}
                        </DialogBody>
                        <DialogBody>
                            {" "}
                            Номер пользователя -{" "}
                            {props.userData
                                ? props.userData.attributes.userPhone
                                : ""}
                        </DialogBody>
                        <DialogBody>
                            {" "}
                            Статус -{" "}
                            {props.userData
                                ? props.userData.attributes.Progress
                                : ""}
                        </DialogBody>
                        <DialogBody>
                            {" "}
                            Испольнитель -{" "}
                            {props.userData
                                ? props.userData.attributes.executor
                                : ""}
                        </DialogBody>
                    </>
                )}
                <DialogFooter>
                    <Button
                        variant="text"
                        color="red"
                        onClick={() => props.changeOpener(!props.open)}
                        className="mr-1"
                    >
                        <span>Cancel</span>
                    </Button>
                    <Button
                        variant="gradient"
                        color="green"
                        onClick={() => props.changeOpener(!props.open)}
                    >
                        <span>Confirm</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}
