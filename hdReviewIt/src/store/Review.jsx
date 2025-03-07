import { makeAutoObservable, action } from "mobx";
import axios from "axios";
import * as XLSX from "xlsx";
class Review {
    url = "http://192.168.101.25:1337/api/skud-zaprosy-help-desks?sort=id:DESC";
    count = 0;
    vadim = "";
    currentPage = 1; // начальная страница
    resetBtn = "";
    selectedUser = 1;
    monthSelectedOrNot = "год";

    constructor() {
        makeAutoObservable(this, {
            changePage: action, // Явно указываем, что это действие
            updateUrlWithPage: action, // Явно указываем, что это действие
        });
    }
    chnageMonthSelectedOrNot(state) {
        this.monthSelectedOrNot = state;
    }
    changeSelectedUser(id) {
        this.selectedUser = id;
    }
    changeUrl(url) {
        this.url = url;
    }
    resetBtnFunc(btnStatus) {
        this.resetBtn = btnStatus;
        if (btnStatus == "год") {
            this.currentPage = 1;
        }
    }
    userApi(user) {
        let urlObj = this.url;
        if (user === "Саид") {
            if (
                !urlObj.includes("&filters[$and][0][executor][$containsi]=Саид")
            ) {
                // Удаляем Дмитрия, если он присутствует
                // urlObj = urlObj
                //     .split("&filters[$and][0][executor][$containsi]=Дмитрий")
                //     .join("");
                // Добавляем Вадима
                urlObj += "&filters[$and][0][executor][$containsi]=Саид";
                this.url = urlObj;
            }
        } else if (user === "Дмитрий") {
            if (
                !urlObj.includes(
                    "&filters[$and][0][executor][$containsi]=Дмитрий"
                )
            ) {
                // Удаляем Вадима, если он присутствует
                urlObj = urlObj
                    .split("&filters[$and][0][executor][$containsi]=Вадим")
                    .join("");
                // Добавляем Дмитрия
                urlObj += "&filters[$and][0][executor][$containsi]=Дмитрий";
                this.url = urlObj;
            }
        } else if (user === "все") {
            console.log(user);
            urlObj =
                "http://192.168.101.25:1338/api/zayavkis?sort=id:DESC&filters[$and][0][Progress][$eq]=Сделано&pagination[withCount]=true&pagination[pageSize]=1000";
            this.url = urlObj;
        }

        console.log(urlObj);
    }
    // Метод для смены страницы
    changePage(page) {
        this.currentPage = page;
        this.updateUrlWithPage(page);
    }

    updateUrlWithPage(page) {
        let urlObj = this.url;

        if (urlObj.includes("&pagination[page]=")) {
            urlObj = urlObj.replace(
                /&pagination\[page\]=\d+/,
                `&pagination[page]=${page}`
            );
        } else {
            urlObj += `&pagination[page]=${page}`;
        }

        this.url = urlObj;
        console.log(this.url);
    }
    async fetchData(page) {
        console.log(page);

        this.changePage(page);
        const response = await axios.get(this.url);
        return response.data;
    }
    totalMinutes = (createdAt, closedAt) => {
        const startDay = new Date(createdAt);
        const endDay = new Date(closedAt);
        if (endDay <= startDay) return "0 дней 0 часов 0 минут";
        const diffInMilliseconds = endDay - startDay;
        const totalMinutes = Math.floor(diffInMilliseconds / 60000);
        return totalMinutes;
    };
    calculateWorkingTime = (createdAt, closedAt) => {
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
    // Метод для загрузки всех данных для экспорта
    async fetchAllDataForExport() {
        this.data = [];
        this.currentPage = 1;

        do {
            const response = await this.fetchData(this.currentPage);
            this.data.push(...response.data); // Добавляем данные на каждой странице
            this.totalPages = response.meta.pagination.pageCount; // Обновляем количество страниц
            this.currentPage += 1; // Переходим к следующей странице
        } while (this.currentPage <= this.totalPages);

        this.exportToExcel();
    }

    // Метод для экспорта данных в Excel
    exportToExcel() {
        // const withCountNonCorrect = this.data.map((item) => {
        //     if (item.attributes.Progress.trim() !== "некорректная заявка") {
        //         // console.log(item.attributes.Progress.trim());

        //         return item;
        //     }

        // });
        function isNonCorrect(value) {
            return value.trim() != "некорректная заявка";
        }
        const withCountNonCorrect = this.data.filter((item) => {
            return isNonCorrect(item.attributes.Progress);
        });
        console.log(withCountNonCorrect);

        const transformedData = withCountNonCorrect.map((item) => {
            // console.log(item.attributes.Progress);

            const complexity = [
                {
                    value: "a",
                    time: 180,
                },
                {
                    value: "b",
                    time: 1440,
                },
                {
                    value: "c",
                    time: 2880,
                },
            ];
            const totalMinutes = this.totalMinutes(
                item.attributes.createdAt,
                item.attributes.updatedAt
            );
            let isItCurrect;
            if (item.attributes.Progress === "Сделано") {
                if (item.attributes.complexity == "A") {
                    isItCurrect = totalMinutes - complexity[0].time;
                    if (isItCurrect >= 0) {
                        isItCurrect = "НЕТ";
                    } else {
                        isItCurrect = "ДА";
                    }
                    console.log(isItCurrect);
                } else if (item.attributes.complexity == "B") {
                    isItCurrect = totalMinutes - complexity[1].time;
                    if (isItCurrect >= 0) {
                        isItCurrect = "НЕТ";
                    } else {
                        isItCurrect = "ДА";
                    }
                    // console.log(isItCurrect);
                } else if (item.attributes.complexity == "C") {
                    isItCurrect = totalMinutes - complexity[2].time;
                    if (isItCurrect >= 0) {
                        isItCurrect = "НЕТ";
                    } else {
                        isItCurrect = "ДА";
                    }
                    // console.log(isItCurrect);
                }
            } else {
                isItCurrect = item.attributes.Progress;
            }

            return {
                ticket: item.id,
                Исполнитель: item.attributes.updatedBy.data
                    ? item.attributes.updatedBy.data.attributes.firstname
                    : "N/A",
                "Имя пользователя": item.attributes.userName,
                "Номер пользователя": item.attributes.userPhone,
                Отдел: item.attributes.userSide,
                "Комментарий пользователя": item.attributes.userComment,
                "Дата создания": new Date(
                    item.attributes.createdAt
                ).toLocaleString(),
                "Дата обновления": new Date(
                    item.attributes.updatedAt
                ).toLocaleString(),
                Категория: item.attributes.complexity,
                Прогресс: item.attributes.Progress,
                "Время изменения заявки": this.calculateWorkingTime(
                    item.attributes.createdAt,
                    item.attributes.updatedAt
                ),
                "Достигнута задача": isItCurrect,
            };
        });

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
            { wch: 30 },
            { wch: 30 },
            { wch: 30 }, // ширина для столбца 'closedAt'
        ]; // Конвертация данных в лист Excel
        const workbook = XLSX.utils.book_new(); // Создание новой книги
        XLSX.utils.book_append_sheet(workbook, worksheet, "Отчет"); // Добавление листа в книгу
        XLSX.writeFile(
            workbook,
            `${transformedData[0]["Исполнитель"]}_HelpDesk_kpi_отчет.xlsx`
        );
        this.currentPage = 1; // Сохранение файла
    }
}

export default new Review();
