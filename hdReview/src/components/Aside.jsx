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
import { useState } from "react";

const Aside = observer(() => {
    const dima = "&filters[$and][0][executor][$containsi]=Дмитрий";
    const vadim = "&filters[$and][0][executor][$containsi]=Вадим";
    const [selected, setSelected] = useState(1);
    const setSelectedItem = (value) => setSelected(value);
    return (
        <Card className="h-[calc(100vh-2rem)] sticky top-0 w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5  ">
            <div className="mb-2 p-4">
                <Typography variant="h5" color="blue-gray">
                    Дэшборд
                </Typography>
            </div>
            <List className=" flex flex-col">
                <ListItem
                    selected={selected === 1}
                    onClick={() => {
                        Review.userApi("все");
                        Review.chnageMonthSelectedOrNot("год");
                        Review.changeStyleBtn(false);
                        setSelectedItem(1);
                    }}
                >
                    <ListItemPrefix>
                        <PresentationChartBarIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Все заявки
                </ListItem>
                <ListItem
                    selected={selected === 2}
                    onClick={() => {
                        Review.userApi("Вадим");
                        setSelectedItem(2);
                    }}
                >
                    <ListItemPrefix>
                        <UserCircleIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Вадим
                </ListItem>
                <ListItem
                    selected={selected === 3}
                    onClick={() => {
                        Review.userApi("Дмитрий");
                        setSelectedItem(3);
                    }}
                >
                    <ListItemPrefix>
                        <UserCircleIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Дмитрий
                </ListItem>
            </List>
        </Card>
    );
});
export default Aside;
