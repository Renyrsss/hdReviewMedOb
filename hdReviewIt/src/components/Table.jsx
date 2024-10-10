import { PencilIcon } from "@heroicons/react/24/solid";
import * as XLSX from "xlsx";
import MonthButtons from "./MonthButton";
import Pagination from "./Pagination";
import {
    ArrowDownTrayIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import {
    Card,
    CardHeader,
    Typography,
    Button,
    CardBody,
    Chip,
    CardFooter,
    Avatar,
    IconButton,
    Tooltip,
    Input,
} from "@material-tailwind/react";
import axios from "axios";
import { Modal } from "./Modal";
import { useEffect, useState } from "react";
import { observable } from "mobx";
import Review from "../store/Review";
import { observer } from "mobx-react-lite";
import {
    differenceInBusinessDays,
    setHours,
    setMinutes,
    setSeconds,
    isWeekend,
    addDays,
} from "date-fns";

const TABLE_HEAD = [
    "Имя сотрудника",
    "Номер",
    "Дата создания",
    "Дата обновления",
    "Выполнено",
    "",
];

const calculateWorkingTime = (createdAt, closedAt) => {
    // const startDay = new Date(createdAt);
    // const endDay = new Date(closedAt);

    // const workStartHour = 8;
    // const workEndHour = 17;

    // // Если дата закрытия раньше даты открытия, возвращаем 0
    // if (endDay <= startDay) return "0 дней 0 часов 0 минут";

    // // Приводим даты к рамкам рабочего времени
    // let actualStart = new Date(startDay);
    // let actualEnd = new Date(endDay);

    // // Корректируем начало рабочего дня
    // if (actualStart.getHours() < workStartHour) {
    //     actualStart = setHours(actualStart, workStartHour);
    //     actualStart = setMinutes(actualStart, 0);
    //     actualStart = setSeconds(actualStart, 0);
    // }
    // if (actualEnd.getHours() > workEndHour) {
    //     actualEnd = setHours(actualEnd, workEndHour);
    //     actualEnd = setMinutes(actualEnd, 0);
    //     actualEnd = setSeconds(actualEnd, 0);
    // }

    // // Исключаем выходные
    // if (isWeekend(actualStart)) actualStart = addDays(actualStart, 1);
    // if (isWeekend(actualEnd)) actualEnd = addDays(actualEnd, -1);

    // // Количество рабочих дней между датами
    // const businessDays = differenceInBusinessDays(actualEnd, actualStart);

    // // Рассчитываем полные дни в рабочих часах (если больше одного дня)
    // const totalFullHours = businessDays * (workEndHour - workStartHour);

    // // Рассчитываем часы для первого дня (включая минуты)
    // let startDayHours = 0;
    // if (actualStart.getHours() < workEndHour) {
    //     startDayHours = workEndHour - actualStart.getHours();
    //     startDayHours -= actualStart.getMinutes() / 60; // Учитываем минуты
    // }

    // // Рассчитываем часы для последнего дня (включая минуты)
    // let endDayHours = 0;
    // if (actualEnd.getHours() > workStartHour) {
    //     endDayHours = actualEnd.getHours() - workStartHour;
    //     endDayHours += actualEnd.getMinutes() / 60; // Учитываем минуты
    // }

    // // Общее количество рабочих часов
    // const totalHours = totalFullHours + startDayHours + endDayHours;

    // // Преобразуем рабочие часы в дни, часы и минуты
    // const days = Math.floor(totalHours / (workEndHour - workStartHour));
    // const remainingHours = totalHours % (workEndHour - workStartHour);
    // const hours = Math.floor(remainingHours);
    // const minutes = Math.round((remainingHours - hours) * 60); // Теперь учитываем оставшиеся минуты

    // return `${days} дней ${hours} часов ${minutes} минут`;
    const startDay = new Date(createdAt);
    const endDay = new Date(closedAt);

    // Если дата закрытия раньше даты открытия, возвращаем 0
    if (endDay <= startDay) return "0 дней 0 часов 0 минут";

    // Разница в миллисекундах между датами
    const diffInMilliseconds = endDay - startDay;

    // Переводим разницу в дни, часы и минуты
    const totalMinutes = Math.floor(diffInMilliseconds / 60000); // 1 минута = 60 * 1000 миллисекунд
    const days = Math.floor(totalMinutes / (60 * 24)); // 1 день = 60 минут * 24 часа
    const remainingMinutesAfterDays = totalMinutes % (60 * 24);
    const hours = Math.floor(remainingMinutesAfterDays / 60); // Оставшиеся часы
    const minutes = remainingMinutesAfterDays % 60; // Оставшиеся минуты

    return `${days} дней ${hours} часов ${minutes} минут`;
};

const Table = observer(() => {
    const [month, setMonth] = useState([]);
    let [currentPage, setCurrentPage] = useState(1);
    const [finalHRS, setfinalHRS] = useState("");
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState([]);
    let [userData, setUserdata] = useState({});
    const [elements, setElements] = useState([null]);
    const [open, setOpen] = useState(false);
    let dataElem = [];
    const handleOpen = (id) => {
        setOpen((prev) => !prev);
        console.log(id);
        data.map((item) => {
            if (item.id == id) {
                setUserdata(item);
            }
        });
    };
    const fetchDataForMonth = async (startOfMonth, endOfMonth) => {
        console.log(endOfMonth);

        Review.url = `http://192.168.101.25:1337/api/saids?sort=id:DESC&filters[$and][0][createdAt][$gt]=${startOfMonth}&filters[$and][1][Progress][$eq]=%D0%A1%D0%B4%D0%B5%D0%BB%D0%B0%D0%BD%D0%BE&filters[$and][0][createdAt][$lt]=${endOfMonth}`;
    };

    function setUser(userName, userFunc) {
        userFunc(userName);
    }
    const nextPage = (page) => {
        setCurrentPage(page); // Обновляем текущую страницу
    };
    // Review.changePage(currentPage);
    const currentUrl = Review.url;

    useEffect(() => {
        Review.changePage(Review.currentPage); // Устанавливаем начальную страницу
    }, []);

    useEffect(() => {
        let data = axios.get(currentUrl).then((res) => {
            setData([]);
            setData(res.data.data);
            // setElements(Math.ceil(res.data.data / 25));
            setPagination(res.data.meta.pagination);
            // paginationPages();
            return res.data.data;
        });
    }, [Review.url]);

    function getFullHours(hoursServer) {
        const res = [
            +hoursServer.slice(11, -11) + 5,
            +hoursServer.slice(14, -8),
        ];

        return res;
    }
    function getFullDate(stringOfdata) {
        const dateOfData = stringOfdata.slice(0, -14);
        return dateOfData;
    }
    function resHours(createdAt, updatedAt) {
        let res =
            getFullHours(updatedAt)[0] * 60 +
            getFullHours(updatedAt)[1] -
            (getFullHours(createdAt)[0] * 60 + getFullHours(createdAt)[1]);

        // if (res < 0) {
        //     res =
        //         480 -
        //         (getFullHours(updatedAt)[0] * 60 + getFullHours(updatedAt)[1]) -
        //         (480 -
        //             (getFullHours(createdAt)[0] * 60 +
        //                 getFullHours(createdAt)[1]));
        // }

        return res;
    }
    function convertMinutesToHours(minutes) {
        let hours = Math.floor(minutes / 60);
        let remainingMinutes = minutes % 60;

        return `${hours}:${remainingMinutes} `;
    }

    const transformDataForExport = () => {
        return data.map((item) => {
            const itemCreateHours = getFullHours(item.attributes.createdAt);
            const itemUpdateHours = getFullHours(item.attributes.updatedAt);
            const dateOfExcelCreate = getFullDate(item.attributes.createdAt);
            const dateOfExcelUpdate = getFullDate(item.attributes.updatedAt);
            console.log(itemUpdateHours);

            const itemDete = getFullHours(item.attributes.createdAt);
            return {
                ticket: item.id,
                Испольнитель: item.attributes.executor,
                "имя пользователя": item.attributes.userName, // Достаем имя из вложенного объекта
                "номер пользователя": item.attributes.userPhone,
                Отдел: item.attributes.userSide,
                "комментарий пользователя": item.attributes.userComment,
                "Дата создания": `${dateOfExcelCreate} \n ${itemCreateHours[0]} : ${itemCreateHours[1]}`,
                "Дата обновления": `${dateOfExcelUpdate} \n ${itemUpdateHours[0]} : ${itemUpdateHours[1]}`,
                Прогресс: item.attributes.Progress, // Достаем позицию
                "Сделано за ": calculateWorkingTime(
                    item.attributes.createdAt,
                    item.attributes.updatedAt
                ),

                // closedAt: item.attributes ? item.attributes : "N/A", // Обработка null значений
            };
        });
    };
    const exportToExcel = () => {
        const transformedData = transformDataForExport();
        const worksheet = XLSX.utils.json_to_sheet(transformedData);
        worksheet["!cols"] = [
            { wch: 10 }, // ширина для столбца 'ticket'
            { wch: 20 }, // ширина для столбца 'assigneeName'
            { wch: 20 }, // ширина для столбца 'assigneePosition'
            { wch: 20 }, // ширина для столбца 'status'
            { wch: 35 }, // ширина для столбца 'createdAt'
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 30 }, // ширина для столбца 'closedAt'
        ]; // Конвертация данных в лист Excel
        const workbook = XLSX.utils.book_new(); // Создание новой книги
        XLSX.utils.book_append_sheet(workbook, worksheet, "Отчет"); // Добавление листа в книгу
        XLSX.writeFile(workbook, "HelpDesk_Report.xlsx"); // Сохранение файла
    };

    function changeOpener(status) {
        console.log(status);

        setOpen(status);
    }

    console.log(pagination);

    return (
        <Card className="h-full w-full">
            <CardHeader floated={false} shadow={false} className="rounded-none">
                <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
                    <div>
                        <Typography variant="h5" color="blue-gray">
                            Отчет за месяц
                        </Typography>
                        <Typography color="gray" className="mt-1 font-normal">
                            всего выполено - {pagination.total} шт
                        </Typography>
                    </div>
                    <div className="flex w-full shrink-0 gap-2 md:w-max">
                        <div className="w-full md:w-72">
                            <Input
                                label="Поиск"
                                icon={
                                    <MagnifyingGlassIcon className="h-5 w-5" />
                                }
                            />
                        </div>
                        <Button
                            className="flex items-center gap-3"
                            size="sm"
                            onClick={exportToExcel}
                        >
                            <ArrowDownTrayIcon
                                strokeWidth={2}
                                className="h-4 w-4"
                            />{" "}
                            Скачать отчет
                        </Button>
                    </div>
                </div>
                <div>
                    <Typography color="gray" className="mt-1 font-normal">
                        <MonthButtons onMonthChange={fetchDataForMonth} />
                    </Typography>
                </div>
            </CardHeader>
            <CardBody className="overflow-scroll px-0">
                <table className="w-full min-w-max table-auto text-left">
                    <thead>
                        <tr>
                            {TABLE_HEAD.map((head) => (
                                <th
                                    key={head}
                                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                                >
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal leading-none opacity-70"
                                    >
                                        {head}
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => {
                            const isLast = index === data.length - 1;
                            const {
                                userName,
                                userPhone,
                                userSide,
                                userComment,
                                userQuery,
                                Progress,
                                executor,
                                createdAt,
                                updatedAt,
                            } = item.attributes;

                            const classes = isLast
                                ? "p-4"
                                : "p-4 border-b border-blue-gray-50";

                            return (
                                <tr
                                    key={item.id}
                                    onClick={() => handleOpen(item.id)}
                                >
                                    <td className={classes}>
                                        <div className="flex items-center gap-3">
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-bold ml-4 nameSide"
                                            >
                                                {userName}
                                            </Typography>
                                        </div>
                                    </td>

                                    <td className={classes}>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal"
                                        >
                                            {userPhone}
                                        </Typography>
                                    </td>
                                    <td className={classes}>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal"
                                        >
                                            {createdAt.slice(0, -14)} <br />
                                            {" время: " +
                                                (+createdAt.slice(11, -11) +
                                                    5) +
                                                ":" +
                                                createdAt.slice(14, -8)}
                                        </Typography>
                                    </td>
                                    <td className={classes}>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal"
                                        >
                                            {updatedAt.slice(0, -14)} <br />
                                            {" время: " +
                                                (+updatedAt.slice(11, -11) +
                                                    5) +
                                                ":" +
                                                updatedAt.slice(14, -8)}
                                        </Typography>
                                    </td>

                                    <td className={classes}>
                                        <div className="w-max">
                                            <Chip
                                                size="sm"
                                                className="doneSize"
                                                variant="ghost"
                                                value={calculateWorkingTime(
                                                    createdAt,
                                                    updatedAt
                                                )}
                                                color={
                                                    Progress === "Сделано"
                                                        ? "green"
                                                        : Progress ===
                                                          "в работе"
                                                        ? "amber"
                                                        : "red"
                                                }
                                            />
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </CardBody>

            <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                <Button variant="outlined" size="sm">
                    Previous
                </Button>
                <div className="flex items-center gap-2">
                    <Pagination
                        pageCount={pagination.pageCount}
                        currentPage={Review.currentPage}
                        // nextPage={nextPage}
                    />
                </div>

                <Button variant="outlined" size="sm">
                    Next
                </Button>
            </CardFooter>
            <Modal
                userData={userData}
                open={open}
                changeOpener={changeOpener}
            />
        </Card>
    );
});

export default Table;
