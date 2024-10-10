// Pagination.js
import React from "react";
import Review from "../store/Review";
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
} from "@material-tailwind/react"; // Или любой другой импорт для вашей кнопки
const Pagination = ({ pageCount, currentPage }) => {
    const paginationPages = () => {
        const pages = [];

        for (let i = 0; i < pageCount; i++) {
            pages.push(
                <IconButton
                    variant={currentPage === i + 1 ? "outlined" : "text"}
                    size="sm"
                    onClick={() => Review.changePage(i + 1)} // Вызываем метод changePage
                    key={i}
                >
                    {i + 1}
                </IconButton>
            );
        }

        return pages;
    };
    return <div>{paginationPages()}</div>;
};
export default Pagination;
