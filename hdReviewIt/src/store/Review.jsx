import { makeAutoObservable, action } from "mobx";
import axios from "axios";
import * as XLSX from "xlsx";
class Review {
    url =
        "http://192.168.101.25:1337/api/skud-zaprosy-help-desks?sort=id:DESC&filters[$and][0][Progress][$eq]=Сделано";
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
        const transformedData = this.data.map((item) => ({
            ticket: item.id,
            Исполнитель: item.attributes.updatedBy.data.attributes.firstname,
            "Имя пользователя": item.attributes.userName,
            "Номер пользователя": item.attributes.userPhone,
            Отдел: item.attributes.userSide,
            "Комментарий пользователя": item.attributes.userComment,
            "Дата создания": item.attributes.createdAt,
            "Дата обновления": item.attributes.updatedAt,
            Прогресс: item.attributes.Progress,
            "Сделано за ": this.calculateWorkingTime(
                item.attributes.createdAt,
                item.attributes.updatedAt
            ),
        }));
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
    }
}

export default new Review();
