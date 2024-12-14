import ExcelJS from 'exceljs';
import fetch from 'node-fetch';

const formatShortDate = (date) => {
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    return new Intl.DateTimeFormat('id-ID', options).format(new Date(date));
};

function getFormattedDateInIndonesian(data, fontName, fontBold) {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    const parsedDate = new Date(data);
    const day = days[parsedDate.getDay()];
    const date = parsedDate.getDate();
    const month = months[parsedDate.getMonth()];
    const year = parsedDate.getFullYear();

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


const generateXLSBAPL = async (data, imageBuffers, groupOrders) => {

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(data.up3, {
        pageSetup: { paperSize: 9, orientation: 'portrait' }
    });

    worksheet.properties.defaultRowHeight = 20;
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

    // worksheet.pageSetup.margins = {
    //     left: 0.3937,
    //     right: 0.1968,
    //     top: 0.7480,
    //     bottom: 0.7480,
    // };
    const groupOrdersLength = groupOrders.length;

    if (groupOrdersLength === 1) {
        worksheet.pageSetup = { ...worksheet.pageSetup, scale: 61 }; // Skala untuk 1 item
    } else if (groupOrdersLength === 2) {
        worksheet.pageSetup = { ...worksheet.pageSetup, scale: 59 }; // Skala untuk 2 item
    } else {
        worksheet.pageSetup = { ...worksheet.pageSetup, scale: 57 }; // Default skala untuk lebih dari 2 item
    }


    const setCell = (cell, value, font, alignment = {}, border = {}) => {
        cell.value = value;
        cell.font = font;
        cell.alignment = alignment;
        cell.border = border;
    };

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

    worksheet.mergeCells('A1:I1');
    setCell(worksheet.getCell('A1'), 'BERITA ACARA', fontHeader, { horizontal: 'center' });

    worksheet.mergeCells('A2:I2');
    setCell(worksheet.getCell('A2'), 'PEMERIKSAAN LAPANGAN', fontHeader, { horizontal: 'center' });
    
   

    worksheet.mergeCells('A3:I3');
    setCell(worksheet.getCell('E3'), `No: ${data.dossier} BA/LOG.01.01/F04110000/2024`, fontName, { horizontal: 'center' });

    worksheet.mergeCells('A5:I6');

    setCell(
        worksheet.getCell('A5'),
        { richText: getFormattedDateInIndonesian(data.dateBapl, fontName, fontBold) },
        fontName,
        { wrapText: true, vertical: 'top', horizontal: 'left' }
    );
    worksheet.getRow(7).height = 8;
    worksheet.getRow(8).height = 8;

    const keyValues = [
        { row: 9, key: 'Nama Perusahaan', value: data.firstCompanyName },
        { row: 10, key: 'Alamat', value: data.firstCompanyAddress },
        { row: 11, key: 'Diwakili Oleh', value: data.firstCompanyRepresentateBy },
        { row: 12, key: 'Bertindak Sebagai', value: data.firstCompanyRepresentateActAs },
        { row: 15, key: 'Nama Perusahaan', value: data.secondCompanyName },
        { row: 16, key: 'Alamat', value: data.secondCompanyAddress },
        { row: 17, key: 'Diwakili Oleh', value: data.secondCompanyRepresentateBy },
        { row: 18, key: 'Bertindak Sebagai', value: data.secondCompanyRepresentateActAs },
    ];
    let count = 1;

    keyValues.forEach(item => {
        worksheet.mergeCells(`D${item.row}:I${item.row}`);

        if (item.key === 'Nama Perusahaan') {
            setCell(worksheet.getCell(`A${item.row}`), `${count}`, fontName, { horizontal: 'center' });
            count++; 
        }

        setCell(worksheet.getCell(`B${item.row}`), item.key, fontName, {});
        setCell(worksheet.getCell(`C${item.row}`), ':', fontName, { horizontal: 'center' });
        setCell(worksheet.getCell(`D${item.row}`), item.value, fontName, {});
    });

    const pihakValue = [
        { row: 13, key: '', value: { richText: [{ text: 'Selanjutnya disebut sebagai ', font: fontName }, { text: 'PIHAK PERTAMA ( I )', font: fontBold }] } },
        { row: 19, key: '', value: { richText: [{ text: 'Selanjutnya disebut sebagai ', font: fontName }, { text: 'PIHAK KEDUA ( II )', font: fontBold }] } }

    ];

    pihakValue.forEach(item => {
        worksheet.mergeCells(`B${item.row}:I${item.row}`);
        setCell(worksheet.getCell(`D${item.row}`), item.value, fontName, {});
    });

    worksheet.mergeCells('A21:I21');
    worksheet.getCell('A21').value = {
        richText: [
            { text: 'PIHAK PERTAMA ( I ) ', font: fontBold },
            { text: 'dan ', font: fontName },
            { text: 'PIHAK KEDUA ( II ) ', font: fontBold },
            { text: 'mengadakan pemeriksaan pekerjaan lapangan sesuai dengan :', font: fontName },
        ]
    };

    const keyValues2 = [
        { row: 23, key: 'Nomor KR', value: data.kr },
        { row: 24, key: 'PLN UP3', value: data.up3 },
        { row: 25, key: 'No PK / WO', value: data.pkWo },
        { row: 26, key: 'Tanggal', value: formatShortDate(data.createdAt) },
    ];

    keyValues2.forEach(item => {
        worksheet.mergeCells(`D${item.row}:I${item.row}`);
        setCell(worksheet.getCell(`B${item.row}`), item.key, fontName, {});
        setCell(worksheet.getCell(`C${item.row}`), ':', fontName, { horizontal: true });
        setCell(worksheet.getCell(`D${item.row}`), item.value, fontName, {});
    });



    const headers = [
        { col: 'B28', value: 'Uraian' },
        { col: 'C28', value: 'Sat' },
        { col: 'D28', value: 'VOLUME' },
        { col: 'E28', value: 'LOKASI' },
        { col: 'F28', value: 'RAYON' },
        { col: 'G28', value: 'TGL VENDOR TERIMA PO/WO' },
        { col: 'H28', value: 'TGL SELESAI PO/WO' },
        { col: 'I28', value: 'Keterangan' }
    ];

    headers.forEach(header => {
        worksheet.getRow(28).height = 50;
        setCell(worksheet.getCell(header.col), header.value, fontBoldTable, { horizontal: 'center', vertical: 'middle', wrapText: true }, thinBorder);
    });

    

    let startRow = 29;
    const dynamicTableData = groupOrders.map(order => ({
        uraian: order.itemName + ' ' + order.length + ' m ' + `(${order.horizontalLoad} daN)`,
        sat: 'btg',
        volume: order.amount,
        lokasi: order.location,
        rayon: order.ulp.replace(/^ULP\s*/, ''),
        tglTerima: formatShortDate(order.receivedAt),
        tglSelesai: formatShortDate(order.trackings[4]?.createdAt || null),
        keterangan: order.message || 'N/A'
    }));

    dynamicTableData.forEach((item, index) => {
        const currentRow = startRow + index;
        worksheet.getRow(currentRow).height = 50;

        setCell(worksheet.getCell(`B${currentRow}`), item.uraian, fontTable, { horizontal: 'center', vertical: 'middle', wrapText: true }, thinBorder);
        setCell(worksheet.getCell(`C${currentRow}`), item.sat, fontTable, { horizontal: 'center', vertical: 'middle' }, thinBorder);
        setCell(worksheet.getCell(`D${currentRow}`), item.volume, fontTable, { horizontal: 'center', vertical: 'middle' }, thinBorder);
        setCell(worksheet.getCell(`E${currentRow}`), item.lokasi, fontTable, { horizontal: 'left', vertical: 'middle', wrapText: true }, thinBorder);
        setCell(worksheet.getCell(`F${currentRow}`), item.rayon, fontTable, { horizontal: 'center', vertical: 'middle', wrapText: true }, thinBorder);
        setCell(worksheet.getCell(`G${currentRow}`), item.tglTerima, fontTable, { horizontal: 'center', vertical: 'middle', wrapText: true }, thinBorder);
        setCell(worksheet.getCell(`H${currentRow}`), item.tglSelesai || '-', fontTable, { horizontal: 'center', vertical: 'middle', wrapText: true }, thinBorder);
        setCell(worksheet.getCell(`I${currentRow}`), item.keterangan, fontTable, { horizontal: 'center', vertical: 'middle', wrapText: true }, thinBorder);
    });

    const summaryRow = startRow + dynamicTableData.length;
    setCell(worksheet.getCell(`B${summaryRow}`), 'JUMLAH', fontBoldTable, { horizontal: 'center', vertical: 'middle' }, thinBorder);
    setCell(worksheet.getCell(`C${summaryRow}`), 'btg', fontTable, { horizontal: 'center', vertical: 'middle' }, thinBorder);
    setCell(worksheet.getCell(`D${summaryRow}`), dynamicTableData.reduce((total, item) => total + item.volume, 0), fontTable, { horizontal: 'center', vertical: 'middle' }, thinBorder);
    setCell(worksheet.getCell(`E${summaryRow}`), '', fontTable, { horizontal: 'center', vertical: 'middle' }, thinBorder);
    setCell(worksheet.getCell(`F${summaryRow}`), '', fontTable, { horizontal: 'center', vertical: 'middle' }, thinBorder);
    setCell(worksheet.getCell(`G${summaryRow}`), '-', fontTable, { horizontal: 'center', vertical: 'middle' }, thinBorder);
    setCell(worksheet.getCell(`H${summaryRow}`), '-', fontTable, { horizontal: 'center', vertical: 'middle' }, thinBorder);
    setCell(worksheet.getCell(`I${summaryRow}`), '-', fontTable, { horizontal: 'center', vertical: 'middle' }, thinBorder); 
    worksheet.getRow(summaryRow).height = 50;

    const totalVolume = dynamicTableData.reduce((sum, item) => sum + parseInt(item.volume, 10), 0);
    setCell(worksheet.getCell(`D${summaryRow}`), totalVolume.toString(), fontTable, { horizontal: 'center', vertical: 'middle' }, thinBorder);

    // TTD 
    const finalTextStartRow = summaryRow + 2;

    worksheet.mergeCells(`A${finalTextStartRow}:I${finalTextStartRow}`);

    const cell = worksheet.getCell(`A${finalTextStartRow}`);
    cell.value = {
        richText: [
            { text: 'PIHAK PERTAMA ( I ) ', font: fontBold },
            { text: 'telah memeriksa pekerjaan pengiriman dan pemasangan dari ', font: fontName },
            { text: 'PIHAK KEDUA ( II )', font: fontBold },
            { text: ' pada ', font: fontName },
            { text: `Pekerjaan Pengadaan ${data.title} wilayah PT PLN Distribusi Jawa Timur UP3 ${data.up3} `, font: fontBold },
            { text: 'dalam keadaan BAIK dan CUKUP ', font: fontName },
        ],
    };
    cell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
    worksheet.getRow(finalTextStartRow).height = 75;

    const finalTextRow2 = finalTextStartRow + 2;
    worksheet.mergeCells(`A${finalTextRow2}:I${finalTextRow2}`);
    setCell(worksheet.getCell(`A${finalTextRow2}`), 'Demikian berita acara ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.', fontName, { horizontal: 'left', vertical: 'middle', wrapText: true });

    const signatureStartRow = finalTextRow2 + 2;
    
    // header pihak pertama
    worksheet.mergeCells(`B${signatureStartRow}:E${signatureStartRow}`);
    worksheet.mergeCells(`G${signatureStartRow}:I${signatureStartRow}`);

    // header pihak kedua
    worksheet.mergeCells(`B${signatureStartRow + 1}:D${signatureStartRow + 1}`);
    worksheet.mergeCells(`G${signatureStartRow + 1}:I${signatureStartRow + 1}`);

    // nama pihak pertama
    worksheet.mergeCells(`B${signatureStartRow + 6}:E${signatureStartRow + 6}`);
    worksheet.mergeCells(`G${signatureStartRow + 6}:I${signatureStartRow + 6}`);

    // nama pihak kedua
    worksheet.mergeCells(`B${signatureStartRow + 7}:D${signatureStartRow + 7}`);
    worksheet.mergeCells(`G${signatureStartRow + 7}:I${signatureStartRow + 7}`);

    worksheet.getRow(signatureStartRow + 1).height = 60;

    const signatureSections = [
        { row: signatureStartRow, col: 'B', value: 'PIHAK KEDUA (II)', font: fontBold },
        { row: signatureStartRow + 1, col: 'B', value: data.secondCompanyName, font: fontName },
        { row: signatureStartRow + 6, col: 'B', value: data.secondCompanyRepresentateBy, font: fontBold },
        { row: signatureStartRow + 7, col: 'B', value: data.secondCompanyRepresentateActAs, font: fontName },
        { row: signatureStartRow, col: 'G', value: 'PIHAK PERTAMA (I)', font: fontBold },
        { row: signatureStartRow + 1, col: 'G', value: data.firstCompanyName, font: fontName, wrapText: true },
        { row: signatureStartRow + 6, col: 'G', value: data.firstCompanyRepresentateBy, font: fontBold },
        { row: signatureStartRow + 7, col: 'G', value: data.firstCompanyRepresentateActAs, font: fontName }
    ];

    signatureSections.forEach(section => {
        const cell = worksheet.getCell(`${section.col}${section.row}`);
        setCell(cell, section.value, section.font, { horizontal: 'left', vertical: 'top', wrapText: true });
    });

    const newRow = worksheet.addRow([]);
    newRow.addPageBreak();

    const headingRow = newRow.number + 1;

    worksheet.mergeCells(`A${headingRow}:G${headingRow}`);
    worksheet.getCell(`A${headingRow}`).value = 'PT WIJAYA KARYA BETON Tbk                    ';
    worksheet.getCell(`A${headingRow}`).font = fontBold;
    worksheet.getCell(`A${headingRow}`).alignment = { horizontal: 'right', vertical: 'middle' };
    worksheet.getCell(`H${headingRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getRow(headingRow).height = 90;


    const imageUrl = 'https://res.cloudinary.com/dla5fna8n/image/upload/v1730650753/LOGO-WIKA-BETON-2024_2_bdvyvx.png';
    const response = await fetch(imageUrl);
    const imageBuffer = await response.buffer();

    const imageId = workbook.addImage({
        buffer: imageBuffer,
        extension: 'jpg'
    });

    worksheet.addImage(imageId, {
        tl: { col: 7, row: headingRow - 0.8 },
        ext: { width: 250, height: 67 },
        editAs: 'oneCell'
    });

    // header wo 
    const lampiranHeaderRow = headingRow + 1;
    worksheet.mergeCells(`A${lampiranHeaderRow}:I${lampiranHeaderRow}`);
    worksheet.getCell(`A${lampiranHeaderRow}`).value = `WO No. ${data.pkWo}`;
    worksheet.getCell(`A${lampiranHeaderRow}`).font = fontBold;
    worksheet.getCell(`A${lampiranHeaderRow}`).alignment = { horizontal: 'center' };
    // worksheet.getCell(`A${lampiranHeaderRow}`).border = { top: thinBorder.top, left: thinBorder.left };
    worksheet.getCell(`I${lampiranHeaderRow}`).border = { top: thinBorder.top, right: thinBorder.right, left: thinBorder.left, bottom: thinBorder.bottom };

    // // header batang
    let currentRow = lampiranHeaderRow + 1;
    // groupOrders.forEach((order, index) => {
    //     const subHeaderRow = currentRow + index;

    //     worksheet.mergeCells(`A${subHeaderRow}:I${subHeaderRow}`);
    //     worksheet.getCell(`A${subHeaderRow}`).value = `${order.length}M - ${order.horizontalLoad} daN ${order.amount} batang`;
    //     worksheet.getCell(`A${subHeaderRow}`).font = fontBold;
    //     worksheet.getCell(`A${subHeaderRow}`).alignment = { horizontal: 'center' };

    //     worksheet.getCell(`A${subHeaderRow}`).border = { left: thinBorder.left };
    //     worksheet.getCell(`I${subHeaderRow}`).border = { right: thinBorder.right, left: thinBorder.left };
    //     if (index === groupOrders.length - 1) {
    //         worksheet.getCell(`A${subHeaderRow}`).border = { ...worksheet.getCell(`A${subHeaderRow}`).border, bottom: thinBorder.bottom };
    //         worksheet.getCell(`I${subHeaderRow}`).border = { ...worksheet.getCell(`I${subHeaderRow}`).border, bottom: thinBorder.bottom };
    //     }
    // });

    currentRow += groupOrders.length;
    imageBuffers.forEach(({ orderItemId, imageBuffers }, orderIndex) => {
        const order = groupOrders[orderIndex]; 
        worksheet.mergeCells(`A${currentRow}:I${currentRow}`);
        worksheet.getCell(`A${currentRow}`).value = `${order.length}M - ${order.horizontalLoad} daN ${order.amount} batang`;
        worksheet.getCell(`A${currentRow}`).font = { bold: true };
        worksheet.getCell(`A${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
        currentRow += 2;

        imageBuffers.forEach((buffer, bufferIndex) => {
            const imageId = workbook.addImage({
                buffer: buffer,
                extension: 'jpg',
            });

            worksheet.addImage(imageId, {
                tl: { col: 4, row: currentRow - 1 },
                ext: { width: 450, height: 450 },
                editAs: 'absolute',
            });

            worksheet.getRow(currentRow).height = 450 / 1.05;
            currentRow += 2;
        });

        worksheet.mergeCells(`A${currentRow}:I${currentRow}`);
        worksheet.getCell(`A${currentRow}`).value = `Instalasi Selesai - ${groupOrders[orderIndex].location}`;
        worksheet.getCell(`A${currentRow}`).font = { bold: true };
        worksheet.getCell(`A${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
        currentRow += 1;

        worksheet.mergeCells(`A${currentRow}:I${currentRow}`);
        worksheet.getCell(`A${currentRow}`).value = `${groupOrders[orderIndex].amount} batang`;
        worksheet.getCell(`A${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
        currentRow += 2;

        if (orderIndex < imageBuffers.length - 1) {
            const newRow = worksheet.addRow([]);
            newRow.addPageBreak();
        }
    });


    currentRow += 1;

    currentRow += groupOrders.length;
    
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;

};

export default generateXLSBAPL;
