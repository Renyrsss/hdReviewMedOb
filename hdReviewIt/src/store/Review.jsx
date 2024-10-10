import { makeAutoObservable, action } from "mobx";

class Review {
    url =
        "http://192.168.101.25:1337/api/saids?sort=id:DESC&filters[$and][0][Progress][$eq]=Сделано";
    count = 0;
    vadim = "";
    currentPage = 1; // начальная страница

    constructor() {
        makeAutoObservable(this, {
            changePage: action, // Явно указываем, что это действие
            updateUrlWithPage: action, // Явно указываем, что это действие
        });
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
}

export default new Review();
