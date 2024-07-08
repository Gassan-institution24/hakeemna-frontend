import { Button, Stack, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { useGetEmployeeEngs } from 'src/api'
import { useLocales, useTranslate } from 'src/locales'
import BookToolbar from '../book-toolbar'
import EmployeeCard from '../employee-card'

export default function BookAppointment() {
    const { t } = useTranslate()
    const { currentLang } = useLocales();
    const curLangAr = currentLang.value === 'ar';

    const loadMoreRef = useRef(null);

    const [page, setPage] = useState(0)
    const [filters, setFilters] = useState({
        US_type: '',
        speciality: '',
        country: '',
        city: '',
        insurance: '',
        doctor: '',
        rowsPerPage: 15,
        sortBy: '',
        order: '',
    })


    const [employees, setEmployees] = useState([]);
    const { employeesData, hasMore, loading } = useGetEmployeeEngs({
        ...filters, page
    })

    useEffect(() => {
        if (employeesData) {
            setEmployees((prevEmployees) => [...prevEmployees, ...employeesData]);
        }
    }, [employeesData]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prev) => prev + 1);
                }
            },
            { threshold: 1 }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }
    }, [hasMore]);

    const filterChange = (name, e) => {
        setPage(0)
        setEmployees([])
        setFilters((prev) => ({ ...prev, [name]: e.target.value }))
    }


    return (
        <Stack >
            <BookToolbar filters={filters} filterChange={filterChange} />
            <Stack m={4} gap={2}>
                {employees.map((one, index) => (
                    <EmployeeCard employee={one} key={index} />
                ))}
            </Stack>
            {!loading && employeesData.length > 0 && hasMore && <div ref={loadMoreRef} />}
            {/* {hasMore && <Button onClick={() => setPage((prev) => prev + 1)}>load more</Button>} */}
        </Stack>
    )
}
