import { makeAutoObservable } from "mobx";

class Review {
    url =
        "http://192.168.101.25:1338/api/zayavkis?pagination[pageSize]=10000&sort=id:DESC&filters[$and][0][Progress][$eq]=Сделано";
    count = 0;
    vadim = "";
    constructor() {
        makeAutoObservable(this);
    }

    userApi(user) {
        let urlObj = this.url;
        if (user == "Вадим") {
            if (
                !urlObj.includes(
                    `&filters[$and][0][executor][$containsi]=Вадим`
                )
            ) {
                // Удаляем Дмитрия, если он присутствует
                urlObj = urlObj
                    .split("&filters[$and][0][executor][$containsi]=Дмитрий")
                    .join("");
                // Добавляем Вадима
                urlObj += `&filters[$and][0][executor][$containsi]=Вадим`;
                this.url = urlObj;
            }
        } else if (user == "Дмитрий") {
            if (
                !urlObj.includes(
                    `&filters[$and][0][executor][$containsi]=Дмитрий`
                )
            ) {
                // Удаляем Вадима, если он присутствует
                urlObj = urlObj
                    .split("&filters[$and][0][executor][$containsi]=Вадим")
                    .join("");
                // Добавляем Дмитрия
                urlObj += `&filters[$and][0][executor][$containsi]=Дмитрий`;
                this.url = urlObj;
            }
        } else if (user == "все") {
            console.log(user);

            urlObj =
                "http://192.168.101.25:1338/api/zayavkis?pagination[pageSize]=10000&sort=id:DESC&filters[$and][0][Progress][$eq]=Сделано";

            this.url = urlObj;
        }

        console.log(urlObj);
    }
}

export default new Review();
