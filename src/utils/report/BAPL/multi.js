import ExcelJS from 'exceljs';

const formatShortDate = (date) => {
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    return new Intl.DateTimeFormat('id-ID', options).format(new Date(date));
};

function getFormattedDateInIndonesian(data, fontName, fontBold) {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    const parsedDate = new Date(data);

    const day = days[parsedDate.getDay()]; // Nama hari
    const date = parsedDate.getDate(); // Tanggal
    const month = months[parsedDate.getMonth()]; // Nama bulan
    const year = parsedDate.getFullYear(); // Tahun

    return [
        { text: 'Pada hari ini ', font: fontName },
        { text: `${day} `, font: fontBold },
        { text: 'tanggal ', font: fontName },
        { text: `${date} `, font: fontBold },
        { text: 'Bulan ', font: fontName },
        { text: `${month} `, font: fontBold },
        { text: 'tahun ', font: fontName },
        { text: `${year} `, font: fontBold },
        { text: 'yang bertanda tangan di bawah ini masing - masing :', font: fontName }
    ];
}
const generateXLSBAPL = async (data) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Berita Acara', {
        pageSetup: { paperSize: 9, orientation: 'portrait' }
    });

    


    worksheet.columns = [
        { width: 4 }, // Column A
        { width: 23 }, // Column B
        { width: 5.2 }, // Column C
        { width: 10 }, // Column D
        { width: 30 }, // Column E
        { width: 14 }, // Column F
        { width: 18 }, // Column G
        { width: 18 }, // Column H
        { width: 19 } // Column I
    ];
    worksheet.pageSetup = { scale: 60 };
    worksheet.properties.defaultRowHeight = 25;


    const fontHeader = { name: 'Times New Roman', size: 14, bold: true, underline: true };
    const fontName = { name: 'Times New Roman', size: 14 };
    const fontTable = { name: 'Times New Roman', size: 11 };
    const fontBold = { name: 'Times New Roman', size: 14, bold: true };
    const fontBoldTable = { name: 'Times New Roman', size: 11, bold: true };
    const thinBorder = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
    };

    const setCell = (cell, value, font, alignment = {}, border = {}) => {
        cell.value = value;
        cell.font = font;
        cell.alignment = alignment;
        cell.border = border;
    };

    let currentRow = 1;

    data.forEach((group) => {
        const order = group.orderInfo;

        worksheet.mergeCells(`A${currentRow}:I${currentRow}`);
        setCell(worksheet.getCell(`A${currentRow}`), 'BERITA ACARA', fontHeader, { horizontal: 'center' });

        worksheet.mergeCells(`A${currentRow + 1}:I${currentRow + 1}`);
        setCell(worksheet.getCell(`A${currentRow + 1}`), 'PEMERIKSAAN LAPANGAN', fontHeader, { horizontal: 'center' });

        worksheet.mergeCells(`A${currentRow + 2}:I${currentRow + 2}`);
        setCell(worksheet.getCell(`E${currentRow + 2}`), `No: ${order.dossier} BA/LOG.01.01/F04110000/2024`, fontName, { horizontal: 'center' });


        worksheet.mergeCells(`A${currentRow + 3}:I${currentRow + 3}`);
        setCell(worksheet.getCell(`E${currentRow + 3}`), '', fontName, { horizontal: 'center' });
        worksheet.getRow(currentRow + 3).height = 7;
        worksheet.mergeCells(`A${currentRow + 4}:I${currentRow + 4}`);
        setCell(worksheet.getCell(`E${currentRow + 4}`), '', fontName, { horizontal: 'center' });
        worksheet.getRow(currentRow + 4).height = 7;

        worksheet.mergeCells(`A${currentRow + 5}:I${currentRow + 6}`);
        setCell(worksheet.getCell(`A${currentRow + 5}`), {
            richText: getFormattedDateInIndonesian(order.dateBapl, fontName, fontBold)
        }, fontName, { wrapText: true, vertical: 'top', horizontal: 'left' });
        
        // Perusahaan
        const keyValues = [
            { row: currentRow + 8, key: 'Nama Perusahaan', value: order.firstCompanyName },
            { row: currentRow + 9, key: 'Alamat', value: order.firstCompanyAddress },
            { row: currentRow + 10, key: 'Diwakili Oleh', value: order.firstCompanyRepresentateBy },
            { row: currentRow + 11, key: 'Bertindak Sebagai', value: order.firstCompanyRepresentateActAs },
            { row: currentRow + 14, key: 'Nama Perusahaan', value: order.secondCompanyName },
            { row: currentRow + 15, key: 'Alamat', value: order.secondCompanyAddress },
            { row: currentRow + 16, key: 'Diwakili Oleh', value: order.secondCompanyRepresentateBy },
            { row: currentRow + 17, key: 'Bertindak Sebagai', value: order.secondCompanyRepresentateActAs },
        ];

        keyValues.forEach((kv, index) => {
            worksheet.mergeCells(`D${kv.row}:I${kv.row}`);
            if (kv.key === 'Nama Perusahaan') {
                const number = index === 0 ? '1' : '2';
                setCell(worksheet.getCell(`A${kv.row}`), number, fontName, { horizontal: 'center' });
            }
            setCell(worksheet.getCell(`B${kv.row}`), kv.key, fontName);
            setCell(worksheet.getCell(`C${kv.row}`), ':', fontName);
            setCell(worksheet.getCell(`D${kv.row}`), kv.value, fontName);
        });



        // Pihak 
        const pihakValue = [
            { row: currentRow + 12, value: { richText: [{ text: 'Selanjutnya disebut sebagai ', font: fontName }, { text: 'PIHAK PERTAMA ( I )', font: fontBold }] } },
            { row: currentRow + 18, value: { richText: [{ text: 'Selanjutnya disebut sebagai ', font: fontName }, { text: 'PIHAK KEDUA ( II )', font: fontBold }] } }
        ];

        pihakValue.forEach(pihak => {
            worksheet.mergeCells(`B${pihak.row}:I${pihak.row}`);
            setCell(worksheet.getCell(`B${pihak.row}`), '', fontName);
            setCell(worksheet.getCell(`D${pihak.row}`), pihak.value, fontName, {});
        });

        worksheet.mergeCells(`A${currentRow + 20}:I${currentRow + 20}`);
        setCell(worksheet.getCell(`A${currentRow + 20}`), {
            richText: [
                { text: 'PIHAK PERTAMA ( I ) ', font: fontBold },
                { text: 'dan ', font: fontName },
                { text: 'PIHAK KEDUA ( II )', font: fontBold },
                { text: ' mengadakan pemeriksaan pekerjaan lapangan sesuai dengan :', font: fontName },
            ]
        });

        // informasi order
        const keyValues2 = [
            { row: currentRow + 22, key: 'Nomor KR', value: order.kr },
            { row: currentRow + 23, key: 'PLN UP3', value: order.up3 },
            { row: currentRow + 24, key: 'No PK / WO', value: group.pkWo },
            { row: currentRow + 25, key: 'Tanggal', value: formatShortDate(order.createdAt) },
        ];

        keyValues2.forEach(kv => {
            worksheet.mergeCells(`D${kv.row}:I${kv.row}`);
            setCell(worksheet.getCell(`B${kv.row}`), kv.key, fontName);
            setCell(worksheet.getCell(`C${kv.row}`), ':', fontName);
            setCell(worksheet.getCell(`D${kv.row}`), kv.value, fontName);
        });

        const headers = [
            { col: `B${currentRow + 27}`, value: 'Uraian' },
            { col: `C${currentRow + 27}`, value: 'Sat' },
            { col: `D${currentRow + 27}`, value: 'VOLUME' },
            { col: `E${currentRow + 27}`, value: 'LOKASI' },
            { col: `F${currentRow + 27}`, value: 'RAYON' },
            { col: `G${currentRow + 27}`, value: 'TGL VENDOR TERIMA PO/WO' },
            { col: `H${currentRow + 27}`, value: 'TGL SELESAI PO/WO' },
            { col: `I${currentRow + 27}`, value: 'Keterangan' }
        ];

        worksheet.getRow(currentRow).height = 60;

        headers.forEach(header => {
            setCell(worksheet.getCell(header.col), header.value, fontBoldTable, { horizontal: 'center', vertical: 'middle', wrapText: true }, thinBorder);
        });

        let itemRow = currentRow + 28;
        const total = group.items.reduce((total, item) => total + Number(item.amount), 0);
        group.items.forEach((item) => {
            // set height 
            worksheet.getRow(itemRow).height = 50;
            setCell(worksheet.getCell(`B${itemRow}`), item.itemName, fontTable, { horizontal: 'left', vertical: 'middle', wrapText: true }, thinBorder);
            setCell(worksheet.getCell(`C${itemRow}`), 'btg', fontTable, { horizontal: 'center', vertical: 'middle', wrapText: true }, thinBorder);
            setCell(worksheet.getCell(`D${itemRow}`), item.amount, fontTable, { horizontal: 'center', vertical: 'middle', wrapText: true }, thinBorder);
            setCell(worksheet.getCell(`E${itemRow}`), item.location, fontTable, { horizontal: 'left', vertical: 'middle', wrapText: true }, thinBorder);
            setCell(worksheet.getCell(`F${itemRow}`), item.ulp.replace(/^ULP\s*/, ''), fontTable, { horizontal: 'center', vertical: 'middle', wrapText: true }, thinBorder);
            setCell(worksheet.getCell(`G${itemRow}`), formatShortDate(item.receivedAt), fontTable, { horizontal: 'center', vertical: 'middle', wrapText: true }, thinBorder);
            setCell(worksheet.getCell(`H${itemRow}`), item.selesai ? formatShortDate(item.selesai) : 'N/A', fontTable, { horizontal: 'center', vertical: 'middle', wrapText: true }, thinBorder);
            setCell(worksheet.getCell(`I${itemRow}`), item.status, fontTable, { horizontal: 'center', vertical: 'middle', wrapText: true }, thinBorder);
            itemRow += 1;
        });
        // add total
        worksheet.getRow(itemRow).height = 50;
        setCell(worksheet.getCell(`B${itemRow}`), 'JUMLAH', fontBoldTable, { horizontal: 'center', vertical: 'middle', wrapText: true }, thinBorder);
        setCell(worksheet.getCell(`C${itemRow}`), 'btg', fontBoldTable, { horizontal: 'center', vertical: 'middle', wrapText: true }, thinBorder);
        setCell(worksheet.getCell(`D${itemRow}`), total, fontBoldTable, { horizontal: 'center', vertical: 'middle', wrapText: true }, thinBorder);
        setCell(worksheet.getCell(`E${itemRow}`), '', fontBoldTable, { horizontal: 'center', vertical: 'middle', wrapText: true }, thinBorder);
        setCell(worksheet.getCell(`F${itemRow}`), '', fontBoldTable, { horizontal: 'center', vertical: 'middle', wrapText: true }, thinBorder);
        setCell(worksheet.getCell(`G${itemRow}`), '', fontBoldTable, { horizontal: 'center', vertical: 'middle', wrapText: true }, thinBorder);
        setCell(worksheet.getCell(`H${itemRow}`), '', fontBoldTable, { horizontal: 'center', vertical: 'middle', wrapText: true }, thinBorder);
        setCell(worksheet.getCell(`I${itemRow}`), '', fontBoldTable, { horizontal: 'center', vertical: 'middle', wrapText: true }, thinBorder);


        // TTD
        const footerRow = itemRow + 1;
        worksheet.getRow(footerRow).height = 90; 
        worksheet.mergeCells(`A${footerRow}:I${footerRow}`);
        const cell = worksheet.getCell(`A${footerRow}`);
        cell.value = {
            richText: [
                { text: 'PIHAK PERTAMA ( I ) ', font: fontBold },
                { text: 'telah memeriksa pekerjaan pengiriman dan pemasangan dari ', font: fontName },
                { text: 'PIHAK KEDUA ( II )', font: fontBold },
                { text: ' pada ', font: fontName },
                { text: `Pekerjaan Pengadaan ${order.title} wilayah PT PLN Distribusi Jawa Timur UP3 ${order.up3} `, font: fontBold },
                { text: 'dalam keadaan BAIK dan CUKUP ', font: fontName },
            ],
        };
        cell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };

        const footerRow2 = footerRow + 1;
        worksheet.getRow(footerRow2).height = 45;
        worksheet.mergeCells(`A${footerRow2}:I${footerRow2}`);
        setCell(worksheet.getCell(`A${footerRow2}`), 'Demikian berita acara ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.', fontName, { horizontal: 'left', vertical: 'middle', wrapText: true });

        const signatureStartRow = footerRow2 + 2;

        worksheet.mergeCells(`B${signatureStartRow}:E${signatureStartRow}`);
        worksheet.mergeCells(`G${signatureStartRow}:I${signatureStartRow}`);

        worksheet.mergeCells(`B${signatureStartRow + 1}:D${signatureStartRow + 1}`);
        worksheet.mergeCells(`G${signatureStartRow + 1}:I${signatureStartRow + 1}`);
        worksheet.getRow(signatureStartRow + 1).height = 60;
        const signatureSections = [
            { row: signatureStartRow, col: 'B', value: 'PIHAK KEDUA (II)', font: fontBold },
            { row: signatureStartRow + 1, col: 'B', value: order.secondCompanyName, font: fontName },
            { row: signatureStartRow + 7, col: 'B', value: order.secondCompanyRepresentateBy, font: fontBold },
            { row: signatureStartRow + 8, col: 'B', value: order.secondCompanyRepresentateActAs, font: fontName },
            { row: signatureStartRow, col: 'G', value: 'PIHAK PERTAMA (I)', font: fontBold },
            { row: signatureStartRow + 1, col: 'G', value: order.firstCompanyName, font: fontName },
            { row: signatureStartRow + 7, col: 'G', value: order.firstCompanyRepresentateBy, font: fontBold },
            { row: signatureStartRow + 8, col: 'G', value: order.firstCompanyRepresentateActAs, font: fontName }
        ];

        worksheet.mergeCells(`B${signatureStartRow + 7}:D${signatureStartRow + 7}`);
        worksheet.mergeCells(`G${signatureStartRow + 7}:I${signatureStartRow + 7}`);

        worksheet.mergeCells(`B${signatureStartRow + 8}:D${signatureStartRow + 8}`);
        worksheet.mergeCells(`G${signatureStartRow + 8}:I${signatureStartRow + 8}`);

        signatureSections.forEach(section => {
            setCell(worksheet.getCell(`${section.col}${section.row}`), section.value, section.font, { horizontal: 'left', vertical: 'top', wrapText: true });
        });
        currentRow = signatureStartRow + 10;
        const newRow = worksheet.addRow([]);
        newRow.addPageBreak();
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
};

export default generateXLSBAPL;
