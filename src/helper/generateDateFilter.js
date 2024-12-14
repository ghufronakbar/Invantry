const generateDateFilter = (month = null, year = null) => {
    if (month && year) {
        const startOfMonth = new Date(year, month - 1, 1);
        const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);
        return {
            createdAt: {
                gte: startOfMonth,
                lt: endOfMonth
            }
        };
    } else if (year) {
        const startOfYear = new Date(year, 0, 1);
        const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);
        return {
            createdAt: {
                gte: startOfYear,
                lt: endOfYear
            }
        };
    } else if (month) {
        const startOfMonth = new Date(0, month - 1, 1);
        const endOfMonth = new Date(9999, month, 0, 23, 59, 59, 999);
        return {
            AND: [
                {
                    createdAt: {
                        gte: startOfMonth
                    }
                },
                {
                    createdAt: {
                        lt: endOfMonth
                    }
                }
            ]
        };
    }
    return {};
};

export default generateDateFilter