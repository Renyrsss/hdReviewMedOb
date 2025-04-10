import {
    Card,
    Typography,
    List,
    ListItem,
    ListItemPrefix,
} from "@material-tailwind/react";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { observer } from "mobx-react-lite";
import Review from "../store/Review";

const Aside = observer(() => {
    const data = [
        {
            name: "Куат",
            id: 1,
            url: "http://192.168.101.25:1337/api/skud-zaprosy-help-desks?sort=id:DESC",
        },

        {
            name: "Саид",
            id: 2,
            url: "http://192.168.101.25:1337/api/saids?sort=id:DESC",
        },
        {
            name: "Баходыр",
            id: 3,
            url: "http://192.168.101.25:1337/api/bahadors?sort=id:DESC",
        },
        {
            name: "Ернар",
            id: 4,
            url: "http://192.168.101.25:1337/api/ernar-and-timurs?sort=id:DESC&filters[updatedBy][id][$eq]=3",
        },
        {
            name: "Жандос",
            id: 5,
            url: "http://192.168.101.25:1337/api/ernar-and-timurs?sort=id:DESC&filters[updatedBy][id][$eq]=7",
        },
        {
            name: "Айдар",
            id: 6,
            url: "http://192.168.101.25:1337/api/aidars?sort=id:DESC",
        },
        {
            name: "Рустам",
            id: 7,
            url: "http://192.168.101.25:1337/api/rustams?sort=id:DESC",
        },
    ];

    const periodSelector = (id, url) => {
        Review.changeSelectedUser(id);
        Review.resetBtnFunc(false);
        Review.chnageMonthSelectedOrNot("весь период");
        Review.changeUrl(url);
    };
    return (
        <Card className='h-[calc(100vh-2rem)] sticky top-0 w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5  '>
            <div className='mb-2 p-4'>
                <Typography variant='h5' color='blue-gray'>
                    Дэшборд
                </Typography>
            </div>
            <List className=' flex flex-col'>
                {data.map((item) => (
                    <ListItem
                        selected={Review.selectedUser === item.id}
                        onClick={() => periodSelector(item.id, item.url)}>
                        <ListItemPrefix>
                            <UserCircleIcon className='h-5 w-5' />
                        </ListItemPrefix>
                        {item.name}
                    </ListItem>
                ))}
            </List>
        </Card>
    );
});
export default Aside;
