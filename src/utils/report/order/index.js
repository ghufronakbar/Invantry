import ExcelJS from 'exceljs';

const formatShortDateIndonesian = (date) => {
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    const formattedDate = new Intl.DateTimeFormat('id-ID', options).format(new Date(date));
    return formattedDate.replace('Agt', 'Agu').replace('Des', 'Des').replace('Mei', 'Mei');
};

const generateXLSRekap = async (up3Groups) => {
    const thinBorder = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
    };

    const workbook = new ExcelJS.Workbook();

    Object.keys(up3Groups).forEach(up3Name => {
        const worksheet = workbook.addWorksheet(up3Name, {
            pageSetup: { paperSize: 9, orientation: 'landscape' }
        });
        worksheet.properties.defaultRowHeight = 17;

        worksheet.columns = [
            { width: 5 },   // NO
            { width: 30 },  // NO WO
            { width: 18 },  // TGL WO
            { width: 25 },  // LOKASI
            { width: 15 },  // ULP
            { width: 13 },  // ORDER
            { width: 13 },  // RINCIAN
            { width: 13 },  // TERKIRIM
            { width: 13 },  // BERDIRI
            { width: 15 },  // STATUS
            { width: 20 },  // TANGGAL
            { width: 20 },  // NOMER BAPL
            { width: 20 }   // TGL BAPL
        ];

        const headers = [
            'NO', 'NO WO', 'TGL WO', 'LOKASI', 'ULP', 'ORDER',
            'RINCIAN', 'TERKIRIM', 'BERDIRI', 'STATUS', 'TANGGAL',
            'NOMER BAPL', 'TGL BAPL'
        ];
        const headerRow = worksheet.addRow(headers);
        headerRow.height = 30;
        headerRow.eachCell((cell) => {
            cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
            cell.font = { bold: true };
            cell.border = thinBorder;
        });

        up3Groups[up3Name].forEach((item, index) => {
            const lastTrackingIndex = item.trackings.length - 1;
            const trackingDate = item.trackings[lastTrackingIndex] ? formatShortDateIndonesian(item.trackings[lastTrackingIndex].createdAt) : '';

            const dataRow = worksheet.addRow([
                index + 1,
                item.pkWo,
                formatShortDateIndonesian(item.createdAt),
                item.location,
                item.ulp,
                item.amount,
                item.amount,
                item.amount,
                item.amount,
                item.trackings[lastTrackingIndex] ? (item.trackings[lastTrackingIndex].status === 'INSTALLED' ? 'Terpasang' : 'Tidak Terpasang') : 'N/A',
                trackingDate,
                item.order.dossier,
                formatShortDateIndonesian(item.order.dateBapl),
            ]);

            
            dataRow.eachCell((cell, colNumber) => {
                cell.border = thinBorder;

                if (colNumber !== 2 && colNumber !== 4) {
                    cell.alignment = { horizontal: 'center', vertical: 'middle' };
                }
            });
        });

        for (let i = 0; i < 3; i++) {
            const emptyRow = worksheet.addRow(['', '', '', '', '', '', '', '', '', '', '', '', '']);

            emptyRow.eachCell({ includeEmpty: true }, (cell) => {
                cell.border = thinBorder;
            });
        }


        const lastDataRowNumber = worksheet.lastRow.number;
        const totalRow = worksheet.addRow([
            '',
            'TOTAL',
            '',
            '',
            '',
            { formula: `SUM(F2:F${lastDataRowNumber})` },
            { formula: `SUM(G2:G${lastDataRowNumber})` },
            { formula: `SUM(H2:H${lastDataRowNumber})` },
            { formula: `SUM(I2:I${lastDataRowNumber})` },
            '',
            '',
            '',
            ''
        ]);

        worksheet.mergeCells(`B${totalRow.number}:E${totalRow.number}`);

        totalRow.eachCell((cell) => {
            cell.border = thinBorder;
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFF00' }
            };
            cell.font = { bold: true };
            if (cell.value && cell.value.formula) {
                cell.alignment = { horizontal: 'center' };
            }
        });

        const kuotaRow = worksheet.addRow(['', 'KUOTA', '', '', '', '10', '', '', '', '', '', '', '']);
        worksheet.mergeCells(`B${kuotaRow.number}:E${kuotaRow.number}`);

        kuotaRow.eachCell((cell, colNumber) => {
            cell.border = thinBorder;
            if (colNumber === 6) {
                cell.font = { color: { argb: 'FF0000FF' }, bold: true };
            }
        });

        const sisaKuotaRow = worksheet.addRow(['', 'SISA KUOTA', '', '', '', { formula: `F${totalRow.number} - F${kuotaRow.number}` }, '', '', '', '', '', '', '']);
        worksheet.mergeCells(`B${sisaKuotaRow.number}:E${sisaKuotaRow.number}`);

        sisaKuotaRow.eachCell((cell, colNumber) => {
            cell.border = thinBorder;
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFF00' }
            };
            if (colNumber === 6) {
                cell.font = { color: { argb: 'FFFF0000' }, bold: true };
            }
        });

        const prosentaseRow = worksheet.addRow(['', 'PROSENTASE PENYERAPAN', '', '', '', { formula: `F${totalRow.number} / F${kuotaRow.number} * 100` }, '', '', '', '', '', '', '']);
        worksheet.mergeCells(`B${prosentaseRow.number}:E${prosentaseRow.number}`);
        prosentaseRow.eachCell((cell, colNumber) => {
            cell.border = thinBorder;
            cell.font = { bold: true };
            if (colNumber === 6) {
                cell.numFmt = '0.00"%"';
            }
        });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    console.log('Excel file with multiple sheets based on UP3 created successfully!');
    return buffer;
};

export default generateXLSRekap;
