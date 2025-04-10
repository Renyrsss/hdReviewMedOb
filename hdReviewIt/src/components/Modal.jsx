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
                            {" "}
                            <span className='font-bold'>Заявка</span> -{" "}
                            {props.userData.attributes.userQuery
                                ? props.userData.attributes.userQuery
                                : ""}
                        </DialogBody>
                        <DialogBody>
                            <span className='font-bold'>Описание</span> -{" "}
                            {props.userData
                                ? props.userData.attributes.userComment
                                : ""}
                        </DialogBody>
                        <DialogBody>
                            {" "}
                            <span className='font-bold'>
                                Номер пользователя
                            </span>{" "}
                            -{" "}
                            {props.userData
                                ? props.userData.attributes.userPhone
                                : ""}
                        </DialogBody>
                        <DialogBody>
                            {" "}
                            <span className='font-bold'>Статус</span> -{" "}
                            {props.userData
                                ? props.userData.attributes.Progress
                                : ""}
                        </DialogBody>
                        <DialogBody>
                            {" "}
                            <span className='font-bold'>Категория</span> -{" "}
                            {props.userData
                                ? props.userData.attributes.complexity
                                : ""}
                        </DialogBody>
                        <DialogBody>
                            {" "}
                            <span className='font-bold'>
                                Комментарий исполнителя
                            </span>{" "}
                            -{" "}
                            {props.userData.attributes.outComment
                                ? props.userData.attributes.outComment
                                : "не заполнен"}
                        </DialogBody>
                    </>
                )}
                <DialogFooter>
                    <Button
                        variant='gradient'
                        color='green'
                        onClick={() => props.changeOpener(!props.open)}>
                        <span>Закрыть</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}
