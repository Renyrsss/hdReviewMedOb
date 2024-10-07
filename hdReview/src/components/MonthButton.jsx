const months = [
    { name: "Январь", days: 31 },
    { name: "Февраль", days: 28 }, // 29 в високосный год
    { name: "Март", days: 31 },
    { name: "Апрель", days: 30 },
    { name: "Май", days: 31 },
    { name: "Июнь", days: 30 },
    { name: "Июль", days: 31 },
    { name: "Август", days: 31 },
    { name: "Сентябрь", days: 30 },
    { name: "Октябрь", days: 31 },
    { name: "Ноябрь", days: 30 },
    { name: "Декабрь", days: 31 },
];

// Функция для проверки високосного года
const isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

import React, { useState } from "react";
import "./btn.css";
const MonthButtons = ({ onMonthChange }) => {
    const currentYear = new Date().getFullYear();
    const [selectedMonth, setSelectedMonth] = useState(null);

    // Если год високосный, увеличиваем количество дней в феврале
    if (isLeapYear(currentYear)) {
        months[1].days = 29;
    }

    const handleMonthClick = (index) => {
        const startOfMonth = new Date(currentYear, index, 1).toISOString();
        const endOfMonth = new Date(
            currentYear,
            index,
            months[index].days,
            23,
            59,
            59
        ).toISOString();

        setSelectedMonth(index);
        onMonthChange(startOfMonth, endOfMonth); // Передаем даты в родительский компонент
    };

    return (
        <div>
            {months.map((month, index) => (
                <button
                    key={index}
                    className="btn"
                    onClick={() => handleMonthClick(index)}
                    style={{
                        backgroundColor:
                            selectedMonth === index ? "lightblue" : "white",
                    }}
                >
                    {month.name}
                </button>
            ))}
        </div>
    );
};

export default MonthButtons;
