const paginate = (curPage, curData, totalData) => {
    return {
        currentPage: Number(curPage),
        currentData: Number(curData),
        totalPage: Number(Math.ceil(Number(totalData) / Number(curData))) || 0,
        totalData: Number(totalData),
        cursor: {
            isNextPage: Number(curPage) < Math.ceil(Number(totalData) / Number(curData)),
            isPrevPage: Number(curPage) > 1
        }
    }
}

export default paginate