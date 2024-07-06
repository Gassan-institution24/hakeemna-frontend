import { Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useGetEmployeeEngs } from 'src/api'
import { useLocales, useTranslate } from 'src/locales'
import BookToolbar from '../book-toolbar'
import EmployeeCard from '../employee-card'

export default function BookAppointment() {
    const { t } = useTranslate()
    const { currentLang } = useLocales();
    const curLangAr = currentLang.value === 'ar';

    const [page, setPage] = useState(0)
    const [filters, setFilters] = useState({
        US_type: '',
        speciality: '',
        country: '',
        city: '',
        insurance: '',
        doctor: '',
        rowsPerPage: '',
        sortBy: '',
        order: '',
    })

    const { employeesData } = useGetEmployeeEngs({
        ...filters, page
    })

    const filterChange = (name, e) => {
        setFilters((prev) => ({ ...prev, [name]: e.target.value }))
    }


    return (
        <Stack >
            <BookToolbar filters={filters} filterChange={filterChange} />
            <Stack m={2} gap={4}>
                {employeesData.map((one, index) => (
                    <EmployeeCard employee={one} key={index} />
                ))}
            </Stack>
        </Stack>
    )
}
