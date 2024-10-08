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
                    onClick={() => {
                        Review.userApi("Дмитрий");
                    }}
                >
                    <ListItemPrefix>
                        <UserCircleIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Куат
                </ListItem>
                <ListItem
                    onClick={() => {
                        Review.userApi("Саид");
                    }}
                >
                    <ListItemPrefix>
                        <UserCircleIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Саид
                </ListItem>

                <ListItem
                    onClick={() => {
                        Review.userApi("Дмитрий");
                    }}
                >
                    <ListItemPrefix>
                        <UserCircleIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Баходыр
                </ListItem>
                <ListItem
                    onClick={() => {
                        Review.userApi("Дмитрий");
                    }}
                >
                    <ListItemPrefix>
                        <UserCircleIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Ернар
                </ListItem>
                <ListItem
                    onClick={() => {
                        Review.userApi("Дмитрий");
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
