const getIndonesianMonthName = (monthNumber) => {
    const monthNames = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    return monthNames[monthNumber];
};

export default getIndonesianMonthName