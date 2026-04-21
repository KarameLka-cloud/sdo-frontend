import {JSX, useState} from "react";
import OverflowScrollBlock from "@components/ui/OverflowScrollBlock/OverflowScrollBlock.tsx";
import CareerDay from "@components/ui/CareerDay/CareerDay.tsx";
import {CareerDayType, TaskStatus} from "@interfaces/api/CareerDayType.ts";
import styles from "./Career.module.css";

function Career(): JSX.Element {
    // Mock данные - в реальном приложении это будет от API
    const [careerDays, setCareerDays] = useState<CareerDayType[]>([
        {
            id: 1,
            workDay: 1,
            date: "2026-04-20",
            tasks: [
                { id: 1, description: "Ознакомление с коллективом", status: "выполнено" },
                { id: 2, description: "Изучение структуры отдела", status: "выполнено" },
                { id: 3, description: "Получение инструментов и доступов", status: "выполнено" }
            ],
            completion: "выполнен",
            responsible: "Иван Петров",
            employeeComment: "Первый день прошел хорошо, коллектив дружелюбный",
            internComment: "Было интересно познакомиться с командой",
            mentorComment: "Стажер проявил инициативу и внимательность",
            departmentHeadComment: "Впечатление положительное"
        },
        {
            id: 2,
            workDay: 2,
            date: "2026-04-21",
            tasks: [
                { id: 4, description: "Обучение системам", status: "выполнено" },
                { id: 5, description: "Изучение документации", status: "не выполнено" },
                { id: 6, description: "Первые практические упражнения", status: "не выполнено" }
            ],
            completion: "есть замечания",
            responsible: "Мария Сидорова",
            employeeComment: "Много информации, но интересно",
            internComment: "Начал изучать документацию",
            mentorComment: "Хорошо усваивает материал"
        },
        {
            id: 3,
            workDay: 3,
            date: "2026-04-22",
            tasks: [
                { id: 7, description: "Участие в проектных встречах", status: "не выполнено" },
                { id: 8, description: "Выполнение простых задач", status: "не выполнено" },
                { id: 9, description: "Подготовка отчета", status: "не выполнено" }
            ],
            completion: "в процессе",
            responsible: "Алексей Кузнецов",
            employeeComment: "",
            internComment: "Выполнил все задачи",
            mentorComment: "Прогресс очевиден"
        }
    ]);

    const handleUpdateInternComment = (dayId: number | undefined, comment: string) => {
        if (dayId !== undefined) {
            setCareerDays(prevDays =>
                prevDays.map(day =>
                    day.id === dayId ? {...day, internComment: comment} : day
                )
            );
        }
    };

    const handleUpdateTaskStatus = (dayId: number | undefined, taskId: number | undefined, status: TaskStatus) => {
        if (dayId !== undefined && taskId !== undefined) {
            setCareerDays(prevDays =>
                prevDays.map(day =>
                    day.id === dayId
                        ? {
                            ...day,
                            tasks: Array.isArray(day.tasks)
                                ? day.tasks.map(task =>
                                    task.id === taskId ? {...task, status} : task
                                )
                                : day.tasks
                        }
                        : day
                )
            );
        }
    };

    return (
        <OverflowScrollBlock header_name={'Карьера'}>
            <div className={styles.careerContainer}>
                {careerDays.map(day => (
                    <CareerDay
                        key={day.id}
                        day={day}
                        onUpdateInternComment={handleUpdateInternComment}
                        onUpdateTaskStatus={handleUpdateTaskStatus}
                    />
                ))}
            </div>
        </OverflowScrollBlock>
    );
}

export default Career;
