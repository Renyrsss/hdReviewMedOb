import {
    Card,
    Typography,
    List,
    ListItem,
    ListItemPrefix,
    ListItemSuffix,
    Chip,
} from "@material-tailwind/react";
import {
    PresentationChartBarIcon,
    ShoppingBagIcon,
    UserCircleIcon,
    Cog6ToothIcon,
    InboxIcon,
    PowerIcon,
} from "@heroicons/react/24/solid";
import { observable } from "mobx";
import { observer } from "mobx-react-lite";
import Review from "../store/Review";

const Aside = observer(() => {
    const dima = "&filters[$and][0][executor][$containsi]=Дмитрий";
    const vadim = "&filters[$and][0][executor][$containsi]=Вадим";

    return (
        <Card className="h-[calc(100vh-2rem)] sticky top-0 w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5  ">
            <div className="mb-2 p-4">
                <Typography variant="h5" color="blue-gray">
                    Дэшборд
                </Typography>
            </div>
            <List className=" flex flex-col">
                {/* <ListItem
                    onClick={() => {
                        Review.userApi("все");
                    }}
                >
                    <ListItemPrefix>
                        <PresentationChartBarIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Все заявки
                </ListItem> */}
                <ListItem
                    selected={Review.selectedUser === 1}
                    onClick={() => {
                        // Review.userApi("Дмитрий");
                        Review.changeSelectedUser(1);
                        Review.resetBtnFunc(false);
                        Review.changeUrl(
                            "http://192.168.101.25:1337/api/skud-zaprosy-help-desks?sort=id:DESC&filters[$and][0][Progress][$eq]=Сделано"
                        );
                    }}
                >
                    <ListItemPrefix>
                        <UserCircleIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Куат
                </ListItem>
                <ListItem
                    selected={Review.selectedUser === 2}
                    onClick={() => {
                        // Review.userApi("Саид");
                        Review.changeSelectedUser(2);
                        Review.resetBtnFunc(false);
                        Review.changeUrl(
                            "http://192.168.101.25:1337/api/saids?sort=id:DESC&filters[$and][0][Progress][$eq]=Сделано"
                        );
                    }}
                >
                    <ListItemPrefix>
                        <UserCircleIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Саид
                </ListItem>

                <ListItem
                    selected={Review.selectedUser === 3}
                    onClick={() => {
                        // Review.userApi("Дмитрий");
                        Review.changeSelectedUser(3);
                        Review.resetBtnFunc(false);
                        Review.changeUrl(
                            "http://192.168.101.25:1337/api/bahadors?sort=id:DESC&filters[$and][0][Progress][$eq]=Сделано"
                        );
                    }}
                >
                    <ListItemPrefix>
                        <UserCircleIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Баходыр
                </ListItem>
                <ListItem
                    selected={Review.selectedUser === 4}
                    onClick={() => {
                        // Review.userApi("Дмитрий");
                        Review.changeSelectedUser(4);
                        Review.resetBtnFunc(false);
                        Review.changeUrl(
                            "http://192.168.101.25:1337/api/ernar-and-timurs?sort=id:DESC&filters[updatedBy][id][$eq]=3&filters[$and][0][Progress][$eq]=Сделано"
                        );
                    }}
                >
                    <ListItemPrefix>
                        <UserCircleIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Ернар
                </ListItem>
                <ListItem
                    selected={Review.selectedUser === 5}
                    onClick={() => {
                        // Review.userApi("Дмитрий");
                        Review.changeSelectedUser(5);
                        Review.resetBtnFunc(false);
                        Review.changeUrl(
                            "http://192.168.101.25:1337/api/ernar-and-timurs?sort=id:DESC&filters[updatedBy][id][$eq]=7&filters[$and][0][Progress][$eq]=Сделано"
                        );
                    }}
                >
                    <ListItemPrefix>
                        <UserCircleIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Жандос
                </ListItem>
            </List>
        </Card>
    );
});
export default Aside;
